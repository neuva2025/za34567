import React, { useEffect, useState, useCallback } from 'react';
import { 
  Alert, 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput,
  TouchableOpacity, 
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { collection, doc, updateDoc, addDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';
import { Ionicons } from '@expo/vector-icons';

interface OrderItem {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  location: string;
  restaurantName: string;
  userId?: string;  // UID of person who placed the order (marked optional)
  acceptedBy?: string; // UID of person who accepted the order
  userName?: string; // Name of person who placed the order
  status?: string;
}

interface AcceptedOrder {
  id: string;
  ordererId: string;
  acceptedBy: string;
  orderId: string;
  location: string;
  amount: number;
  restaurantName: string;
  acceptedAt: Date;
  read: boolean;
  ordererName?: string;
}

const AcceptedOrders: React.FC = () => {
  const { selectedOrders } = useLocalSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<AcceptedOrder[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [zapperRegNo, setZapperRegNo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const navigation = useNavigation();

  // Use a callback to fetch orders to avoid duplicated code
  const fetchOrders = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (!selectedOrders) {
        console.log("No selected orders found");
        setLoading(false);
        return;
      }

      console.log("Selected orders:", selectedOrders);
      
      let ordersToFetch: Order[] = [];
      try {
        // Try to parse as JSON
        ordersToFetch = JSON.parse(selectedOrders as string);
        console.log("Successfully parsed orders:", ordersToFetch);
      } catch (parseError) {
        console.error("Error parsing selected orders:", parseError);
        
        // If parsing fails, try to handle it as a single order ID
        if (typeof selectedOrders === 'string') {
          try {
            const orderDoc = await getDoc(doc(db, 'orders', selectedOrders));
            if (orderDoc.exists()) {
              const orderData = { id: orderDoc.id, ...orderDoc.data() } as Order;
              ordersToFetch = [orderData];
              console.log("Fetched single order:", orderData);
            }
          } catch (fetchError) {
            console.error("Error fetching single order:", fetchError);
          }
        }
      }

      if (!Array.isArray(ordersToFetch) || ordersToFetch.length === 0) {
        console.log("No valid orders to process");
        setLoading(false);
        return;
      }

      if (ordersToFetch.length > 3) {
        Alert.alert(
          'Limit Exceeded',
          'You can accept a maximum of 3 orders only. Please adjust your selection.'
        );
      }

      // Ensure all orders have valid properties
      const validOrders = ordersToFetch.filter(order => 
        order && 
        typeof order === 'object' && 
        order.id !== undefined
      );

      console.log("Valid orders count:", validOrders.length);

      // For each order, get the FULL data from Firestore
      const ordersWithFullData = await Promise.all(
        validOrders.map(async (order) => {
          try {
            // Always fetch the full order data to ensure we have the current status
            const orderDoc = await getDoc(doc(db, 'orders', order.id));
            if (orderDoc.exists()) {
              // Merge the document data with our order data, prioritizing DB data
              const fullOrderData = orderDoc.data();
              order = { 
                ...order, 
                ...fullOrderData,
                id: order.id, // Keep the original ID
                status: fullOrderData.status || order.status || 'pending',
                acceptedBy: fullOrderData.acceptedBy || order.acceptedBy,
                userId: fullOrderData.userId || order.userId
              };
              
              console.log(`Order ${order.id} status:`, order.status);
            }
            return order;
          } catch (error) {
            console.error('Error fetching full order data:', error);
            return order;
          }
        })
      );

      // Fetch user details for each order
      const ordersWithUserDetails = await Promise.all(
        ordersWithFullData.map(async (order) => {
          try {
            // For orders without userId, attempt to extract it from the order ID
            // or other relevant fields if available in your data model
            if (!order.userId) {
              console.log("Order without userId:", order.id);
              return { ...order, userName: 'Unknown User' };
            }

            // Fetch user info if userId exists
            const userDoc = await getDoc(doc(db, 'users', order.userId));
            if (userDoc.exists()) {
              return {
                ...order,
                userName: userDoc.data().name || 'Unknown User'
              };
            }
            
            return { ...order, userName: 'Unknown User' };
          } catch (error) {
            console.error('Error fetching user details for order', order.id, error);
            return order;
          }
        })
      );

      console.log("Orders with user details count:", ordersWithUserDetails.length);
      
      // Log the final orders data for debugging
      console.log("Final orders data:", JSON.stringify(ordersWithUserDetails, null, 2));
      
      setOrders(ordersWithUserDetails);
    } catch (error) {
      console.error('Error processing selected orders:', error);
      Alert.alert('Error', 'There was an issue fetching the selected orders.');
    } finally {
      setLoading(false);
    }
  }, [selectedOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openAcceptModal = (order: Order): void => {
    if (!order || !order.id) {
      console.error("Tried to open modal with invalid order:", order);
      Alert.alert('Error', 'Invalid order data. Please try again.');
      return;
    }
    
    console.log("Opening modal for order:", order.id);
    console.log("Order to accept:", JSON.stringify(order, null, 2)); // Log the order object
    setCurrentOrder(order);
    setPhoneNumber('');
    setZapperRegNo('');
    setModalVisible(true);
  };

  const handleAcceptOrder = async (): Promise<void> => {
    // Validate input fields
    if (!phoneNumber || !zapperRegNo) {
      Alert.alert('Error', 'Please enter both phone number and zapper registration number.');
      return;
    }

    if (!currentOrder || !currentOrder.id) {
      console.error("Cannot accept order: Invalid currentOrder", currentOrder);
      Alert.alert('Error', 'Invalid order data. Please try again.');
      setModalVisible(false);
      return;
    }

    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to accept orders.');
        setModalVisible(false);
        setLoading(false);
        return;
      }

      console.log("Accepting order:", currentOrder.id);
      console.log("Current user ID:", auth.currentUser.uid);
      
      // Log the full order for debugging
      console.log("Order data:", JSON.stringify(currentOrder, null, 2));

      // IMPORTANT FIX: If userId is missing, try to find it or use current user as fallback
      let ordererUserId = currentOrder.userId;
      
      if (!ordererUserId) {
        console.log("Order doesn't have userId, fetching from database:", currentOrder.id);
        
        try {
          // Try to get the full order from Firestore to see if it has userId
          const orderDoc = await getDoc(doc(db, 'orders', currentOrder.id));
          if (orderDoc.exists() && orderDoc.data().userId) {
            ordererUserId = orderDoc.data().userId;
            console.log("Found userId in database:", ordererUserId);
          } else {
            // If still no userId, use the current user as a fallback (though this isn't ideal)
            console.log("No userId found in database, using current user as fallback");
            ordererUserId = auth.currentUser.uid;
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
          Alert.alert('Error', 'Could not retrieve order information. Please try again.');
          setModalVisible(false);
          setLoading(false);
          return;
        }
      }

      // Update the original order status
      const orderRef = doc(db, 'orders', currentOrder.id);
      await updateDoc(orderRef, {
        status: 'accepted',
        acceptedBy: auth.currentUser.uid,
        acceptedAt: new Date(),
        zapperPhone: phoneNumber,
        zapperRegNo: zapperRegNo
      });

      // Get the name of the person who placed the order
      let ordererName = 'Unknown User';
      try {
        if (ordererUserId) {
          const ordererDoc = await getDoc(doc(db, 'users', ordererUserId));
          if (ordererDoc.exists()) {
            ordererName = ordererDoc.data().name || 'Unknown User';
          }
        }
      } catch (error) {
        console.error("Error fetching orderer name:", error);
      }

      // Add entry to acceptedOrders collection - ENSURE ALL FIELDS HAVE VALUES
      const acceptedOrderData = {
        ordererId: ordererUserId, // Now we ensure this is always defined
        ordererName: ordererName,
        acceptedBy: auth.currentUser.uid,
        orderId: currentOrder.id,
        location: currentOrder.location || 'Unknown Location',
        amount: currentOrder.total || 0,
        restaurantName: currentOrder.restaurantName || 'Unknown Restaurant',
        acceptedAt: new Date(),
        zapperPhone: phoneNumber,
        zapperRegNo: zapperRegNo,
        read: false
      };
      
      // Log the data being sent to Firestore
      console.log("Creating acceptedOrder with data:", JSON.stringify(acceptedOrderData, null, 2));
      
      const acceptedOrderDoc = await addDoc(collection(db, 'acceptedOrders'), acceptedOrderData);
      console.log("Created acceptedOrder document:", acceptedOrderDoc.id);

      // Create notification for the order placer
      if (ordererUserId) {
        await addDoc(collection(db, 'notifications'), {
          userId: ordererUserId,
          type: 'ORDER_ACCEPTED',
          message: `Your order from ${currentOrder.restaurantName || 'restaurant'} has been accepted`,
          orderId: currentOrder.id,
          acceptedOrderId: acceptedOrderDoc.id,
          createdAt: new Date(),
          read: false
        });
      }

      // Update local state with the correct status
      const updatedOrder = { 
        ...currentOrder, 
        status: 'accepted', 
        acceptedBy: auth.currentUser.uid,
        zapperPhone: phoneNumber,
        zapperRegNo: zapperRegNo,
        userId: ordererUserId // Update with the resolved userId
      };
      
      // Update the orders array directly
      setOrders(prevOrders =>
        prevOrders.map(o => 
          o.id === currentOrder.id ? updatedOrder : o
        )
      );

      Alert.alert(
        'Success',
        'Order accepted successfully!',
        [
          { text: 'OK', onPress: () => fetchOrders() }
        ]
      );

      setModalVisible(false);
      
      // Force a full refresh
      await fetchOrders();
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order. Please try again.');
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async (order: Order): Promise<void> => {
    if (!order || !order.id) {
      console.error("Cannot mark as delivered: Invalid order", order);
      Alert.alert('Error', 'Invalid order data. Please try again.');
      return;
    }

    setLoading(true);
    try {
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to update order status.');
        setLoading(false);
        return;
      }

      // Ensure the current user is the one who accepted the order
      if (order.acceptedBy && order.acceptedBy !== auth.currentUser.uid) {
        Alert.alert('Error', 'Only the zapper who accepted this order can mark it as delivered.');
        setLoading(false);
        return;
      }

      console.log("Marking order as delivered:", order.id);

      // Update the order status to delivered
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'delivered',
        deliveredAt: new Date(),
      });

      // Create notification for the order placer
      if (order.userId) {
        await addDoc(collection(db, 'notifications'), {
          userId: order.userId,
          type: 'ORDER_DELIVERED',
          message: `Your order from ${order.restaurantName || 'restaurant'} has been delivered`,
          orderId: order.id,
          createdAt: new Date(),
          read: false
        });
      }

      Alert.alert(
        'Success',
        'Order marked as delivered!',
        [
          { text: 'OK', onPress: () => fetchOrders() }
        ]
      );

      // Update local state
      const updatedOrder = {
        ...order,
        status: 'delivered',
        deliveredAt: new Date()
      };
      
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o.id === order.id ? updatedOrder : o
        )
      );
      
      // Force a full refresh
      await fetchOrders();
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order: Order): void => {
    if (!order || !order.id) {
      console.error("Cannot view details: Invalid order", order);
      Alert.alert('Error', 'Invalid order data. Please try again.');
      return;
    }
    
    console.log("Navigating to order details:", order.id);
    router.push(`/OrderDetailsScreen?orderId=${order.id}`);
  };

  const handleGoBack = (): void => {
    try {
      // Always go back to OrderDashboard specifically
      router.push('/OrderDashboard');
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback to HomeScreen if navigation fails
      router.push('/HomeScreen');
    }
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
        <Text style={styles.loadingText}>Processing order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleGoBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <View style={styles.backButtonContent}>
          <IconWrapper name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Back</Text>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.title}>Accepted Orders</Text>
      
      {orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.orderId}>Order ID: {item.id}</Text>
              
              <Text style={styles.restaurantName}>
                🍽️ {item.restaurantName || 'Unknown Restaurant'}
              </Text>

              <Text style={styles.orderUser}>
                👤 Ordered by: {item.userName || 'Unknown User'}
              </Text>
              
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>
                  📍 {item.location || 'Unknown Location'}
                </Text>
              </View>
              
              <Text style={styles.items}>
                Items: {item.items && Array.isArray(item.items) ? 
                  item.items.map(i => i?.title || 'Unknown Item').join(', ') : 
                  'No items available'}
              </Text>
              
              <Text style={styles.total}>Total: ₹{item.total || 0}</Text>
              
              {/* Render Accept button only if not already accepted */}
              {(!item.status || item.status === 'pending') && (!item.acceptedBy) && (
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => openAcceptModal(item)}
                >
                  <Text style={styles.acceptButtonText}>Accept Order</Text>
                </TouchableOpacity>
              )}
              
              {/* Always render these buttons for accepted orders */}
              {(item.status === 'accepted' || item.acceptedBy) && (
                <>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>✅ Order Accepted</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.deliveredButton}
                      onPress={() => handleMarkAsDelivered(item)}
                    >
                      <Text style={styles.deliveredButtonText}>Mark as Delivered</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => handleViewOrderDetails(item)}
                    >
                      <Text style={styles.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              
              {item.status === 'delivered' && (
                <>
                  <View style={styles.deliveredContainer}>
                    <Text style={styles.deliveredText}>🚚 Order Delivered</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleViewOrderDetails(item)}
                  >
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          refreshing={loading}
          onRefresh={fetchOrders}
        />
      ) : (
        <Text style={styles.emptyText}>No orders selected</Text>
      )}

      {/* Modal for entering phone and zapper reg number */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Accept Order</Text>
            <Text style={styles.modalSubtitle}>Please provide your details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Zapper Registration Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your zapper registration number"
                value={zapperRegNo}
                onChangeText={setZapperRegNo}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleAcceptOrder}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    paddingTop: 50, // Added space for back button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 10,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 12,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  orderUser: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  items: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 4,
    marginBottom: 12,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  deliveredButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  deliveredButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    flex: 1,
    marginLeft: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusContainer: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  deliveredContainer: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  deliveredText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 32,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AcceptedOrders;