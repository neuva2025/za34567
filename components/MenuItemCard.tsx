import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MenuItemCard = ({ menuItem }: { menuItem: any }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{menuItem.name}</Text>
      <Text style={styles.description}>{menuItem.description}</Text>
      <Text style={styles.price}>Price: ${menuItem.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default MenuItemCard;
