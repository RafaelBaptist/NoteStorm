import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
  Modal,
  Pressable,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from '../theme/colors';

const logo = require('../assets/icons/icon.png');

const defaultNotes = [
  {id: '1', title: 'Ideia de app', icon: require('../assets/icons/dog.png')},
  {
    id: '2',
    title: 'Rascunho de logo',
    icon: require('../assets/icons/dog.png'),
  },
  {id: '3', title: 'Reunião de brainstorm', icon: null},
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const isDark = theme === 'dark';
  const themeColors = isDark ? darkTheme : lightTheme;
  const styles = getStyles(themeColors, isDark);

  useEffect(() => {
    const loadNotes = async () => {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes(defaultNotes);
      }
    };
    loadNotes();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  const addNote = () => {
    if (!newTitle.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      title: newTitle,
      icon: null,
    };
    setNotes(prev => [newNote, ...prev]);
    setNewTitle('');
    setModalVisible(false);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Image source={logo} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.header}>NoteStorm</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Pesquisar nota..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={isDark ? '#aaa' : '#555'}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.noteCard}>
            {item.icon ? (
              <Image source={item.icon} style={styles.icon} />
            ) : (
              <View style={styles.iconPlaceholder}>
                <Text style={{fontSize: 18}}>📝</Text>
              </View>
            )}
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nova Nota</Text>
              <TextInput
                style={styles.input}
                placeholder="Título da nota"
                value={newTitle}
                onChangeText={setNewTitle}
                placeholderTextColor={isDark ? '#aaa' : '#666'}
              />
              <View style={styles.themeToggle}>
                <Text style={styles.menuItem}>Modo Escuro</Text>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  thumbColor={theme === 'dark' ? '#fff' : '#fff'}
                  trackColor={{false: '#ccc', true: '#db125f'}}
                />
              </View>
              <Pressable style={styles.modalBtn} onPress={addNote}>
                <Text style={styles.modalBtnText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const getStyles = (themeColors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      padding: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    hamburger: {
      fontSize: 24,
      marginRight: 12,
      color: themeColors.text,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    menu: {
      backgroundColor: isDark ? '#333' : '#eee',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    menuItem: {
      fontSize: 16,
      paddingVertical: 6,
      color: themeColors.text,
    },
    search: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 16,
      color: themeColors.text,
    },
    noteCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginBottom: 8,
      backgroundColor: themeColors.card,
      borderRadius: 12,
    },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      marginRight: 12,
    },
    iconPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#ddd',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      color: themeColors.text,
    },
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: '#db125f',
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
    fabText: {
      color: '#fff',
      fontSize: 30,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: isDark ? '#222' : '#fff',
      padding: 20,
      borderRadius: 10,
      elevation: 10,
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
      color: themeColors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 12,
      color: themeColors.text,
    },
    modalBtn: {
      backgroundColor: '#db125f',
      padding: 12,
      borderRadius: 8,
    },
    modalBtnText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
    themeToggle: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    logo: {
      width: 60,
      height: 60,
      marginRight: 5,
      resizeMode: 'contain',
    },
  });
