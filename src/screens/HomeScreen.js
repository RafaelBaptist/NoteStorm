import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import {useColorScheme} from 'react-native';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import OptionsModal from '../components/OptionsModal';
import {getStyles} from '../screens/homeStyles';
import logo from '../assets/icons/icon.png';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const isDark = theme === 'dark';
  const themeColors = {
    background: isDark ? '#1e1e1e' : '#fff',
    text: isDark ? '#fff' : '#000',
    border: isDark ? '#444' : '#ccc',
    card: isDark ? '#333' : '#f5f5f5',
  };

  const styles = getStyles(themeColors, isDark);

  const handleSaveNote = () => {
    if (newTitle.trim() === '') return;
    const newNote = {
      id: Date.now().toString(),
      title: newTitle,
      icon: null,
      color: themeColors.card,
    };
    setNotes([...notes, newNote]);
    setNewTitle('');
    setModalVisible(false);
  };

  const handleLongPress = index => {
    setSelectedNoteIndex(index);
    setOptionsModalVisible(true);
  };

  const handleEditNote = () => {
    setOptionsModalVisible(false);
    const note = notes[selectedNoteIndex];
    setNewTitle(note.title);
    setModalVisible(true);
  };

  const handleDeleteNote = () => {
    Alert.alert('Confirmar', 'Tem certeza que deseja excluir essa nota?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Excluir',
        onPress: () => {
          const updatedNotes = [...notes];
          updatedNotes.splice(selectedNoteIndex, 1);
          setNotes(updatedNotes);
          setOptionsModalVisible(false);
        },
        style: 'destructive',
      },
    ]);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleColorChange = () => {
    const updatedNotes = [...notes];
    updatedNotes[selectedNoteIndex].color =
      updatedNotes[selectedNoteIndex].color === '#fffae6'
        ? '#e6f7ff'
        : '#fffae6';
    setNotes(updatedNotes);
    setOptionsModalVisible(false);
  };

  const handleImageChange = () => {
    const updatedNotes = [...notes];
    updatedNotes[selectedNoteIndex].icon = require('../assets/icons/icon.png'); // exemplo de ícone
    setNotes(updatedNotes);
    setOptionsModalVisible(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Header styles={styles} logo={logo} onMenuPress={() => {}} />

      <TextInput
        style={styles.search}
        placeholder="Pesquisar notas"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor={themeColors.text}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <NoteCard
            note={item}
            onLongPress={() => handleLongPress(index)}
            themeColors={themeColors}
          />
        )}
      />

      <Pressable style={styles.modalBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.modalBtnText}>+ Adicionar Nota</Text>
      </Pressable>

      <NoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveNote}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        toggleTheme={toggleTheme}
        theme={theme}
        styles={styles}
        isDark={isDark}
      />

      <OptionsModal
        visible={optionsModalVisible}
        onClose={() => setOptionsModalVisible(false)}
        onEdit={handleEditNote}
        onColorChange={handleColorChange}
        onImageChange={handleImageChange}
        onDelete={handleDeleteNote}
        styles={styles}
      />
    </View>
  );
}
