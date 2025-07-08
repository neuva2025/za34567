import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CategorySlider: React.FC = () => {
  const categories = ["UB", "JAVA", "TP"];
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Category:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
          style={styles.picker}
        >
          <Picker.Item label="-- Choose an option --" value="" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
      </View>

      {selectedCategory && (
        <Text style={styles.selectedCategory}>
          You selected: <Text style={styles.selectedCategoryValue}>{selectedCategory}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  label: {
    marginRight: 8,
    fontSize: 16,
    color: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    padding: 8,
    fontSize: 14,
    color: '#000',
  },
  selectedCategory: {
    marginTop: 10,
    fontSize: 14,
    color: '#112b38',
  },
  selectedCategoryValue: {
    fontWeight: 'bold',
  },
});

export default CategorySlider;