// ProfileSetupScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

const ProfileSetupScreen = ({ navigation }: any) => {
  const [regNo, setRegNo] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [batch, setBatch] = useState('');
  const [srmEmail, setSrmEmail] = useState('');

  const handleProfileSetup = async () => {
    const user = firebase.auth().currentUser;

    if (user) {
      await firebase.firestore().collection('zappers').doc(user.uid).update({
        regNo,
        phoneNo,
        batch,
        srmEmail,
      });
      navigation.navigate('Main');
    } else {
      Alert.alert('Error', 'User not authenticated');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>
      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        value={regNo}
        onChangeText={setRegNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNo}
        onChangeText={setPhoneNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Batch (1 or 2)"
        value={batch}
        onChangeText={setBatch}
      />
      <TextInput
        style={styles.input}
        placeholder="SRM Email"
        value={srmEmail}
        onChangeText={setSrmEmail}
      />
      <Button title="Save Profile" onPress={handleProfileSetup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
  },
});

export default ProfileSetupScreen;
