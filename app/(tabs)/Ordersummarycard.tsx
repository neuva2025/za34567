import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/components/CartProvider";
import { useAuth } from '@/components/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../firebase/Config';
import { StyleSheet } from "react-native";

// Interface definitions
interface LocationPopupProps {
  visible: boolean;
  onClose: () => void;
  onLocationSubmit: (location: string) => void;
}

interface OrderItem {
  id: number;
  image: string;
  title: string;
  weight: string;
  description: string;
  rating: number;
  price: number;
  quantity: number;
}

interface OrderData {
  items: OrderItem[];
  restaurantId: string;
  restaurantName: string;
  userId: string;
  userEmail: string;
  totalAmount: number;
  deliveryLocation: string;
  status: 'pending';
  createdAt: Timestamp | null;
  updatedAt?: Timestamp | null;
}

const LocationPopup: React.FC<LocationPopupProps> = ({ visible, onClose, onLocationSubmit }) => {
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (location.trim()) {
      onLocationSubmit(location);
      setLocation('');
    } else {
      Alert.alert('Please enter a valid location!');
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlayLocation}>
        <View style={styles.popupLocation}>
          <Text style={styles.titleLocation}>Where are you?</Text>
          <TextInput
            style={styles.inputLocation}
            placeholder="Enter Building and Room"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.submitButtonLocation} onPress={handleSubmit}>
            <Text style={styles.buttonTextLocation}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButtonLocation} onPress={onClose}>
            <Text style={styles.buttonTextLocation}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const OrderSummarycard: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { cartItems: orderItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated, login, userLocation, setUserLocation } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const restaurantId = params.restaurantId as string;
  const restaurantName = params.name as string;

  const updateExistingOrder = async (orderId: string, orderData: Partial<OrderData>) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        ...orderData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Error("Failed to update order");
    }
  };

  const createNewOrder = async (orderData: Omit<OrderData, 'createdAt'>) => {
    try {
      const ordersRef = collection(db, "orders");
      const newOrderData = {
        ...orderData,
        createdAt: serverTimestamp()
      };
      
      const orderDoc = await addDoc(ordersRef, newOrderData);
      return orderDoc.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  // Handle item deletion with confirmation
  const handleDeleteItem = (itemId: number, itemTitle: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${itemTitle}" from your cart?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeFromCart(itemId);
            // Show success message
            Alert.alert("Item Removed", `${itemTitle} has been removed from your cart.`);
          }
        }
      ]
    );
  };

  // Handle quantity updates
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      const item = orderItems.find(item => item.id === itemId);
      if (item) {
        handleDeleteItem(itemId, item.title);
      }
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = totalPrice * 0.1;
  const finalAmount = totalPrice + deliveryCharge;

  const handlePay = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert("Error", "Please login to place an order.");
      return;
    }
  
    if (!userLocation) {
      setShowLocationPopup(true);
      return;
    }

    if (!restaurantName) {
      Alert.alert("Error", "Restaurant information is missing.");
      return;
    }
  
    try {
      setIsUpdating(true);

      const formattedOrderItems = orderItems.map(item => ({
        description: item.description,
        id: item.id,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        rating: item.rating,
        title: item.title,
        weight: item.weight
      }));

      // Updated order data structure
      const orderData = {
        email: user.email || '',
        items: formattedOrderItems,
        location: userLocation,
        orderDate: serverTimestamp(),
        total: finalAmount,
        userId: user.uid,
        restaurantId: restaurantId,
        restaurantName: restaurantName
      };

      try {
        const ordersRef = collection(db, "orders");
        const orderDoc = await addDoc(ordersRef, orderData);
        
        if (orderDoc.id) {
          clearCart();
          Alert.alert(
            "Order Placed Successfully",
            `Order ID: ${orderDoc.id}\nRestaurant: ${restaurantName}\nDelivery Location: ${userLocation}\nTotal Amount: ₹${finalAmount.toFixed(2)}`,
            [{ text: "OK", onPress: () => router.push("/HomeScreen") }]
          );
        }
      } catch (error) {
        console.error("Firebase error:", error);
        Alert.alert("Error", "Failed to save order to database. Please try again.");
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleBack = () => {
    const from = params.from as string;
    if (from === "MenuList") {
      router.push("/MenuList");
    } else {
      router.push("/HomeScreen");
    }
  };

  if (orderItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <FontAwesome name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContentContainer}>
          <Text style={styles.emptyHeader}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtext}>Add some delicious items to get started!</Text>
          <TouchableOpacity 
            style={styles.browseButton} 
            onPress={handleBack}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Your Cart</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {!isAuthenticated ? (
          <View style={styles.authContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter Password"
              secureTextEntry
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <Button title="Login" onPress={handleLogin} />
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.signupLink}>Need an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {orderItems.map((item, index) => (
              <View key={item.id} style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.detailsContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item.id, item.title)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#ff4757" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.weight}>{item.weight}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.footer}>
                    <View style={styles.ratingContainer}>
                      <FontAwesome name="star" size={16} color="#f0c02f" />
                      <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={16} color="#333" />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={16} color="#333" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.price}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        <LocationPopup
          visible={showLocationPopup}
          onClose={() => setShowLocationPopup(false)}
          onLocationSubmit={(location) => {
            setUserLocation(location);
            setShowLocationPopup(false);
            handlePay();
          }}
        />

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Food Cost: ₹{totalPrice.toFixed(2)}
          </Text>
          <Text style={styles.summaryText}>
            Delivery Charge: ₹{deliveryCharge.toFixed(2)}
          </Text>
          <Text style={[styles.summaryText, styles.totalText]}>
            Total: ₹{finalAmount.toFixed(2)}
          </Text>
        </View>

        {Boolean(isAuthenticated) && (
          <TouchableOpacity
            style={[styles.payButton, isUpdating && styles.payButtonDisabled]}
            onPress={handlePay}
            disabled={isUpdating}
          >
            <Text style={styles.payButtonText}>
              {isUpdating ? "Processing..." : `PAY ₹${finalAmount.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  emptyContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
  },
  emptyHeader: {
    fontSize: 22,
    fontWeight: "600",
    color: "#666",
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#f0c02f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  backButtonText: {
    color: "#000",
    fontSize: 40,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#ffecec',
    borderRadius: 15,
    marginLeft: 10,
  },
  weight: {
    fontSize: 12,
    color: "#666",
    marginVertical: 2,
  },
  description: {
    fontSize: 12,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    marginLeft: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantity: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  summaryContainer: {
    marginTop: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: "#f0c02f",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  authContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  error: {
    color: "red",
    fontSize: 14,
    marginVertical: 5,
  },
  signupLink: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  // Location Popup Styles
  overlayLocation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupLocation: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  titleLocation: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputLocation: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  submitButtonLocation: {
    backgroundColor: '#f0c02f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButtonLocation: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonTextLocation: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSummarycard;