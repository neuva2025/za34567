import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';

const Notification = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Query orders for the current user that have been accepted
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      where('status', 'in', ['accepted', 'delivered'])
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  const formatOrderItems = (items) => {
    if (!items || !items.length) return '';
    return items.map(item => `${item.quantity}x ${item.title}`).join(', ');
  };

  const navigateToOrderDetails = (order) => {
    router.push({
      pathname: '/OrderDetails',
      params: { orderId: order.id }
    });
  };

  const clearDeliveredOrders = async () => {
    Alert.alert(
      'Clear Delivered Orders',
      'Are you sure you want to clear all delivered orders?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              // Filter out delivered orders and update their status to "archived"
              const deliveredOrders = orders.filter(order => order.status === 'delivered');
              
              // Update each order in Firestore
              const updatePromises = deliveredOrders.map(order => 
                updateDoc(doc(db, 'orders', order.id), {
                  status: 'archived'
                })
              );
              
              await Promise.all(updatePromises);
              
              // Update local state
              setOrders(prevOrders => prevOrders.filter(order => order.status !== 'delivered'));
              
              Alert.alert('Success', 'Delivered orders have been cleared');
            } catch (error) {
              console.error('Error clearing orders:', error);
              Alert.alert('Error', 'Failed to clear delivered orders');
            }
          }
        }
      ]
    );
  };

  // Check if we have any delivered orders
  const hasDeliveredOrders = orders.some(order => order.status === 'delivered');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>YOUR ORDERS</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {hasDeliveredOrders && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearDeliveredOrders}
        >
          <Text style={styles.clearButtonText}>Clear Delivered Orders</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.notificationsList}>
        {orders.map((order) => (
          <TouchableOpacity 
            key={order.id} 
            style={[
              styles.notificationItem,
              order.status === 'delivered' && styles.deliveredItem
            ]}
            onPress={() => navigateToOrderDetails(order)}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.restaurantName}>{order.restaurantName}</Text>
              <Text style={styles.orderTotal}>₹{order.total}</Text>
            </View>
            
            <View style={styles.orderDetails}>
              <Text style={styles.itemsList}>
                {formatOrderItems(order.items)}
              </Text>
              <Text style={styles.location}>📍 {order.location}</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.orderTime}>
                  Ordered: {formatDate(order.orderDate)}
                </Text>
                <Text style={styles.acceptedTime}>
                  Accepted: {formatDate(order.acceptedAt)}
                </Text>
              </View>
              
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {order.status === 'accepted' ? '🔄 In Progress' : '✅ Delivered'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {orders.length === 0 && (
          <Text style={styles.noOrders}>No accepted orders found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: '#3E3E3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deliveredItem: {
    backgroundColor: '#2A3A2A', // Different background for delivered orders
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderTotal: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    gap: 4,
  },
  itemsList: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  location: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  timeContainer: {
    marginTop: 8,
  },
  orderTime: {
    color: '#A9A9A9',
    fontSize: 12,
  },
  acceptedTime: {
    color: '#A9A9A9',
    fontSize: 12,
  },
  statusBadge: {
    marginTop: 8,
    backgroundColor: '#444444',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noOrders: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  }
});

export default Notification;