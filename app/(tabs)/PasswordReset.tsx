import React, { useState } from 'react';
import { TextInput, Button, Alert, View } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

// TypeScript will infer 'error' as 'unknown', so we need to safely handle it
const PasswordReset = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Check your email', 'A password reset link has been sent.');
    } catch (error: unknown) {
      // Type Narrowing for 'unknown' type to check if it's a FirebaseError
      if (error instanceof Error) {
        Alert.alert('Error', error.message);  // General Error handling
      } else {
        // Fallback if the error is not an instance of Error (although unlikely)
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset Password" onPress={handlePasswordReset} />
    </View>
  );
};

export default PasswordReset;

