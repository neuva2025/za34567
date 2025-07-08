import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';

const Notification = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Query orders for the current user that have been delivered
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      where('status', '==', 'delivered')
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

  const formatOrderItems = (items) => {
    if (!items || !items.length) return 'No items';
    return items.map(item => item.title).join(', ');
  };

  const clearAllDeliveredOrders = async () => {
    Alert.alert(
      'Clear All Orders',
      'Are you sure you want to clear all delivered orders?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear All',
          onPress: async () => {
            try {
              // Update each order in Firestore to archived status
              const updatePromises = orders.map(order => 
                updateDoc(doc(db, 'orders', order.id), {
                  status: 'archived'
                })
              );
              
              await Promise.all(updatePromises);
              
              // Clear local state
              setOrders([]);
              
              Alert.alert('Success', 'All delivered orders have been cleared');
            } catch (error) {
              console.error('Error clearing orders:', error);
              Alert.alert('Error', 'Failed to clear delivered orders');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Delivered Orders</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {orders.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearAllDeliveredOrders}
        >
          <Text style={styles.clearButtonText}>Clear All Orders</Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.ordersList}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>
                Order #{order.id.slice(-8).toUpperCase()}
              </Text>
              <Text style={styles.deliveredBadge}>✅ Delivered</Text>
            </View>
            
            <View style={styles.orderContent}>
              <Text style={styles.itemsLabel}>Items:</Text>
              <Text style={styles.itemsList}>
                {formatOrderItems(order.items)}
              </Text>
            </View>
          </View>
        ))}
        
        {orders.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No delivered orders</Text>
            <Text style={styles.emptySubtext}>Your delivered orders will appear here</Text>
          </View>
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
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ordersList: {
    flex: 1,
  },
  orderItem: {
    backgroundColor: '#3E3E3E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deliveredBadge: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderContent: {
    gap: 8,
  },
  itemsLabel: {
    color: '#A9A9A9',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#A9A9A9',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Notification;