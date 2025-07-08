import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = 160;

// Function to safely get local image sources (keeping your current logic)
const getImageSource = (id: string, index: number) => {
  try {
    const mod = index % 3;
    
    if (mod === 0) {
      return require('../assets/images/pic2.jpeg');
    } else if (mod === 1) {
      return require('../assets/images/pic3.jpeg');
    } else {
      return require('../assets/images/pic4.jpeg');
    }
  } catch (error) {
    console.error('Error loading image:', error);
    return require('../assets/images/food1.jpg');
  }
};

interface Restaurant {
  id: string;
  name: string;
  address: string;
}

interface CCardProps {
  customStyles?: any;
  restaurant: Restaurant;
  index: number;
}

// Individual Card Component - Beautiful Design, Same Functionality
const CCard: React.FC<CCardProps> = ({ restaurant, index }) => {
  const rating = (4.0 + Math.random() * 1.0); // Mock rating
  const deliveryTime = `${15 + Math.floor(Math.random() * 20)}-${25 + Math.floor(Math.random() * 20)} min`;
  const category = ['Italian', 'Asian', 'American', 'Mexican', 'Indian'][index % 5];

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        {/* Image Section with Overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={getImageSource(restaurant.id, index)}
            style={styles.foodImage}
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
          
          {/* Favorite Button - Just Visual */}
          <View style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>♡</Text>
          </View>
          
          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {rating.toFixed(1)}</Text>
          </View>
        </View>
        
        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{restaurant.name}</Text>
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryText}>{deliveryTime}</Text>
            </View>
          </View>
          
          <Text style={styles.category}>{category} Cuisine</Text>
          
          <View style={styles.addressContainer}>
            <View style={styles.locationIcon}>
              <Text style={styles.locationEmoji}>📍</Text>
            </View>
            <Text style={styles.address} numberOfLines={1}>{restaurant.address}</Text>
          </View>
          
          {/* Bottom Action Row */}
          <View style={styles.actionRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.deliveryFee}>Free delivery</Text>
            </View>
            <View style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

interface CardGridProps {
  restaurants: Restaurant[];
}

export const CardGrid: React.FC<CardGridProps> = ({ restaurants }) => {
  const renderItem = ({ item, index }: { item: Restaurant, index: number }) => (
    <CCard restaurant={item} index={index} />
  );

  return (
    <FlatList
      data={restaurants}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 20,
    alignSelf: 'center',
  },
  cardContainer: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#FF6B6B',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  deliveryBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 10,
    color: '#2D8A2F',
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    color: '#8B8B8B',
    fontWeight: '500',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  locationEmoji: {
    fontSize: 12,
  },
  address: {
    fontSize: 13,
    color: '#6B6B6B',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  deliveryFee: {
    fontSize: 12,
    color: '#2D8A2F',
    fontWeight: '600',
  },
  orderButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CCard;