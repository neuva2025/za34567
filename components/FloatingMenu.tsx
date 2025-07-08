import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Simple Z Button Component
interface ZButtonProps {
  onPress: () => void;
}

const ZButton: React.FC<ZButtonProps> = ({ onPress }) => {
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.iconButton,
        {
          transform: [{ scale: scaleAnimation }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.zText}>Z</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface FloatingMenuProps {
  onProfilePress?: () => void;
  visible?: boolean;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ 
  onProfilePress,
  visible = true
}) => {
  const router = useRouter();
  const { width } = Dimensions.get('window');
  const scaleAnimation = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const fadeAnimation = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnimation, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleZButtonPress = () => {
    router.push('/OrderDashboard');
  };

  const handleHomePress = () => {
    router.push('/HomeScreen');
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/ProfilePage');
    }
  };

  const renderHomeIcon = () => {
    const itemScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(itemScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(itemScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.iconButton,
          {
            transform: [
              { scale: scaleAnimation },
              { scale: itemScale },
            ],
            opacity: fadeAnimation,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleHomePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="home" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderProfileIcon = () => {
    const itemScale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(itemScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(itemScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.iconButton,
          {
            transform: [
              { scale: scaleAnimation },
              { scale: itemScale },
            ],
            opacity: fadeAnimation,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleProfilePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrapper}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { width: width - 32 }]}>
      <View style={styles.dockContainer}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnimation }],
            opacity: fadeAnimation,
          }}
        >
          <ZButton onPress={handleZButtonPress} />
        </Animated.View>
        
        {renderHomeIcon()}
        {renderProfileIcon()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  dockContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 32,
    padding: 8,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconButton: {
    padding: 8,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  zText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

export default FloatingMenu;