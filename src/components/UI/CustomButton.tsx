import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTransition } from '../../hooks/useTransition';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  isLoading = false,
  disabled = false
}) => {
  const { theme } = useTheme();
  const { isPending, startTransition } = useTransition();

  const handlePress = () => {
    if (typeof onPress === 'function') {
      startTransition(() => {
        onPress();
      });
    }
  };

  const getButtonStyles = () => [
    styles.button,
    { backgroundColor: theme.colors.primary },
    (disabled || isPending) && styles.disabledButton,
    style,
  ];

  const getTextStyles = () => [
    styles.buttonText,
    { color: theme.colors.white },
    textStyle,
  ];

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
      style={getButtonStyles()}
      onPress={handlePress}
      disabled={isLoading || disabled || isPending}
    >
      {(isLoading || isPending) ? (
        <ActivityIndicator size="small" color={theme.colors.white} />
      ) : (
        <Text style={getTextStyles()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton;