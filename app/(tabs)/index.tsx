import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Image, StyleSheet, StatusBar, Text, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router'; // Import Link and useRouter from expo-router

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate responsive dimensions
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 414;
const isLargeDevice = screenWidth >= 414;

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current image index
  const opacity = useRef(new Animated.Value(0)).current; // Initial opacity for fade-in effect
  const router = useRouter(); // Initialize router for navigation

  // Array of images to be shown in slideshow
  const images = [
    require('../../assets/images/index1.jpg'),
    require('../../assets/images/index2.jpg'),
    require('../../assets/images/index3.jpg'),
  ];

  // Function to loop through images
  const fadeInOutImages = () => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1, // Fade in to 100% opacity
        duration: 1500, // 1.5 seconds fade-in duration
        useNativeDriver: true,
      }),
      Animated.delay(2000), // Wait for 2 seconds before fading out
      Animated.timing(opacity, {
        toValue: 0, // Fade out to 0% opacity
        duration: 1500, // 1.5 seconds fade-out duration
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After fading out, move to the next image and repeat the animation
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Loop through images
    });
  };

  // Set up the slideshow to repeat indefinitely
  useEffect(() => {
    const interval = setInterval(() => {
      fadeInOutImages();
    }, 5000); // Repeat every 5 seconds

    // Start the slideshow when the component is mounted
    fadeInOutImages();

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Handle image click
  const handleImagePress = () => {
    router.push('/App');
  };

  // Calculate responsive image dimensions
  const getImageHeight = () => {
    if (isSmallDevice) {
      return screenHeight * 0.55; // 55% for small devices
    } else if (isMediumDevice) {
      return screenHeight * 0.6; // 60% for medium devices
    } else {
      return screenHeight * 0.65; // 65% for large devices
    }
  };

  const getImageWidth = () => {
    if (isSmallDevice) {
      return screenWidth - 30; // Less padding on small devices
    } else {
      return screenWidth - 40; // Standard padding
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ScrollView around the content that needs to be scrollable */}
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation links at the top */}
       

        {/* Zapp logo at the top */}
        <Image source={require('../../assets/images/zappq.jpeg')} style={styles.logo} />

        {/* Slideshow images with fade-in/out animation - now clickable */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={handleImagePress} 
          style={[
            styles.imageContainer,
            {
              width: getImageWidth(),
              height: getImageHeight(),
            }
          ]}
        >
          <Animated.Image
            source={images[currentIndex]} // Dynamically change the image based on currentIndex
            style={[styles.mainImage, { opacity }]} // Apply the fade effect to each image
          />
          
          {/* Subtle overlay gradient for modern look */}
          <Animated.View style={[styles.imageOverlay, { opacity }]} />
          
          {/* Click hint text */}
          <Animated.View style={[styles.clickHintContainer, { opacity }]}>
            <Text style={styles.clickHintText}>Tap to explore</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Add some bottom spacing for better scrolling experience */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
    flexGrow: 1,
  },
  logo: {
    width: isSmallDevice ? 120 : 150,
    height: isSmallDevice ? 120 : 150,
    resizeMode: 'contain',
    marginTop: isSmallDevice ? 15 : 20,
    marginBottom: isSmallDevice ? 15 : 20,
  },
  imageContainer: {
    marginTop: 10,
    borderRadius: isSmallDevice ? 20 : 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20, // For Android shadow
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Increased overlay area
    backgroundColor: 'transparent',
    // Create gradient effect using multiple views (React Native doesn't support CSS gradients directly)
  },
  clickHintContainer: {
    position: 'absolute',
    bottom: isSmallDevice ? 15 : 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: isSmallDevice ? 15 : 20,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: 20,
  },
  clickHintText: {
    color: '#333',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
  },
  navButtons: {
    width: isSmallDevice ? '90%' : '80%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: isSmallDevice ? 15 : 20,
  },
  navButton: {
    backgroundColor: '#ff6347',
    padding: isSmallDevice ? 12 : 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
  },
});