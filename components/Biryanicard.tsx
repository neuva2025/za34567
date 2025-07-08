import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type FoodItem = {
  id: number;
  image: string;
  subtitle: string;
  title: string;
  description: string;
  rating: number;
  price: number;
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

// BiryaniCard Component
const BiryaniCard: React.FC<{
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
}> = ({ item, onAddToCart }) => {
  return (
    <View style={styles.card}>
  
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.textContainer}>
      
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.title}>{item.title}</Text>
  
        <Text style={styles.description}>{item.description}</Text>
      
        <View style={styles.footer}>
      
          <View style={styles.rating}>
            <FontAwesome name="star" size={18} color="#f0c02f" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        
          <Text style={styles.price}>{`₹${item.price} /-`}</Text>
         
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToCart(item)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Ordersummarycard Component


// BiryaniCardScreen
const BiryaniCardScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const biryaniData: FoodItem[] = [
    {
      id: 1,
      image: "https://via.placeholder.com/100",
      subtitle: "CLASSIC BIRYANI, JAVA GREEN",
      title: "Chicken Biryani",
      description:
        "Fluffy basmati rice layered over tender & succulent pieces of meat, accompanied with the mesmerizing aromas of spices, herbs & caramelized onions.",
      rating: 4.5,
      price: 100,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100",
      subtitle: "CLASSIC BIRYANI, JAVA GREEN",
      title: "Mutton Biryani",
      description:
        "Tender mutton pieces cooked to perfection in layers of fragrant basmati rice, infused with aromatic spices and herbs.",
      rating: 4.7,
      price: 180,
    },
    {
      id: 3,
      image: "https://via.placeholder.com/100",
      subtitle: "CLASSIC BIRYANI, JAVA GREEN",
      title: "Veg Biryani",
      description:
        "A vegetarian delight with mixed vegetables cooked in layers of basmati rice, delicately spiced and topped with caramelized onions.",
      rating: 4.3,
      price: 90,
    },
  ];

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { id: item.id, title: item.title, price: item.price, quantity: 1 }];
      }
    });
    Alert.alert("Added to Cart", `${item.title} has been added to your cart.`);
  };

  return (
    <ScrollView style={styles.screenContainer}>
      {biryaniData.map((item) => (
        <BiryaniCard key={item.id} item={item} onAddToCart={handleAddToCart} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginVertical: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  cartHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cartItemText: {
    fontSize: 14,
    color: "#555",
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "right",
  },
});

export default BiryaniCardScreen;