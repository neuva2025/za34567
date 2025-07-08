import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

interface PrintFile {
  name: string;
  size: string;
}

export default function PrintOuts() {
  const [files, setFiles] = useState<PrintFile[]>([]);
  const router = useRouter();

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: false,
      });

      // Check if the result is successful and has the required properties
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newFile: PrintFile = {
          name: file.name,
          size: file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'
        };
        
        setFiles(prevFiles => [...prevFiles, newFile]);
        console.log('File added:', newFile); // Debug log
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  const handleNext = () => {
    if (files.length > 0) {
      try {
        const params = {
          files: JSON.stringify(files)
        };
        console.log('Navigating with params:', params); // Debug log
        router.push({
          pathname: "/pagepreference",
          params: params
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Files</Text>
      
      <Button
        title="Upload File"
        onPress={handleFileUpload}
        color="#007AFF"
      />

      <FlatList
        data={files}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.fileItemContainer}>
            <Text style={styles.fileItem}>{item.name} ({item.size})</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No files uploaded yet</Text>
        }
      />

      {files.length > 0 && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.nextButtonText}>Next: Set Preferences</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 15,
    flexGrow: 1,
  },
  fileItemContainer: {
    marginVertical: 5,
  },
  fileItem: {
    fontSize: 18,
    color: 'white',
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});