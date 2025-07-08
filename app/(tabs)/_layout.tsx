// import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Dimensions, StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { CartProvider } from '@/components/CartProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/components/AuthContext';
import { NotificationProvider } from '@/components/NotificationContext';
import FloatingMenu from '@/components/FloatingMenu';

// Importing Expo Notifications and Firebase config
// import * as Notifications from 'expo-notifications';
// import firebase from '../../firebase/Config'; // Import Firebase configuration

const { width, height } = Dimensions.get('window');

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <SafeAreaView style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor="#000000" />
              <Stack
                screenOptions={{
                  headerShown: false, // Hide headers for all screens
                  gestureEnabled: false, // Disable swipe-to-go-back gestures
                  animation: 'none', // Disable screen transition animations
                  presentation: 'card', // Use card presentation to prevent modal-like behavior
                }}
              >
                <Stack.Screen 
                  name="index" 
                  options={{ 
                    title: 'Home',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="form" 
                  options={{ 
                    title: 'Form',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="HomeScreen" 
                  options={{ 
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="MenuList" 
                  options={{ 
                    title: 'Menu',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Registration" 
                  options={{ 
                    title: 'Registration',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Login" 
                  options={{ 
                    title: 'Login',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="EmailVerification" 
                  options={{ 
                    title: 'Email Verification',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="PasswordReset" 
                  options={{ 
                    title: 'Password Reset',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="ProfilePage" 
                  options={{ 
                    title: 'Profile Page',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="AddMenuItemScreen" 
                  options={{ 
                    title: 'Add Menu Item',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="AddRestaurantScreen" 
                  options={{ 
                    title: 'Add Restaurant',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="RestaurantListScreen" 
                  options={{ 
                    title: 'Restaurant List',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="MainScreen" 
                  options={{ 
                    title: 'Main',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="StationHomeScreen" 
                  options={{ 
                    title: 'Station Home',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="PrintHomeScreen" 
                  options={{ 
                    title: 'Print Home',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="CartScreen" 
                  options={{ 
                    title: 'Cart',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="EmailVerificationScreen" 
                  options={{ 
                    title: 'Email Verification Screen',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="PasswordResetScreen" 
                  options={{ 
                    title: 'Password Reset Screen',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="PhoneAuthScreen" 
                  options={{ 
                    title: 'Phone Auth',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="FormComponent" 
                  options={{ 
                    title: 'Form Component',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="printcard" 
                  options={{ 
                    title: 'Print Card',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="pagepreference" 
                  options={{ 
                    title: 'Page Preference',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="SignUpScreen" 
                  options={{ 
                    title: 'Sign Up',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="LoginScreen" 
                  options={{ 
                    title: 'Login Screen',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Printoutspage" 
                  options={{ 
                    title: 'Print Outs Page',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="signup" 
                  options={{ 
                    title: 'Sign Up Page',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Loginpage" 
                  options={{ 
                    title: 'Login Page',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Otppage" 
                  options={{ 
                    title: 'OTP Page',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="AppContainer" 
                  options={{ 
                    title: 'App Container',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Signuppage" 
                  options={{ 
                    title: 'Sign Up Page',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Stationmenu" 
                  options={{ 
                    title: 'Station Menu',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Stationcart" 
                  options={{ 
                    title: 'Station Cart',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="OrderTrackingPage" 
                  options={{ 
                    title: 'Track Your Order!',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="OrderCompletion" 
                  options={{ 
                    title: 'Order Completion',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="FoodFilterToggle" 
                  options={{ 
                    title: 'Food Filter Toggle',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="StarRating" 
                  options={{ 
                    title: 'Star Rating',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="ToastNotification" 
                  options={{ 
                    title: 'Toast Notification',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="CountdownTimer" 
                  options={{ 
                    title: 'Countdown Timer',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="DeliveryTracker" 
                  options={{ 
                    title: 'Delivery Tracker',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="FoodQuiz" 
                  options={{ 
                    title: 'Food Quiz',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="App" 
                  options={{ 
                    title: 'Login',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="ChatScreen" 
                  options={{ 
                    title: 'Chat Screen',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="OrderDetails" 
                  options={{ 
                    title: 'Orders',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="OrderDetailsScreem" 
                  options={{ 
                    title: 'Orders',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Ordersummarycard" 
                  options={{ 
                    title: 'Order Summary',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
                <Stack.Screen 
                  name="Notification" 
                  options={{ 
                    title: 'Notifications',
                    gestureEnabled: false,
                    animation: 'none'
                  }} 
                />
              </Stack>
            </SafeAreaView>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});