import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/Config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/components/CartProvider';

// Define types for our data structures
interface MenuItem {
  id: string;
  itemName: string;
  price: number;
  description?: string;
  weight?: string;
  image?: string;
  rating?: number;
}

const MenuList = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuExists, setMenuExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { restaurantId, name } = useLocalSearchParams();
  const router = useRouter();
  const { cartItems, addToCart: addItemToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        if (!restaurantId) {
          console.warn('No restaurantId provided.');
          setLoading(false);
          return;
        }

        const menuCollectionRef = collection(db, `restaurantsData/${restaurantId}/menu`);
        const querySnapshot = await getDocs(menuCollectionRef);

        if (querySnapshot.empty) {
          setMenuExists(false);
          setLoading(false);
          return;
        }

        const menuList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          price: Number(doc.data().price),
          weight: doc.data().weight || '300g',
          image: 'https://via.placeholder.com/80',
          rating: doc.data().rating || 4.5
        } as MenuItem));

        setMenuItems(menuList);
        setMenuExists(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      id: Number(item.id),
      image: item.image || 'https://via.placeholder.com/80',
      title: item.itemName,
      weight: item.weight || '300g',
      description: item.description || '',
      rating: item.rating || 4.5,
      price: item.price,
      quantity: 1
    };
    
    addItemToCart(cartItem);
    // Alert.alert removed from here
  };

  const proceedToSummary = () => {
    if (cartItems.length === 0) {
      // Alert.alert removed from here
      return;
    }

    router.push({
      pathname: '/Ordersummarycard',
      params: {
        items: JSON.stringify(cartItems),
        restaurantId: restaurantId as string,
        name: name as string
      }
    });
  };

  const navigateToHome = () => {
    router.push('/HomeScreen');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading menu items...</Text>
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={navigateToHome}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Cart Icon */}
      <TouchableOpacity 
        style={styles.cartIcon} 
        onPress={proceedToSummary}
      >
        <Ionicons name="cart" size={24} color="#333" />
        {cartItems.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {menuExists ? (
          <>
            <Text style={styles.heading}>Menu Items</Text>
            {menuItems.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                <Text style={styles.addToCartText}>Tap to add to cart</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items found for this restaurant.</Text>
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.viewCartButton}
          onPress={proceedToSummary}
        >
          <Text style={styles.viewCartButtonText}>
            View Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)
          </Text>
          <Text style={styles.viewCartButtonPrice}>
            ₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Keep your existing styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: '600',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  addToCartText: {
    fontSize: 14,
    color: '#2E8B57',
    fontStyle: 'italic',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
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
  cartIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
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
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ff6600',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewCartButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MenuList;