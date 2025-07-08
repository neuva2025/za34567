import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/Config';

const PasswordResetScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
      setLoading(false);
    } catch (error) {
      setMessage('Failed to send password reset email. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Button title={loading ? 'Sending...' : 'Send Password Reset Email'} onPress={handlePasswordReset} />
      {message && <Text>{message}</Text>}
    </View>
  );
};

export default PasswordResetScreen;

