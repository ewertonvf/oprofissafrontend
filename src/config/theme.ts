import { DefaultTheme } from '@react-navigation/native';

const baseColors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  error: '#dc3545',
  white: '#ffffff',
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...baseColors,
    background: '#f8f9fa',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#212529',
    secondaryText: '#6c757d',
    border: '#dee2e6',
    notification: baseColors.warning,
    light: '#f8f9fa',
    dark: '#343a40',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
  fontWeights: {
    normal: '400',
    bold: '700',
  },
  borderRadii: {
    small: 4,
    medium: 8,
    large: 16,
    full: 9999,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',
    text: '#FFFFFF',
    secondaryText: '#B0B0B0',
    border: '#3D3D3D',
  },
};

export type Theme = typeof lightTheme;

export const getThemeColors = (isDarkMode: boolean) => 
  isDarkMode ? darkTheme.colors : lightTheme.colors;

export default {
  light: lightTheme,
  dark: darkTheme,
};