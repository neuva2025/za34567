// Logo.tsx
import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Logo = () => {
  const router = useRouter();

  const handleLogoPress = () => {
    // Navigate to index page
    router.push('/');
    // Alternative: If you want to go back in navigation stack
    // router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleLogoPress}>
        <Image source={require('../assets/images/zapp.png')} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 50,
  },
});

export default Logo;