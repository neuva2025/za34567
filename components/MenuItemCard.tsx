import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// Online food images - cycles through these automatically
const menuImages = [
  'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop', // Pasta
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', // Tacos
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop', // Pizza
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', // Burger
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // Salad bowl
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop', // Breakfast
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', // Steak
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // Sushi
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop', // Sandwich
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', // Pancakes
];

// Function to get cycling image based on index
const getMenuImageSource = (index: number) => {
  const imageIndex = index % menuImages.length;
  return { uri: menuImages[imageIndex] };
};

interface MenuItemCardProps {
  menuItem: any;
  index: number; // Add index prop for image cycling
}

const MenuItemCard = ({ menuItem, index }: MenuItemCardProps) => {
  return (
    <View style={styles.card}>
      <Image 
        source={getMenuImageSource(index)}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{menuItem.name}</Text>
        <Text style={styles.description}>{menuItem.description}</Text>
        <Text style={styles.price}>Price: ${menuItem.price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden', // Ensures image respects border radius
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default MenuItemCard;