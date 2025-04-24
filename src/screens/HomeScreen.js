import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Alert,
  ToastAndroid,
} from 'react-native';
import {useColorScheme} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import OptionsModal from '../components/OptionsModal';
import {getStyles} from '../screens/homeStyles';
import logo from '../assets/icons/icon.png';
import {launchImageLibrary} from 'react-native-image-picker';
import {lightTheme, darkTheme} from '../theme/colors';
import {NotesContext} from '../components/NotesContext';
import ColorPickerModal from '../components/ColorPickerModal';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const themeColors = theme === 'dark' ? darkTheme : lightTheme;
  const styles = getStyles(themeColors, theme === 'dark');

  const {notes, setNotes} = useContext(NotesContext);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('@notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.log('Erro ao carregar notas:', error);
      }
    };
    loadNotes();
  }, []);

  const handleSaveNote = async () => {
    if (!newTitle.trim()) {
      ToastAndroid.show('Digite um título para a nota', ToastAndroid.SHORT);
      return;
    }

    try {
      if (selectedNoteId) {
        const updatedNotes = notes.map(note =>
          note.id === selectedNoteId
            ? {...note, title: newTitle, updatedAt: new Date().toISOString()}
            : note,
        );
        await setNotes(updatedNotes);
        ToastAndroid.show('Nota atualizada!', ToastAndroid.SHORT);
      } else {
        const newNote = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: newTitle,
          content: '',
          color: themeColors.card,
          icon: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setNotes([newNote, ...notes]);
        ToastAndroid.show('Nota criada!', ToastAndroid.SHORT);
      }

      setNewTitle('');
      setSelectedNoteId(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
      ToastAndroid.show('Erro ao salvar nota', ToastAndroid.LONG);
    }
  };

  const handleLongPress = noteId => {
    setSelectedNoteId(noteId);
    setOptionsModalVisible(true);
  };

  const handleEditNote = () => {
    const noteToEdit = notes.find(note => note.id === selectedNoteId);
    if (noteToEdit) {
      setNewTitle(noteToEdit.title);
      setModalVisible(true);
    }
    setOptionsModalVisible(false);
  };

  const handleDeleteNote = () => {
    Alert.alert('Confirmar', 'Tem certeza que deseja excluir essa nota?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Excluir',
        onPress: async () => {
          try {
            const updatedNotes = notes.filter(
              note => note.id !== selectedNoteId,
            );
            await setNotes(updatedNotes);
            setOptionsModalVisible(false);
            setSelectedNoteId(null);
            ToastAndroid.show('Nota excluída!', ToastAndroid.SHORT);
          } catch (error) {
            ToastAndroid.show('Erro ao excluir nota', ToastAndroid.LONG);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    ToastAndroid.show(
      `Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`,
      ToastAndroid.SHORT,
    );
  };

  const handleColorChange = async color => {
    try {
      const updatedNotes = notes.map(note =>
        note.id === selectedNoteId ? {...note, color} : note,
      );
      await setNotes(updatedNotes);
      setShowColorPicker(false);
      ToastAndroid.show('Cor atualizada!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Erro ao salvar cor', ToastAndroid.LONG);
    }
  };

  const handleImageChange = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.assets?.[0]?.uri) {
        const updatedNotes = notes.map(note =>
          note.id === selectedNoteId
            ? {...note, icon: {uri: response.assets[0].uri}}
            : note,
        );
        setNotes(updatedNotes);
        ToastAndroid.show('Ícone atualizado!', ToastAndroid.SHORT);
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
        renderItem={({item}) => (
          <NoteCard
            note={item}
            onPress={() =>
              navigation.navigate('NoteDetails', {
                note: item,
              })
            }
            onLongPress={() => handleLongPress(item.id)}
            themeColors={themeColors}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText
              ? 'Nenhuma nota encontrada'
              : 'Nenhuma nota criada ainda'}
          </Text>
        }
      />

      <Pressable
        onPress={() => {
          setNewTitle('');
          setSelectedNoteId(null);
          setModalVisible(true);
        }}
        style={styles.addButton}>
        <Text style={styles.addText}>+</Text>
      </Pressable>

      <NoteModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
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
        onColorChange={() => {
          setOptionsModalVisible(false);
          setShowColorPicker(true);
        }}
        onImageChange={handleImageChange}
        onDelete={handleDeleteNote}
        styles={styles}
      />

      <ColorPickerModal
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        currentColor={
          notes.find(n => n.id === selectedNoteId)?.color || themeColors.card
        }
        onColorChange={handleColorChange}
        theme={theme}
      />
    </View>
  );
}
