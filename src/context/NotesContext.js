import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotesContext = createContext();

export const NotesProvider = ({children}) => {
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
    <NotesContext.Provider value={{notes, setNotes: updateNotes}}>
      {children}
    </NotesContext.Provider>
  );
};
