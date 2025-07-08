import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuBar: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuBar}>
        {/* Favorite Icon (Outlined) */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* User Icon (Outlined) */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* Refresh Icon (Outlined) */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* Copy Icon (Outlined) */}
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="copy-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // Make the container fill the screen
    justifyContent: 'flex-end',  // Ensure the menu bar is aligned to the bottom
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',  // Evenly space the icons
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    position: 'absolute', // Stick to the bottom of the screen
    bottom: 0,  // Stick it to the bottom edge
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,  // Optional: rounded corners for aesthetics
    borderTopRightRadius: 20,  // Optional: rounded corners for aesthetics
    shadowColor: '#000', // Shadow for a floating effect
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,  // For Android shadow effect
  },
  iconButton: {
    padding: 10,
  },
});

export default MenuBar;
