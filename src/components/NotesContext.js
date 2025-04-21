import React, {createContext, useState} from 'react';

export const NotesContext = createContext();

export const NotesProvider = ({children}) => {
  const [notes, setNotes] = useState([]);

  return (
    <NotesContext.Provider value={{notes, setNotes}}>
      {children}
    </NotesContext.Provider>
  );
};
