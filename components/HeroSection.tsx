import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const HeroSection: React.FC = () => {
  return (
    <View style={styles.heroContainer}>
      {/* Background Image with Glassy Effect */}
      <ImageBackground
        source={{ uri: 'https://www.example.com/your-image.jpg' }} // Replace with your image URL
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          {/* Text Content */}
          <Text style={styles.title}>Welcome to Our App</Text>
          <Text style={styles.subtitle}>Discover the best biryanis in town</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50, // Adjust based on your layout needs
  },
  backgroundImage: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden', // Ensures content is clipped inside the curved border
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for glassy effect
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default HeroSection;
