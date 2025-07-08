import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  width?: number;
  height?: number;
  color?: string;
}

const TrackDelEMoped: React.FC<Props> = ({ width = 30, height = 30, color = 'black' }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 0" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
    </Svg>
  );
};

export default TrackDelEMoped;
