import { createContext, useContext } from 'react';
import { ThemeContextType } from '../types';

// Create context with undefined as initial value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext, useTheme };