import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

interface PreferenceState {
  [key: string]: boolean;
}

export default function PagePreference() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const files = JSON.parse(params.files as string || '[]');

  const [preferences, setPreferences] = useState<PreferenceState>({
    allColorPrint: false,
    allBlackWhitePrint: false,
    specificPagesColorPrint: false,
    singleSided: false,
    doubleSided: false,
    horizontal: false,
    vertical: false,
    a4: false,
    a3: false,
    certificatePrint: false,
    posterPrint: false,
    whiteSheetBinding: false,
    clearSheetBinding: false,
    tapeBind: false,
  });

  const handleToggle = (key: string) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getSelectedPreferences = () => {
    return Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRINT PREFERENCE</Text>
      </View>

      <ScrollView style={styles.content}>
        {Object.keys(preferences).map((key) => (
          <View key={key} style={styles.option}>
            <Text style={styles.optionLabel}>{key}</Text>
            <Switch
              value={preferences[key]}
              onValueChange={() => handleToggle(key)}
              trackColor={{ false: "#555", true: "#007AFF" }}
            />
          </View>
        ))}
      </ScrollView>

      <Link
        href={{
          pathname: "/printcard",
          params: {
            files: JSON.stringify(files),
            preferences: JSON.stringify(getSelectedPreferences()),
          },
        }}
        asChild
      >
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next: Review Cart</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  optionLabel: {
    color: 'white',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
    margin: 15,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
