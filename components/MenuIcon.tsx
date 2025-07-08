// MenuIcon.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MenuIconProps {
  color?: string;
  size?: number;
}

const MenuIcon: React.FC<MenuIconProps> = ({ color = '#fff', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M3 12H21" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M3 6H21" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M3 18H21" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

export default MenuIcon;