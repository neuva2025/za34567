import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  Alert,
  Linking 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';
import { Ionicons } from '@expo/vector-icons';

interface OrderUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface OrderItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  items: OrderItem[];
  total: number;
  location: string;
  restaurantName: string;
  userId: string;
  acceptedBy?: string;
  status?: string;
  orderDate?: any;
  acceptedAt?: any;
  deliveredAt?: any;
  zapperPhone?: string;
  zapperRegNo?: string;
}

const OrderDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [ordererUser, setOrdererUser] = useState<OrderUser | null>(null);
  const [acceptingUser, setAcceptingUser] = useState<OrderUser | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async (): Promise<void> => {
    try {
      if (!orderId) {
        setLoading(false);
        return;
      }

      console.log("Fetching order details for order:", orderId);
      
      // Fetch the order details
      const orderDoc = await getDoc(doc(db, 'orders', orderId as string));
      
      if (orderDoc.exists()) {
        const orderData = { 
          id: orderDoc.id, 
          ...orderDoc.data() 
        } as OrderDetails;
        
        setOrder(orderData);
        
        // Fetch details of the user who placed the order
        if (orderData.userId) {
          const userDetails = await getUserDetails(orderData.userId);
          if (userDetails) {
            setOrdererUser({
              id: orderData.userId,
              name: userDetails.name,
              phone: userDetails.phoneNo,
              email: userDetails.email || 'N/A'
            });
          }
        }
        
        // If there's an acceptedBy field, fetch that user's info
        if (orderData.acceptedBy) {
          const accepterDetails = await getUserDetails(orderData.acceptedBy);
          if (accepterDetails) {
            setAcceptingUser({
              id: orderData.acceptedBy,
              name: accepterDetails.name,
              phone: orderData.zapperPhone || accepterDetails.phoneNo,
              email: accepterDetails.email || 'N/A'
            });
          }
        }
      } else {
        console.log("Order not found:", orderId);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async (userId: string) => {
    try {
      console.log("Fetching user details for userId:", userId);
      
      // Try direct document lookup first (if document ID is user ID)
      try {
        const userDoc = await getDoc(doc(db, 'USERS', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            name: userData.name || 'Unknown',
            phoneNo: userData.phoneNo || 'N/A',
            email: userData.email || 'N/A'
          };
        }
      } catch (directError) {
        console.log("Direct lookup failed, trying query instead:", directError);
      }
      
      // Query the users collection to find the document where uid matches userId
      const usersRef = collection(db, 'USERS');
      const q = query(usersRef, where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Get the first matching document (there should be only one)
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        
        console.log("Found user data:", userData.name, userData.phoneNo);
        
        // Return the name and phone number
        return {
          name: userData.name || 'Unknown',
          phoneNo: userData.phoneNo || 'N/A',
          email: userData.email || userData.srmEmail || 'N/A'
        };
      } else {
        console.log('No user found with uid:', userId);
        return {
          name: 'Unknown',
          phoneNo: 'N/A',
          email: 'N/A'
        };
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      return {
        name: 'Unknown',
        phoneNo: 'N/A',
        email: 'N/A'
      };
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleCallUser = (phone: string): void => {
    if (!phone || phone === 'N/A') {
      Alert.alert('Error', 'No phone number available');
      return;
    }
    
    Linking.openURL(`tel:${phone}`);
  };

  const handleMarkAsDelivered = async (): Promise<void> => {
    if (!order || !order.id) {
      Alert.alert('Error', 'Order information not found');
      return;
    }
    
    try {
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to update order status.');
        return;
      }

      // Check if the current user is either the one who placed the order or accepted it
      if (auth.currentUser.uid !== order.userId && 
          auth.currentUser.uid !== order.acceptedBy) {
        Alert.alert('Error', 'You are not authorized to mark this order as delivered.');
        return;
      }

      // Update the order status
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveredAt: new Date(),
      });

      // Create notification for the relevant party
      const notificationRecipient = auth.currentUser.uid === order.userId ? 
                                   order.acceptedBy : order.userId;
      
      if (notificationRecipient) {
        await addDoc(collection(db, 'notifications'), {
          userId: notificationRecipient,
          type: 'ORDER_DELIVERED',
          message: `Order from ${order.restaurantName} has been marked as delivered`,
          orderId: order.id,
          createdAt: new Date(),
          read: false
        });
      }

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

  const handleGoBack = (): void => {
    router.back();
  };

  // Custom Ionicons wrapper to ensure proper rendering
  const IconWrapper = ({ name, size, color }: { name: any; size: number; color: string }) => (
    <Text style={{ fontSize: size, color: color }}>
      <Ionicons name={name} size={size} color={color} />
    </Text>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <View style={styles.backButtonContent}>
            <IconWrapper name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
          <View style={styles.backBtnContent}>
            <IconWrapper name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backBtnText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.orderCard}>
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
          
          {/* Customer Information */}
          <Text style={styles.sectionTitle}>Customer Information:</Text>
          {ordererUser ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>{ordererUser.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{ordererUser.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCallUser(ordererUser.phone)}
              >
                <Text style={styles.callButtonText}>
                  <IconWrapper name="call" size={16} color="#fff" /> Call Customer
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.notFoundText}>Customer information not available</Text>
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
              
              <Text style={styles.sectionTitle}>Delivery Information:</Text>
              {acceptingUser ? (
                <>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Zapper:</Text>
                    <Text style={styles.detailValue}>{acceptingUser.name}</Text>
                  </View>
                  
                  {order.zapperRegNo && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Reg No:</Text>
                      <Text style={styles.detailValue}>{order.zapperRegNo}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{acceptingUser.phone}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.callButton} 
                    onPress={() => handleCallUser(acceptingUser.phone)}
                  >
                    <Text style={styles.callButtonText}>
                      <IconWrapper name="call" size={16} color="#fff" /> Call Zapper
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Show the "Mark as Delivered" button to both parties */}
                  {auth.currentUser && (
                    auth.currentUser.uid === order.userId || 
                    auth.currentUser.uid === order.acceptedBy
                  ) && (
                    <TouchableOpacity 
                      style={styles.deliveredButton}
                      onPress={handleMarkAsDelivered}
                    >
                      <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <Text style={styles.notFoundText}>Delivery person information not available</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
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
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 5,
  },
  backBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#3E3E3E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
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
  notFoundText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 10,
  }
});

export default OrderDetailsScreen;