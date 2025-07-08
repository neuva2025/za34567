import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase/Config';
import { 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  isEmailVerified: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  userLocation: string;
  setUserLocation: (location: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  placeOrder: (orderItems: OrderItem[], totalAmount: number) => Promise<string>;
}

interface OrderItem {
  id: number;
  description: string;
  image: string;
  price: number;
  quantity: number;
  rating: number;
  title: string;
  weight: string;
}

interface OrderData {
  email: string;
  items: OrderItem[];
  orderDate: Date;
  total: number;
  userId: string;
  location: string;  // Added location field
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isEmailVerified: false,
  isAuthenticated: false,
  loading: true,
  userLocation: '',
  setUserLocation: () => {},
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  placeOrder: async () => '',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsEmailVerified(currentUser?.emailVerified ?? false);
      setIsAuthenticated(!!currentUser && currentUser.emailVerified);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        throw new Error('Please verify your email before logging in.');
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      
      await addDoc(collection(db, 'USERS'), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        createdAt: new Date(),
      });
      
      Alert.alert(
        'Verification Email Sent',
        'Please check your inbox and verify your email before logging in.'
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserLocation(''); // Clear location on logout
    } catch (error: any) {
      throw new Error('Failed to logout');
    }
  };

  const placeOrder = async (orderItems: OrderItem[], totalAmount: number): Promise<string> => {
    if (!user || !isEmailVerified) {
      throw new Error('User must be logged in and verified to place orders');
    }

    if (!userLocation) {
      throw new Error('Please provide your location before placing the order');
    }

    const orderData: OrderData = {
      email: user.email!,
      items: orderItems,
      orderDate: new Date(),
      total: totalAmount,
      userId: user.uid,
      location: userLocation,  // Add location to order data
    };

    try {
      const usersRef = collection(db, 'USERS');
      const q = query(usersRef, where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('User profile not found');
      }

      const orderRef = collection(db, 'orders');
      const docRef = await addDoc(orderRef, orderData);

      return docRef.id;
    } catch (error: any) {
      throw new Error('Failed to place order: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isEmailVerified,
        isAuthenticated,
        loading,
        userLocation,
        setUserLocation,
        login,
        signup,
        logout,
        placeOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);