import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/Config';

interface Notification {
  id: string;
  orderId: string;
  restaurantName: string;
  acceptedBy: string;
  ordererId: string;
  location: string;
  amount: number;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'acceptedOrders'),
      where('ordererId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().acceptedAt?.toDate() || new Date(),
      })) as Notification[];

     
      newNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'acceptedOrders', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};