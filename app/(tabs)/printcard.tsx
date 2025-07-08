import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  preferences: string[];
}

export default function PrintCart() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Ensure 'files' and 'preferences' are valid
  const files = JSON.parse(params.files as string || '[]');
  const selectedPreferences = JSON.parse(params.preferences as string || '[]');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Calculate base price based on preferences
  const calculateBasePrice = (preferences: string[]) => {
    let basePrice = 100; // Starting base price
    if (Array.isArray(preferences)) {
      preferences.forEach(pref => {
        switch(pref) {
          case 'allColorPrint':
            basePrice += 50;
            break;
          case 'doubleSided':
            basePrice += 20;
            break;
          case 'certificatePrint':
            basePrice += 100;
            break;
          // Add more price modifications based on preferences
        }
      });
    }
    return basePrice;
  };

  useEffect(() => {
    setCartItems((prevItems) => {
      // Create a mapping of existing items by name for quick lookup
      const existingItemsMap = new Map(prevItems.map(item => [item.name, item]));
  
      // Map the new files to cart items
      return files.map((file: any, index: number) => {
        const existingItem = existingItemsMap.get(file.name);
  
        return {
          id: index + 1,
          name: file.name,
          price: calculateBasePrice(selectedPreferences),
          quantity: existingItem ? existingItem.quantity : 1, // Preserve quantity if item exists
          description: `Size: ${file.size}`,
          preferences: selectedPreferences,
        };
      });
    });
  }, [files, selectedPreferences]);

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);  // Ensure minimum 1 quantity
          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    const printCost = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const deliveryCharge = parseFloat((printCost * 0.1).toFixed(2)); // 10% delivery charge
    return {
      printCost,
      deliveryCharge,
      total: printCost + deliveryCharge,
    };
  };

  const totals = calculateTotal();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      <ScrollView style={styles.content}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.preferences}>
                {item.preferences.join(', ')}
              </Text>
            </View>
            <View>
              <Text style={styles.itemPrice}>
                ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => handleQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Print cost:</Text>
            <Text style={styles.totalValue}>₹{totals.printCost.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery charge:</Text>
            <Text style={styles.totalValue}>₹{totals.deliveryCharge.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹{totals.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.payButton}
        onPress={() => console.log('Processing payment for: ₹', totals.total.toFixed(2))}
      >
        <Text style={styles.payButtonText}>PAY ₹{totals.total.toFixed(2)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#999',
    fontSize: 14,
  },
  preferences: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
  },
  itemPrice: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#333',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
  },
  quantityText: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 15,
  },
  totalSection: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    color: '#999',
    fontSize: 16,
  },
  totalValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
    marginTop: 10,
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityButtonDisabled: {
    backgroundColor: '#222',
    opacity: 0.5,
  },
});
