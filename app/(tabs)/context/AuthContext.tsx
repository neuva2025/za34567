import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../../firebase/Config';  // Adjust path
import { onAuthStateChanged } from 'firebase/auth';

// Define a context type
type AuthContextType = {
  user: any;  // Type for user data
  loading: boolean;
  logout: () => void;
};

// Define the children prop type
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);  // Holds user data
  const [loading, setLoading] = useState(true); // Loading state while checking auth status

  // Listen for auth state changes (user login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);  // Stop loading after checking auth state
    });

    return () => unsubscribe();  // Cleanup when component unmounts
  }, []);

  // Logout function
  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

