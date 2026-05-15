export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

export interface SplashProps {
  onSkip?: () => void;
  onSignUp?: () => void;
  onLogin?: () => void;
  onLanguageChange?: (lang: string) => void;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}