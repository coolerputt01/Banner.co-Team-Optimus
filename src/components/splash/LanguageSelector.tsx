import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '../../types';

const languages: Language[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English (US)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];

interface LanguageSelectorProps {
  onLanguageChange?: (lang: string) => void;
  className?: string;
  theme: 'light' | 'dark';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange, 
  className,
  theme 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    setIsOpen(false);
    onLanguageChange?.(lang.code);
  };

  const dropdownBg = theme === 'dark' ? 'bg-dark-elevated' : 'bg-white';
  const dropdownText = theme === 'dark' ? 'text-white/80' : 'text-text-primary';
  const dropdownHover = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-primary/5';
  const selectedText = theme === 'dark' ? 'text-primary' : 'text-primary';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest transition-colors ${className}`}
      >
        <Globe className="h-4 w-4" />
        {selectedLang.name}
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg ${dropdownBg} py-2 shadow-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${dropdownHover} ${
                selectedLang.code === lang.code ? selectedText : dropdownText
              }`}
            >
              <span className="block font-medium">{lang.name}</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-text-caption'}`}>
                {lang.nativeName}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};