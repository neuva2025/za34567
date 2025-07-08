import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/AuthContext'; // Adjust the import path
import { db } from '../../firebase/Config'; // Adjust the import path
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  createdAt: any;
  displayName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout, userLocation } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchUserProfile();
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const usersRef = collection(db, 'USERS');
      const q = query(usersRef, where('uid', '==', user?.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserProfile;
        setUserProfile(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      setOrderCount(querySnapshot.size);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.push('/'); // Adjust route as needed
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.unauthenticatedContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <Text style={styles.unauthenticatedText}>Please login to view your profile</Text>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/App')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
            <Text style={styles.close}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
          <Text style={styles.close}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person-circle" size={80} color="#666" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {userProfile?.displayName || 'User'}
            </Text>
            <Text style={styles.userEmail}>{userProfile?.email}</Text>
            <Text style={styles.memberSince}>
              Member since: {formatDate(userProfile?.createdAt)}
            </Text>
            {userLocation && (
              <Text style={styles.userLocation}>
                <Ionicons name="location" size={16} color="#666" /> {userLocation}
              </Text>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Ionicons name="cart" size={24} color="#FFA500" style={styles.statIcon} />
            <Text style={styles.statTitle}>Orders</Text>
            <Text style={styles.statValue}>{orderCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="gift" size={24} color="#FFA500" style={styles.statIcon} />
            <Text style={styles.statTitle}>ZAPP Points</Text>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>

        {/* Action Section */}
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>ZAPPER</Text>
          <Link href="/OrderDashboard">
            <View style={styles.actionButton}>
              <Text style={styles.buttonText}>Activate Now</Text>
            </View>
          </Link>
        </View>

        {/* Menu Section */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Instruction')}>
            <Ionicons name="help-circle" size={24} color="#000" />
            <Text style={styles.menuText}>How to Use</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/OrderHistory')}>
            <Ionicons name="time" size={24} color="#000" />
            <Text style={styles.menuText}>Order History</Text>
          </TouchableOpacity>
          
          
          
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#FF4444" />
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  close: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  // User Info Section
  userInfoSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  userDetails: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Stats Section
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '47%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
    marginTop: 6,
    fontStyle: 'italic',
  },
  // Action Section
  actionContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  // Menu Section
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 15,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF4444',
  },
  // Loading and Unauthenticated States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  unauthenticatedText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProfilePage;