import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Switch } from 'react-native';
import { collection, getDocs, query, orderBy, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MAX_ORDERS = 3;

interface OrderItem {
  title: string;
  id: number;
  price: number;
  quantity: number;
  [key: string]: any;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  orderDate: any;
  location: string;
  restaurantName: string;
  status?: string;
  acceptedBy?: string;
  userId?: string;
}

const OrderDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [acceptedOrders, setAcceptedOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'available' | 'accepted'>('available');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0); // Add refresh trigger
  const router = useRouter();

  // Use useFocusEffect to refresh data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused, refreshing data...");
      fetchOrders();
      fetchAcceptedOrders();
      // Clean up function when screen loses focus
      return () => {
        console.log("Screen unfocused");
      };
    }, [refreshTrigger]) // Add refreshTrigger as dependency
  );

  // Also load on initial mount
  useEffect(() => {
    fetchOrders();
    fetchAcceptedOrders();
  }, [refreshTrigger]); // Add refreshTrigger as dependency
   const navigateToHome = () => {
    router.push('/HomeScreen');
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        console.log("No authenticated user");
        setLoading(false);
        return;
      }

      const ordersRef = collection(db, 'orders');
      // Using a simpler query to avoid index requirements
      // Just get all orders and filter in JavaScript
      const q = query(ordersRef, orderBy('orderDate', 'desc'));
      
      const querySnapshot = await getDocs(q);
      
      // Filter out accepted orders in JavaScript rather than in the query
      const ordersList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          items: doc.data().items || [],
          total: doc.data().total || 0,
          orderDate: doc.data().orderDate || null,
          location: doc.data().location || 'Location not specified',
          restaurantName: doc.data().restaurantName || 'Unknown Restaurant',
          status: doc.data().status || 'pending',
          userId: doc.data().userId,
          acceptedBy: doc.data().acceptedBy,
        }))
        .filter(order => order.status !== 'accepted' && !order.acceptedBy);
      
      console.log(`Fetched ${ordersList.length} available orders`);
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load available orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedOrders = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) {
        console.log("No authenticated user for accepted orders");
        setLoading(false);
        return;
      }
      
      console.log("Fetching accepted orders for user:", auth.currentUser.uid);
      const ordersRef = collection(db, 'orders');
      // Using a simple query with just one where clause to avoid index issues
      const q = query(
        ordersRef,
        where('acceptedBy', '==', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      console.log(`Found ${querySnapshot.docs.length} accepted orders`);
      
      // Sort in JavaScript
      const acceptedOrdersList = querySnapshot.docs
        .map((doc) => {
          console.log(`Processing accepted order ${doc.id}, status: ${doc.data().status}`);
          return {
            id: doc.id,
            items: doc.data().items || [],
            total: doc.data().total || 0,
            orderDate: doc.data().orderDate || null,
            location: doc.data().location || 'Location not specified',
            restaurantName: doc.data().restaurantName || 'Unknown Restaurant',
            status: doc.data().status || 'accepted',
            acceptedBy: doc.data().acceptedBy,
            userId: doc.data().userId,
          };
        })
        .sort((a, b) => {
          // Sort in descending order (newest first)
          if (!a.orderDate || !b.orderDate) return 0;
          return b.orderDate.seconds - a.orderDate.seconds;
        });
      
      setAcceptedOrders(acceptedOrdersList);
    } catch (error) {
      console.error('Error fetching accepted orders:', error);
      Alert.alert('Error', 'Failed to load your accepted orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    console.log("Manual refresh triggered");
    // Increment the refresh trigger to force both useEffect and useFocusEffect to run
    setRefreshTrigger(prev => prev + 1);
  };

  const toggleOrderSelection = (orderId: string) => {
    const selectedCount = Object.values(selectedOrders).filter(Boolean).length;

    if (!selectedOrders[orderId] && selectedCount >= MAX_ORDERS) {
      Alert.alert('Limit Reached', `You can accept a maximum of ${MAX_ORDERS} orders.`);
      return;
    }

    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const navigateToNextPage = () => {
    const selectedOrderDetails = orders.filter((order) => selectedOrders[order.id]);

    if (selectedOrderDetails.length === 0) {
      Alert.alert('No Orders Selected', 'Please select at least one order.');
      return;
    }

    // Ensure we're sending serializable data
    const serializedOrders = selectedOrderDetails.map(order => ({
      id: order.id,
      items: order.items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      total: order.total,
      location: order.location,
      restaurantName: order.restaurantName,
      userId: order.userId
    }));

    router.push({
      pathname: '/AcceptedOrders',
      params: { selectedOrders: JSON.stringify(serializedOrders) },
    });
  };

  const handleViewOrderDetails = (order: Order) => {
    console.log("Navigating to order details:", order.id);
    router.push(`/OrderDetailsScreen?orderId=${order.id}`);
  };

  const renderSwipeableItem = ({ item }: { item: Order }) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.swipeButton}
            onPress={() => toggleOrderSelection(item.id)}
          >
            <Text style={styles.swipeText}>
              {selectedOrders[item.id] ? 'Unselect' : 'Select'}
            </Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Switch
              value={selectedOrders[item.id] || false}
              onValueChange={() => toggleOrderSelection(item.id)}
              trackColor={{ false: '#555', true: '#007AFF' }}
              thumbColor={selectedOrders[item.id] ? '#fff' : '#f4f3f4'}
              style={styles.switch}
            />
            <Text style={styles.orderId}>Order ID: {item.id}</Text>
          </View>
          <Text style={styles.restaurantName}>🍽 {item.restaurantName}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>📍 {item.location}</Text>
          </View>
          <Text style={styles.items}>
            Items: {item.items && item.items.length > 0 
              ? item.items.map((i) => i.title).join(', ') 
              : 'No items listed'}
          </Text>
          <Text style={styles.total}>Total: ₹{item.total}</Text>
        </View>
      </Swipeable>
    );
  };

  const renderAcceptedOrderItem = ({ item }: { item: Order }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.restaurantName}>🍽 {item.restaurantName}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {item.location}</Text>
        </View>
        <Text style={styles.items}>
          Items: {item.items && item.items.length > 0 
            ? item.items.map((i) => i.title).join(', ') 
            : 'No items listed'}
        </Text>
        <Text style={styles.total}>Total: ₹{item.total}</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {item.status === 'delivered' ? '🚚 Delivered' : '✅ Accepted'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleViewOrderDetails(item)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>
            {activeTab === 'available' ? 'Loading orders...' : 'Loading your orders...'}
          </Text>
        </View>
      );
    }
    
    return (
      <Text style={styles.emptyText}>
        {activeTab === 'available' 
          ? 'No orders available' 
          : 'You haven\'t accepted any orders yet'}
      </Text>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
       <TouchableOpacity 
        style={styles.backButton} 
        onPress={navigateToHome}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'available' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === 'available' && styles.activeTabButtonText
            ]}>
              Available Orders
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'accepted' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('accepted')}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === 'accepted' && styles.activeTabButtonText
            ]}>
              My Orders
            </Text>
            {acceptedOrders.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{acceptedOrders.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {activeTab === 'available' ? (
          <>
            <FlatList
              contentContainerStyle={styles.listContent}
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderSwipeableItem}
              ListEmptyComponent={renderEmptyComponent}
              refreshing={loading}
              onRefresh={refreshData}
            />
            {orders.length > 0 && (
              <TouchableOpacity 
                style={[
                  styles.acceptButton,
                  Object.values(selectedOrders).filter(Boolean).length === 0 && styles.disabledButton
                ]} 
                onPress={navigateToNextPage}
                disabled={Object.values(selectedOrders).filter(Boolean).length === 0}
              >
                <Text style={styles.acceptButtonText}>Accept Selected Orders</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={acceptedOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderAcceptedOrderItem}
            ListEmptyComponent={renderEmptyComponent}
            refreshing={loading}
            onRefresh={refreshData}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#bbb',
    marginTop: 12,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeTabButton: {
    backgroundColor: '#4caf50',
  },
  tabButtonText: {
    color: '#ddd',
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 80,
    minHeight: 300, // Ensure the content is scrollable even when empty
  },
  swipeButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  swipeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  switch: {
    marginRight: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
  },
  locationContainer: {
    backgroundColor: '#2a2a2a',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  items: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 4,
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    marginTop: 32,
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
   backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
    color:'#fff',
    backgroundColor:"#fff",
    padding: 4,
    borderRadius: 20,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default OrderDashboard;
