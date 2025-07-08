import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Navbar from '@/components/Navbar'; // Adjust this based on your actual import path
import CCard from "@/components/CCard"; // Adjust this based on your actual import path
import SearchBar from "@/components/SearchBar"; // Adjust this based on your actual import path
import BiryaniCardScreen from "@/components/Biryanicard"; // Adjust this based on your actual import path
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window'); // Get screen width and height

function StationHomeScreen() {
  // Example restaurant data to pass to CCard
  const restaurant = {
    name: 'Java Green',
    address: '123 Coffee Lane',
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>

        <Text style={styles.heading}>Popular Foods!</Text>

        {/* CCard Component - Touchable to navigate to MenuList */}
        <View style={styles.cardWrapper}>
          <Link href="/MenuList">
            <CCard customStyles={customCardStyles} restaurant={restaurant} />
          </Link>
        </View>

        {/* BiryaniCardScreen */}
        <BiryaniCardScreen />
      </ScrollView>
    </View>
  );
}

const customCardStyles = {
  cardContainer: {
    width: width * 0.9, // 90% of screen width
    height: width * 0.5, // 50% of screen width for card height
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginVertical: height * 0.02,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  searchBarContainer: {
    padding: 10,
  },
  heading: {
    fontSize: width * 0.06, // Dynamically adjusts font size based on screen width
    fontWeight: 'bold',
    marginVertical: height * 0.02, // Dynamically adjusts vertical margin
    textAlign: 'center',
  },
  cardWrapper: {
    marginVertical: height * 0.03, // Dynamic vertical margin
    alignItems: 'center',
  },
});

export default StationHomeScreen;
