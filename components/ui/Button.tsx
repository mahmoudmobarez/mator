import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Get styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};
    
    // Set base styles
    buttonStyle = {
      ...styles.button,
      ...(fullWidth && styles.fullWidth),
    };
    
    // Add size-specific styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
      default:
        buttonStyle = { ...buttonStyle, ...styles.mediumButton };
    }
    
    // Add variant-specific styles
    switch (variant) {
      case 'secondary':
        buttonStyle = { 
          ...buttonStyle, 
          backgroundColor: colors.secondary,
        };
        break;
      case 'outline':
        buttonStyle = { 
          ...buttonStyle, 
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
        break;
      case 'ghost':
        buttonStyle = { 
          ...buttonStyle, 
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
        break;
      default:
        buttonStyle = { 
          ...buttonStyle, 
          backgroundColor: colors.primary,
        };
    }
    
    // Add disabled styles
    if (disabled) {
      buttonStyle = { 
        ...buttonStyle, 
        opacity: 0.5,
      };
    }
    
    return buttonStyle;
  };
  
  const getTextStyles = (): TextStyle => {
    let textStyles: TextStyle = {
      ...styles.text,
    };
    
    // Add size-specific text styles
    switch (size) {
      case 'small':
        textStyles = { ...textStyles, ...styles.smallText };
        break;
      case 'large':
        textStyles = { ...textStyles, ...styles.largeText };
        break;
      default:
        textStyles = { ...textStyles, ...styles.mediumText };
    }
    
    // Add variant-specific text styles
    switch (variant) {
      case 'outline':
      case 'ghost':
        textStyles = { 
          ...textStyles, 
          color: colors.primary,
        };
        break;
      default:
        textStyles = { 
          ...textStyles, 
          color: '#000',
        };
    }
    
    return textStyles;
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#000' : colors.primary} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyles(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontFamily: 'Rubik-Medium',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});