import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/Config';

interface UserData {
  name: string;
  email: string;
  regNo: string;
  phoneNo: string;
  srmEmail: string;
  batch: number;
}

interface NotificationItem {
  id: string;
  ordererId: string;
  acceptedBy: string;
  orderId: string;
  restaurantName: string;
  location: string;
  amount: number;
  read: boolean;
  acceptedAt: Date;
  ordererDetails?: UserData;
  accepterDetails?: UserData;
}

export const NotificationsList = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Query orders that have been accepted
    const q = query(
      collection(db, 'orders'),
      where('accepted', '==', true)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notificationsPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // Fetch orderer's details from USERS collection
        let ordererDetails: UserData | undefined;
        if (data.uid) { // Assuming uid is the field for the orderer
          const ordererDoc = await getDoc(doc(db, 'USERS', data.uid));
          if (ordererDoc.exists()) {
            ordererDetails = ordererDoc.data() as UserData;
          }
        }

        // Fetch accepter's details from USERS collection
        let accepterDetails: UserData | undefined;
        if (data.acceptedByUid) {
          const accepterDoc = await getDoc(doc(db, 'USERS', data.acceptedByUid));
          if (accepterDoc.exists()) {
            accepterDetails = accepterDoc.data() as UserData;
          }
        }

        return {
          id: doc.id,
          ordererId: data.uid || '',
          acceptedBy: data.acceptedByUid || '',
          orderId: doc.id,
          restaurantName: data.restaurantName || '',
          location: data.location || '',
          amount: data.amount || 0,
          read: data.read || false,
          acceptedAt: data.timestamp?.toDate() || new Date(),
          ordererDetails,
          accepterDetails
        };
      });

      const newNotifications = await Promise.all(notificationsPromises);
      // Sort notifications by date, newest first
      newNotifications.sort((a, b) => b.acceptedAt.getTime() - a.acceptedAt.getTime());
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'orders', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (notifications.length === 0) {
    return (
      <View style={styles.notificationsContainer}>
        <Text style={styles.notificationsTitle}>No accepted orders yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.notificationsContainer}>
      <Text style={styles.notificationsTitle}>Recent Orders</Text>
      {notifications.map(notification => (
        <TouchableOpacity
          key={notification.id}
          style={[
            styles.notificationItem,
            !notification.read && styles.unreadNotification
          ]}
          onPress={() => markAsRead(notification.id)}
        >
          <Text style={styles.notificationTitle}>
            Order Accepted at {notification.restaurantName}
          </Text>
          
          <View style={styles.userInfoContainer}>
            <View style={styles.userSection}>
              <Text style={styles.userSectionTitle}>Ordered by:</Text>
              <Text style={styles.userName}>{notification.ordererDetails?.name || 'Unknown'}</Text>
              <Text style={styles.userDetail}>Reg No: {notification.ordererDetails?.regNo || 'N/A'}</Text>
              <Text style={styles.userDetail}>Batch: {notification.ordererDetails?.batch || 'N/A'}</Text>
              <Text style={styles.userDetail}>{notification.ordererDetails?.srmEmail || 'N/A'}</Text>
              <Text style={styles.userDetail}>📱 {notification.ordererDetails?.phoneNo || 'N/A'}</Text>
            </View>
            
            <View style={styles.userSection}>
              <Text style={styles.userSectionTitle}>Accepted by:</Text>
              <Text style={styles.userName}>{notification.accepterDetails?.name || 'Unknown'}</Text>
              <Text style={styles.userDetail}>Reg No: {notification.accepterDetails?.regNo || 'N/A'}</Text>
              <Text style={styles.userDetail}>Batch: {notification.accepterDetails?.batch || 'N/A'}</Text>
              <Text style={styles.userDetail}>{notification.accepterDetails?.srmEmail || 'N/A'}</Text>
              <Text style={styles.userDetail}>📱 {notification.accepterDetails?.phoneNo || 'N/A'}</Text>
            </View>
          </View>
          
          <Text style={styles.notificationDetails}>
            📍 Location: {notification.location}
          </Text>
          
          <Text style={styles.notificationAmount}>
            💰 Amount: ₹{notification.amount}
          </Text>
          
          <Text style={styles.notificationTime}>
            🕒 {notification.acceptedAt.toLocaleString()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Styles remain the same as your original component
const styles = StyleSheet.create({
  // ... your existing styles ...
});