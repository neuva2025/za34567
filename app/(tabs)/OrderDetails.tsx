import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';

type OrderType = {
  id: string;
  acceptedBy?: string;
  zapperRegNo?: string;
  zapperPhone?: string;
  userId?: string;
  restaurantName?: string;
  location?: string;
  orderDate?: any;
  acceptedAt?: any;
  deliveredAt?: any;
  status?: string;
  items?: { title: string; quantity: number; price: number }[];
  total?: number;
};

const OrderDetails = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [acceptedBy, setAcceptedBy] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) return;

        // Fetch the order
        const orderDoc = await getDoc(doc(db, 'orders', orderId.toString()));
        
        if (orderDoc.exists()) {
          const orderData = { id: orderDoc.id, ...(orderDoc.data() as Omit<OrderType, 'id'>) };
          setOrder(orderData);
          
          // If there's an acceptedBy field, fetch that user's info
          if (orderData.acceptedBy) {
            const userDoc = await getDoc(doc(db, 'users', orderData.acceptedBy));
            
            if (userDoc.exists()) {
              setAcceptedBy(userDoc.data());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (timestamp: Timestamp | null | undefined) => {
  if (!timestamp) return '';
  
  try {
    // Ensure we're working with a Firestore Timestamp
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    }
    
    // If somehow we get a different format, try to convert it
    if (
      typeof timestamp === 'object' &&
      timestamp !== null &&
      'seconds' in timestamp &&
      'nanoseconds' in timestamp &&
      typeof (timestamp as any).seconds === 'number' &&
      typeof (timestamp as any).nanoseconds === 'number'
    ) {
      return new Timestamp(
        (timestamp as { seconds: number; nanoseconds: number }).seconds,
        (timestamp as { seconds: number; nanoseconds: number }).nanoseconds
      ).toDate().toLocaleString();
    }
    
    console.log('Invalid timestamp format:', timestamp);
    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

  const handleCallPress = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to update order status.');
        return;
      }

      if (!order) {
        Alert.alert('Error', 'Order information not found.');
        return;
      }

      // Check if the current user is the one who placed the order
      if (order.userId !== auth.currentUser.uid) {
        Alert.alert('Error', 'Only the person who placed the order can mark it as delivered.');
        return;
      }

      // Update the order status
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveredAt: new Date(),
      });

      // Update local state
      setOrder({
        ...order,
        status: 'delivered',
        deliveredAt: new Date()
      });

      Alert.alert('Success', 'Order marked as delivered!');
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Details</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.orderIdText}>Order ID: {order.id}</Text>
        <Text style={styles.restaurantName}>{order.restaurantName}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <View style={[
            styles.statusBadge, 
            order.status === 'delivered' ? styles.deliveredBadge : 
            order.status === 'accepted' ? styles.acceptedBadge : styles.pendingBadge
          ]}>
            <Text style={styles.statusText}>
              {order.status === 'delivered' ? 'Delivered' : 
               order.status === 'accepted' ? 'Accepted' : 'Pending'}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>📍 {order.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ordered:</Text>
          <Text style={styles.detailValue}>{formatDate(order.orderDate)}</Text>
        </View>
        
        {order.acceptedAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Accepted:</Text>
            <Text style={styles.detailValue}>{formatDate(order.acceptedAt)}</Text>
          </View>
        )}
        
        {order.deliveredAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivered:</Text>
            <Text style={styles.detailValue}>{formatDate(order.deliveredAt)}</Text>
          </View>
        )}
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Items:</Text>
        {order.items && order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.quantity}x {item.title}</Text>
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>₹{order.total}</Text>
        </View>
        
        {order.status === 'accepted' && (
          <>
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Zapper Details:</Text>
            <View style={styles.acceptedByContainer}>
              <Text style={styles.acceptedByName}>{acceptedBy?.name || 'N/A'}</Text>
              
              {order.zapperRegNo && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reg No:</Text>
                  <Text style={styles.detailValue}>{order.zapperRegNo}</Text>
                </View>
              )}
              
              {order.zapperPhone ? (
                <TouchableOpacity 
                  style={styles.callButton} 
                  onPress={() => handleCallPress(order.zapperPhone!)}
                >
                  <Text style={styles.callButtonText}>📞 Call Zapper: {order.zapperPhone}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noPhoneText}>No zapper phone number available</Text>
              )}
              
              {/* Show the "Mark as Delivered" button only to the user who placed the order */}
              {auth.currentUser && order.userId === auth.currentUser.uid && (
                <TouchableOpacity 
                  style={styles.deliveredButton}
                  onPress={handleMarkAsDelivered}
                >
                  <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
        
        {order.acceptedBy && !acceptedBy && (
          <Text style={styles.loadingText}>Could not load delivery person details</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#3E3E3E',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderIdText: {
    color: '#A9A9A9',
    fontSize: 14,
    marginBottom: 8,
  },
  restaurantName: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#555555',
    marginVertical: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingBadge: {
    backgroundColor: '#FFA500',
  },
  acceptedBadge: {
    backgroundColor: '#FFD700',
  },
  deliveredBadge: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    width: 100,
  },
  detailValue: {
    color: '#DDDDDD',
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    color: '#DDDDDD',
    fontSize: 16,
    flex: 1,
  },
  itemPrice: {
    color: '#DDDDDD',
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  acceptedByContainer: {
    marginTop: 8,
  },
  acceptedByName: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 8,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deliveredButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  deliveredButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noPhoneText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  }
})
export default OrderDetails;