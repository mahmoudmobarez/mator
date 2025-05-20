import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 0 | 1 | 2 | 3;
  noPadding?: boolean;
}

export default function Card({ 
  children, 
  style, 
  elevation = 1,
  noPadding = false
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getElevationStyle = () => {
    switch (elevation) {
      case 0:
        return {};
      case 2:
        return colorScheme === 'dark' 
          ? styles.elevation2Dark 
          : styles.elevation2Light;
      case 3:
        return colorScheme === 'dark' 
          ? styles.elevation3Dark 
          : styles.elevation3Light;
      case 1:
      default:
        return colorScheme === 'dark' 
          ? styles.elevation1Dark 
          : styles.elevation1Light;
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
        getElevationStyle(),
        noPadding ? styles.noPadding : styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
  elevation1Light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  elevation2Light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  elevation3Light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  elevation1Dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  elevation2Dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  elevation3Dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});