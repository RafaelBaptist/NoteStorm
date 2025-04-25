import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../theme/colors';

// Defina os valores padrão para os contextos
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  themeColors: lightTheme,
});

export const NotesContext = createContext({
  notes: [],
  setNotes: () => {},
});

// Providers
export function AppProviders({children}) {
  // Gerenciamento do tema
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      return newTheme;
    });
  };

  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  // Gerenciamento das notas
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('@notes');
        if (storedNotes) setNotes(JSON.parse(storedNotes));
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, []);

  const updateNotes = async newNotes => {
    try {
      await AsyncStorage.setItem('@notes', JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, themeColors}}>
      <NotesContext.Provider value={{notes, setNotes: updateNotes}}>
        {children}
      </NotesContext.Provider>
    </ThemeContext.Provider>
  );
}
