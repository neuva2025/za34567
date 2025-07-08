import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform, 
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Restaurant {
  id: string;
  name: string;
  address: string;
}

interface FoodAppHeaderProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchResults: Restaurant[];
  onRestaurantPress: (restaurant: Restaurant) => void;
  notificationCount?: number;
  cartItemCount?: number;
}

const FoodAppHeader = ({ 
  searchText, 
  onSearchTextChange, 
  searchResults, 
  onRestaurantPress,
  notificationCount = 0,
  cartItemCount = 0
}: FoodAppHeaderProps) => {
  const router = useRouter();
  const [notificationPulse] = useState(new Animated.Value(1));
  const [cartBounce] = useState(new Animated.Value(1));
  const [backgroundAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Notification pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(notificationPulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(notificationPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Background gradient animation
    const bgAnimation = Animated.loop(
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    );

    pulseAnimation.start();
    bgAnimation.start();

    return () => {
      pulseAnimation.stop();
      bgAnimation.stop();
    };
  }, []);

  const navigateToCart = () => {
    // Cart bounce animation
    Animated.sequence([
      Animated.timing(cartBounce, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cartBounce, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cartBounce, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    router.push('/Ordersummarycard');
  };

  const navigateToNotifications = () => {
    router.push('/Notification');
  };

  const navigateToHome = () => {
    router.push('/');
  };

  const categories = [
    { 
      name: 'Pizza', 
      image: '../assets/images/picc8.jpeg'
    },
    { 
      name: 'Salad', 
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop&crop=center'
    },
    { 
      name: 'Burger', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&crop=center'
    },
    { 
      name: 'Drinks', 
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop&crop=center'
    },
  ];

  const backgroundInterpolation = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 1)', 'rgba(20, 20, 20, 1)']
  });

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000" 
        translucent={false}
      />
      
      {/* Black Navbar Section */}
      <View style={styles.navbarSection}>
        <SafeAreaView style={styles.safeArea}>
          {/* Modern Navbar */}
          <Animated.View style={[styles.navbarContainer, { backgroundColor: backgroundInterpolation }]}>
            {/* Floating Background Elements */}
            <View style={styles.floatingElements}>
              <View style={[styles.floatingDot, styles.dot1]} />
              <View style={[styles.floatingDot, styles.dot2]} />
              <View style={[styles.floatingDot, styles.dot3]} />
            </View>

            {/* Glassmorphism Overlay */}
            <View style={styles.glassOverlay} />

            {/* Left Side - Home Button */}
            <View style={styles.homeContainer}>
              <TouchableOpacity 
                style={styles.homeButton}
                onPress={navigateToHome}
                activeOpacity={0.7}
              >
                <MaterialIcons name="home" size={28} color="#FFA500" />
                <View style={styles.homeGlow} />
              </TouchableOpacity>
            </View>

            {/* Right Side - Interactive Icons */}
            <View style={styles.iconContainer}>
              {/* Notification Icon with Pulse */}
              <Animated.View style={{ transform: [{ scale: notificationPulse }] }}>
                <TouchableOpacity 
                  style={styles.notificationButton} 
                  onPress={navigateToNotifications}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="notifications" size={24} color="#fff" />
                  {notificationCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 99 ? '99+' : notificationCount.toString()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.notificationGlow} />
                </TouchableOpacity>
              </Animated.View>

              {/* Cart Icon with Bounce Effect */}
              <Animated.View style={{ transform: [{ scale: cartBounce }] }}>
                <TouchableOpacity 
                  style={styles.cartButton} 
                  onPress={navigateToCart}
                  activeOpacity={0.7}
                >
                  <View style={styles.cartGlow} />
                  <MaterialIcons name="shopping-cart" size={24} color="#000" />
                  {cartItemCount > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>
                        {cartItemCount > 99 ? '99+' : cartItemCount.toString()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Modern Decorative Lines */}
            <View style={styles.decorativeLines}>
              <View style={styles.line1} />
              <View style={styles.line2} />
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>

      {/* White Content Section */}
      <View style={styles.whiteSection}>
        <SafeAreaView style={styles.whiteSafeArea}>
          {/* Professional Food Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.foodTitle}>Delicious Food Delivery</Text>
            <View style={styles.titleUnderline} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for restaurants..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={onSearchTextChange}
            />
            <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
            
            {/* Search Results Dropdown */}
            {Boolean(searchResults.length > 0) && (
              <FlatList 
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchResult}
                    onPress={() => onRestaurantPress(item)}
                  >
                    <Text style={styles.searchResultText}>{item.name}</Text>
                    <Text style={styles.searchResultAddress}>{item.address}</Text>
                  </TouchableOpacity>
                )}
                style={styles.searchResultsContainer}
                removeClippedSubviews={Platform.OS === 'android'}
                maxToRenderPerBatch={10}
                initialNumToRender={5}
                windowSize={5}
              />
            )}
          </View>

          {/* Promotional Banner */}
          <View style={styles.promoContainer}>
            <View style={styles.promoBanner}>
              <View style={styles.promoContent}>
                <Text style={styles.promoDiscount}>10% OFF</Text>
                <Text style={styles.promoSubtext}>on everything</Text>
              </View>
              <View style={styles.promoImageContainer}>
                <View style={styles.foodImagePlaceholder}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1563379091339-03246963d17a?w=300&h=300&fit=crop&crop=center' }}
                    style={styles.foodImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.promoTextRight}>
                  <Text style={styles.dishName}>Classic Biryani</Text>
                  <Text style={styles.restaurantName}>Java Green</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>What are you craving?</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all categories</Text>
            </TouchableOpacity>
          </View>

          {/* Category Items */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={styles.categoryCircle}>
                  <Image 
                    source={{ uri: category.image }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Black Navbar Section
  navbarSection: {
    backgroundColor: '#000000',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 10,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 15 : 15,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 70,
  },
  // Floating Background Elements
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.1,
  },
  dot1: {
    width: 60,
    height: 60,
    backgroundColor: '#FFA500',
    top: -20,
    left: 50,
  },
  dot2: {
    width: 40,
    height: 40,
    backgroundColor: '#FF6B6B',
    top: 20,
    right: 100,
  },
  dot3: {
    width: 30,
    height: 30,
    backgroundColor: '#4ECDC4',
    bottom: 10,
    left: 20,
  },
  // Glassmorphism Overlay
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 0,
    zIndex: 2,
  },
  // Home Button
  homeContainer: {
    flex: 1,
    alignItems: 'flex-start',
    zIndex: 50,
  },
  homeButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    position: 'relative',
    overflow: 'visible',
  },
  homeGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    opacity: 0.5,
  },
  // Icon Container
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 15,
    zIndex: 50,
  },
  // Notification Button with Pulse
  notificationButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'visible',
    zIndex: 100,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 101,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  // Cart Button with Enhanced Design
  cartButton: {
    backgroundColor: '#FFA500',
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 100,
  },
  cartGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    zIndex: -1,
  },
  cartBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF4444',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 101,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Decorative Lines
  decorativeLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  line1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
  },
  line2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
  },
  // White Content Section
  whiteSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    paddingTop: 20,
  },
  whiteSafeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Title with Professional Styling
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
    alignItems: 'center',
  },
  foodTitle: {
    color: '#2c3e50',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#FFA500',
    borderRadius: 2,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  // Search Container
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
    position: 'relative',
    zIndex: 1000,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    position: 'absolute',
    right: 35,
    top: 16,
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderRadius: 8,
    padding: 6,
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    marginTop: 5,
    borderRadius: 12,
    borderColor: '#e9ecef',
    borderWidth: 1,
    maxHeight: 200,
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  searchResult: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  searchResultText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  searchResultAddress: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  // Promotional Banner
  promoContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  promoBanner: {
    backgroundColor: '#FF4757',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 120,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
  },
  promoDiscount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  promoSubtext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.9,
  },
  promoImageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  foodImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  promoTextRight: {
    alignItems: 'center',
  },
  dishName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  restaurantName: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  // Categories Section
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriesTitle: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllButton: {
    padding: 8,
  },
  seeAllText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '600',
  },
  // Category Items
  categoryScroll: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  categoryScrollContent: {
    paddingRight: 20,
  },
  categoryItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  categoryCircle: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f8f9fa',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    color: '#2c3e50',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default FoodAppHeader;