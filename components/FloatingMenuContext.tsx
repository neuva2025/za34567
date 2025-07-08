import React, { createContext, useContext, useState } from 'react';

interface FloatingMenuContextType {
  isVisible: boolean;
  showMenu: () => void;
  hideMenu: () => void;
  toggleMenu: () => void;
}

const FloatingMenuContext = createContext<FloatingMenuContextType | undefined>(undefined);

export const FloatingMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  const showMenu = () => setIsVisible(true);
  const hideMenu = () => setIsVisible(false);
  const toggleMenu = () => setIsVisible(prev => !prev);

  return (
    <FloatingMenuContext.Provider value={{ isVisible, showMenu, hideMenu, toggleMenu }}>
      {children}
    </FloatingMenuContext.Provider>
  );
};

export const useFloatingMenu = () => {
  const context = useContext(FloatingMenuContext);
  if (!context) {
    throw new Error('useFloatingMenu must be used within a FloatingMenuProvider');
  }
  return context;
};