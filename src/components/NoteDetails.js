import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotesContext} from './NotesContext';
import ColorPickerModal from './ColorPickerModal';
import {lightTheme, darkTheme} from '../theme/colors';

export default function NoteDetails({route, navigation}) {
  const {note} = route.params;
  const {notes, setNotes} = useContext(NotesContext);
  const [currentNote, setCurrentNote] = useState({
    ...note,
    color: note.color || '#FFFFFF',
    content: note.content || '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  useEffect(() => {
    const saveNote = async () => {
      try {
        const updatedNotes = notes.map(n =>
          n.id === currentNote.id ? currentNote : n,
        );
        await AsyncStorage.setItem('@notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
      } catch (error) {
        console.error('Erro ao salvar nota:', error);
      }
    };

    const unsubscribeBlur = navigation.addListener('blur', saveNote);

    saveNote();

    return () => {
      unsubscribeBlur();
    };
  }, [currentNote, navigation, notes, setNotes]);

  const handleColorChange = async color => {
    const updatedNote = {...currentNote, color};
    setCurrentNote(updatedNote);
  };

  return (
    <View style={[styles.container, {backgroundColor: currentNote.color}]}>
      <Text style={styles.title}>{currentNote.title}</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isEditingContent ? (
          <TextInput
            style={[styles.contentInput, {color: theme.text}]}
            multiline
            autoFocus
            value={currentNote.content}
            onChangeText={text =>
              setCurrentNote({...currentNote, content: text})
            }
            onBlur={() => setIsEditingContent(false)}
            placeholder="Digite o conteúdo da sua nota..."
            placeholderTextColor={theme.placeholderText}
          />
        ) : (
          <TouchableOpacity
            style={styles.contentTextContainer}
            onPress={() => setIsEditingContent(true)}
            onLongPress={() => setShowEditModal(true)}
            activeOpacity={0.7}>
            <Text style={[styles.contentText, {color: theme.text}]}>
              {currentNote.content || 'Toque para adicionar conteúdo...'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar nota</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowEditModal(false);
                setTimeout(() => setShowColorPicker(true), 300);
              }}>
              <Text style={styles.optionText}>Editar cor</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowEditModal(false);
                setIsEditingContent(true);
              }}>
              <Text style={styles.optionText}>Editar conteúdo</Text>
            </TouchableOpacity> */}
            {/* TRANSFORMAR EM EDITAR COR DO TITULO,OU TEXTO,TAMANHO ETC*/}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}>
              <Text style={[styles.optionText, {color: 'red'}]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showColorPicker && (
        <ColorPickerModal
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          currentColor={currentNote.color}
          onColorChange={handleColorChange}
        />
      )}
    </View>
  );
}

function getStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginLeft: 20,
      marginTop: 10,
      marginBottom: 20,
      alignSelf: 'flex-start',
      color: theme.text,
    },
    contentInput: {
      flex: 1,
      fontSize: 16,
      textAlignVertical: 'top',
      padding: 15,
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      marginBottom: 20,
    },
    contentTextContainer: {
      flex: 1,
      padding: 15,
    },
    contentText: {
      fontSize: 16,
      lineHeight: 24,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.modalBackground,
      padding: 20,
      borderRadius: 16,
      width: '80%',
      alignItems: 'center',
      borderColor: theme.borderColor,
      borderWidth: 1,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.text,
    },
    optionButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: theme.primary,
      borderRadius: 8,
      marginBottom: 10,
      width: '100%',
    },
    optionText: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.buttonText,
    },
    cancelButton: {
      marginTop: 8,
    },
  });
}
