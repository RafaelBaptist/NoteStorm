import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, FlatList, Pressable, Alert} from 'react-native';
import {useColorScheme} from 'react-native';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import OptionsModal from '../components/OptionsModal';
import {getStyles} from '../screens/homeStyles';
import logo from '../assets/icons/icon.png';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../theme/colors';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;
  const styles = getStyles(themeColors, theme === 'dark');

  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.log('Erro ao carregar notas do storage:', error);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.log('Erro ao salvar notas no storage:', error);
      }
    };

    saveNotes();
  }, [notes]);

  const handleSaveNote = () => {
    if (newTitle.trim() === '') return;

    if (selectedNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[selectedNoteIndex].title = newTitle;
      setNotes(updatedNotes);
      setSelectedNoteIndex(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: newTitle,
        icon: null,
        color: themeColors.card,
      };
      setNotes([...notes, newNote]);
    }

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
          setSelectedNoteIndex(null);
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
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        const updatedNotes = [...notes];
        updatedNotes[selectedNoteIndex].icon = {uri: selectedImageUri};
        setNotes(updatedNotes);
      }
    });
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
        placeholderTextColor={themeColors.placeholder}
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

      <Pressable
        onPress={() => {
          setNewTitle('');
          setSelectedNoteIndex(null);
          setModalVisible(true);
        }}
        style={styles.addButton}>
        <Text style={styles.addText}>+</Text>
      </Pressable>

      <NoteModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedNoteIndex(null);
          setNewTitle('');
        }}
        onSave={handleSaveNote}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        toggleTheme={toggleTheme}
        theme={theme}
        styles={styles}
        isDark={theme === 'dark'}
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
