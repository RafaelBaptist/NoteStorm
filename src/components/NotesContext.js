import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotesContext = createContext();

export const NotesProvider = ({children}) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@notes');
        if (jsonValue !== null) {
          const parsedNotes = JSON.parse(jsonValue);

          const validatedNotes = parsedNotes.map(note => ({
            id: note.id || Date.now().toString(),
            title: note.title || 'Nova nota',
            content: note.content || '',
            color: note.color || '#FFFFFF',
            createdAt: note.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          setNotes(validatedNotes);
        }
      } catch (e) {
        console.error('Erro ao carregar notas:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotes();
  }, []);

  const saveNotes = async notesToSave => {
    try {
      const validNotes = notesToSave.filter(
        note =>
          note &&
          typeof note === 'object' &&
          note.id &&
          typeof note.title === 'string',
      );

      const jsonValue = JSON.stringify(validNotes);
      await AsyncStorage.setItem('@notes', jsonValue);
      return true;
    } catch (e) {
      console.error('Erro ao salvar notas:', e);
      return false;
    }
  };

  const updateNotes = async newNotes => {
    const success = await saveNotes(newNotes);
    if (success) {
      setNotes(newNotes);
    }
    return success;
  };

  return (
    <NotesContext.Provider value={{notes, setNotes: updateNotes, isLoading}}>
      {children}
    </NotesContext.Provider>
  );
};
