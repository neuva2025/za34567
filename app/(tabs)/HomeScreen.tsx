import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import Navbar from '@/components/Navbar';
import CCard from "@/components/CCard";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import FloatingMenu from '@/components/FloatingMenu';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/Config';
import { NotificationBadge } from './NotificationBadge';

const { width, height } = Dimensions.get('window');

interface Restaurant {
  id: string;
  name: string;
  address: string;
}

interface Notification {
  id: string;
  ordererId: string;
  acceptedBy: string;
  orderId: string;
  restaurantName: string;
  location: string;
  amount: number;
  read: boolean;
  acceptedAt: Date;
}

export default function HomeScreen() {
  const [category, setCategory] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const router = useRouter();

  // Fetch restaurants - optimized with useCallback to prevent unnecessary re-renders
  const fetchRestaurants = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'restaurantsData'));
      const restaurantList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || '',
        address: doc.data().address || '',
      }));
      setRestaurants(restaurantList);
      setFilteredRestaurants(restaurantList);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Apply filters - memoized to prevent unnecessary re-renders
  useEffect(() => {
    let filtered = [...restaurants];

    if (category) {
      filtered = filtered.filter(restaurant => restaurant.address === category);
    }

    if (searchText) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }

    setFilteredRestaurants(filtered);
  }, [category, searchText, restaurants]);

  const handleCardPress = (restaurant: Restaurant) => {
    router.push(`/MenuList?restaurantId=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}`);
  };

  const handleProfilePress = () => {
    router.push('/ProfilePage');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prevState) => !prevState);
  };
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const customCardStyles = {
    cardContainer: {
      width: width - 20, // Full width minus minimal padding
      height: 120,
      backgroundColor: '#000000',
      borderRadius: 10,
      marginVertical: 8,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 0, // Remove horizontal margins
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingRight: 15,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    subtitle: {
      fontSize: 16,
      color: '#888888',
    },
  };

  // Memoize restaurant rendering to optimize performance
  const renderRestaurant = useCallback((restaurant: Restaurant) => {
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        key={restaurant.id}
        onPress={() => handleCardPress(restaurant)}
      >
        <CCard customStyles={customCardStyles} restaurant={restaurant} index={parseInt(restaurant.id, 10) || 0} />
      </TouchableOpacity>
    );
  }, [customCardStyles]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" translucent={false} />
      
      {/* Main Content with Scrollable Navbar */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Navbar Component - Now scrollable */}
        <Navbar 
          searchText={searchText}
          onSearchTextChange={handleSearchTextChange}
          searchResults={searchResults}
          onRestaurantPress={handleCardPress}
        />
        
        <Text style={styles.heading}>Crave It. Tap It. Get It !</Text>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Choose Location</Text>
          <Picker
            selectedValue={category}
            style={styles.dropdown}
            onValueChange={(value) => setCategory(value)}
          >
            <Picker.Item label="All Locations" value="" />
            <Picker.Item label="Java" value="Java" />
            <Picker.Item label="UB" value="UB" />
          </Picker>
        </View>

        <Text style={styles.heading}>Hotel List</Text>

        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant, index) => (
            <TouchableOpacity
              style={styles.cardWrapper}
              key={restaurant.id}
              onPress={() => handleCardPress(restaurant)}
            >
              <CCard customStyles={customCardStyles} restaurant={restaurant} index={index} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>No restaurants found in this location.</Text>
        )}
        
        {/* Bottom padding for floating menu */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Menu */}
      <FloatingMenu
        onProfilePress={handleProfilePress}
        visible={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 0, // Remove all horizontal padding
    paddingBottom: 100, // Bottom padding for floating menu
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    marginHorizontal: 20, // Keep some margin for readability
    color: '#000',
  },
  searchBarContainer: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    maxHeight: 200,
  },
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    marginHorizontal: 20, // Keep some margin for the dropdown
    marginVertical: 15,
  },
  dropdown: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#000', // Changed from white to black for better visibility
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardWrapper: {
    marginVertical: 5,
    alignItems: 'center',
    paddingHorizontal: 0, // Remove all horizontal padding
    width: '100%', // Ensure full width
  },
  menuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 30,
    zIndex: 1000,
  },
  menuText: {
    color: '#fff',
    fontSize: 24,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    marginHorizontal: 10,
  },
  bottomPadding: {
    height: 20, // Extra padding at bottom
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationsContainer: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationAmount: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});