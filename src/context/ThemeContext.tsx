import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import { lightTheme, darkTheme, Theme } from '../config/theme';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const theme: Theme = isDarkMode ? darkTheme : lightTheme;

  const contextValue = React.useMemo(() => ({
    isDarkMode,
    toggleTheme,
    theme,
  }), [isDarkMode, toggleTheme, theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};