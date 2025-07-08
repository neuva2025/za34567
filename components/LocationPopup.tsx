import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface LocationPopupProps {
  visible: boolean;
  onClose: () => void;
  onLocationSubmit: (location: string) => void;
}

const LocationPopup: React.FC<LocationPopupProps> = ({ visible, onClose, onLocationSubmit }) => {
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (location.trim()) {
      onLocationSubmit(location); // Pass the location to the parent
      setLocation(''); // Clear the input field
      onClose(); // Close the modal after submitting the location
    } else {
      alert('Please enter a valid location!'); // Alert if the input is empty
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Where are you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Building and Room"
            value={location}
            onChangeText={setLocation}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  popup: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LocationPopup;

