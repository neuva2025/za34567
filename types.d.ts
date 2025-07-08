// types.d.ts
import { Notification } from 'expo-notifications';

declare module 'expo-notifications' {
  interface Notification {
    // You can extend the Notification type if needed
    // Add more fields as required for your app
    data?: {
      orderId?: string;
      [key: string]: any;
    };
  }

  // If you handle notification responses
  interface NotificationResponse {
    actionIdentifier: string;
    notification: Notification;
  }
}
