import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/Config';

export const NotificationBadge = () => {
  const [acceptedOrdersCount, setAcceptedOrdersCount] = useState(0);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      where('status', '==', 'accepted')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      setAcceptedOrdersCount(snapshot.docs.length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (acceptedOrdersCount === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{acceptedOrdersCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});