import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface Option {
  label: string;
  value: string;
}

const options: Option[] = [
  { label: 'Veg', value: 'veg' },
  { label: 'All', value: 'all' },
  { label: 'Non-Veg', value: 'non-veg' },
];

const SliderButton: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [sliderPosition] = useState(new Animated.Value(0));

  const handleOptionPress = (value: string) => {
    setSelectedOption(value);

    const targetPosition =
      value === options[0].value
        ? 0
        : value === options[1].value
        ? 0.5
        : 1;

    Animated.timing(sliderPosition, {
      toValue: targetPosition,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            { left: `${index * 33.33}%` },
          ]}
          onPress={() => handleOptionPress(option.value)}
        >
          <Text style={styles.optionText}>{option.label}</Text>
          {/* Add your logo here */}
        </TouchableOpacity>
      ))}

      <Animated.View
        style={[
          styles.slider,
          {
            transform: [{ translateX: Animated.multiply(sliderPosition, '200') }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '33.33%',
    height: 5,
    backgroundColor: '#007aff', // Slider color
    borderRadius: 3,
  },
});

export default SliderButton;