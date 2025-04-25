import React, {createContext, useState} from 'react';
import {lightTheme, darkTheme} from '../theme/colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const themeColors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, themeColors}}>
      {children}
    </ThemeContext.Provider>
  );
};
