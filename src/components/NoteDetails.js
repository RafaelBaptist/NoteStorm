import React, {useState, useContext} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {lightTheme, darkTheme} from '../theme/colors';
import {NotesContext} from './NotesContext';

export default function NoteDetails({route}) {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();

  const {note} = route.params;

  const {notes, setNotes} = useContext(NotesContext);
  const [currentNote, setCurrentNote] = useState(note);

  const handleColorChange = () => {
    const colors = ['#FFD700', '#FF69B4', '#87CEFA', '#90EE90', '#FFA07A'];
    const currentColorIndex = colors.indexOf(currentNote.color);
    const nextColor = colors[(currentColorIndex + 1) % colors.length];

    const updatedNote = {...currentNote, color: nextColor};
    setCurrentNote(updatedNote);
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === updatedNote.id ? updatedNote : n)),
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: currentNote.color}]}>
      <Text style={[styles.title, {color: themeColors.text}]}>
        Nota: {currentNote.title}
      </Text>

      <Pressable style={styles.colorButton} onPress={handleColorChange}>
        <Text style={[styles.colorButtonText, {color: themeColors.text}]}>
          Trocar cor
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  colorButton: {
    padding: 16,
    backgroundColor: '#00000020',
    borderRadius: 10,
  },
  colorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
