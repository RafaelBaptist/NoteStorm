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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotesContext} from './NotesContext';
import {ThemeContext} from '../context/ThemeContext';
import ColorPickerModal from './ColorPickerModal';

export default function NoteDetails({route, navigation}) {
  const {note} = route.params;
  const {notes, setNotes} = useContext(NotesContext);
  const {themeColors} = useContext(ThemeContext);

  const [currentNote, setCurrentNote] = useState({
    ...note,
    color: note.color || themeColors.card,
    titleColor: note.titleColor || '#000000',
    textColor: note.textColor || '#000000',
    content: note.content || '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const styles = getStyles(themeColors);

  const getContrastColor = backgroundColor => {
    if (!backgroundColor) return '#000000';

    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

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

  const handleColorChange = async (color, type) => {
    if (type === 'background') {
      setCurrentNote({...currentNote, color});
    } else if (type === 'text') {
      setCurrentNote({...currentNote, textColor: color});
    } else if (type === 'title') {
      setCurrentNote({...currentNote, titleColor: color});
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: currentNote.color}]}>
      <Text
        style={[
          styles.title,
          {
            color: currentNote.titleColor,
            textShadowColor:
              getContrastColor(currentNote.color) === '#FFFFFF'
                ? 'rgba(0,0,0,0.3)'
                : 'rgba(255,255,255,0.3)',
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 2,
          },
        ]}>
        {currentNote.title}
      </Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isEditingContent ? (
          <TextInput
            style={[
              styles.contentInput,
              {
                color: currentNote.textColor,
                backgroundColor: currentNote.color,
                textShadowColor:
                  getContrastColor(currentNote.color) === '#FFFFFF'
                    ? 'rgba(0,0,0,0.3)'
                    : 'transparent',
              },
            ]}
            multiline
            autoFocus
            value={currentNote.content}
            onChangeText={text =>
              setCurrentNote({...currentNote, content: text})
            }
            onBlur={() => setIsEditingContent(false)}
            placeholder="Digite o conteúdo da sua nota..."
            placeholderTextColor={themeColors.placeholder}
          />
        ) : (
          <TouchableOpacity
            style={styles.contentTextContainer}
            onPress={() => setIsEditingContent(true)}
            onLongPress={() => setShowEditModal(true)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.contentText,
                {
                  color: currentNote.textColor,
                  textShadowColor:
                    getContrastColor(currentNote.color) === '#FFFFFF'
                      ? 'rgba(0,0,0,0.3)'
                      : 'transparent',
                  textShadowOffset: {width: 1, height: 1},
                  textShadowRadius: 2,
                },
              ]}>
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
              <Text style={styles.optionText}>Alterar cor do fundo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowEditModal(false);
                setTimeout(() => setShowTitleColorPicker(true), 300);
              }}>
              <Text style={styles.optionText}>Alterar cor do título</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setShowEditModal(false);
                setTimeout(() => setShowTextColorPicker(true), 300);
              }}>
              <Text style={styles.optionText}>Alterar cor do texto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}>
              <Text
                style={[styles.optionText, {color: themeColors.buttonText}]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showColorPicker && (
        <ColorPickerModal
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          currentColor={currentNote.color}
          onColorChange={color => handleColorChange(color, 'background')}
        />
      )}

      {showTitleColorPicker && (
        <ColorPickerModal
          visible={showTitleColorPicker}
          onClose={() => setShowTitleColorPicker(false)}
          currentColor={currentNote.titleColor}
          onColorChange={color => handleColorChange(color, 'title')}
        />
      )}

      {showTextColorPicker && (
        <ColorPickerModal
          visible={showTextColorPicker}
          onClose={() => setShowTextColorPicker(false)}
          currentColor={currentNote.textColor}
          onColorChange={color => handleColorChange(color, 'text')}
        />
      )}
    </View>
  );
}

function getStyles(themeColors) {
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
    },
    contentInput: {
      flex: 1,
      fontSize: 16,
      textAlignVertical: 'top',
      padding: 15,
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
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: themeColors.modalBackground,
      padding: 20,
      borderRadius: 16,
      width: '80%',
      alignItems: 'center',
      borderColor: themeColors.border,
      borderWidth: 1,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: themeColors.text,
    },
    optionButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: themeColors.primary,
      borderRadius: 8,
      marginBottom: 10,
      width: '100%',
    },
    optionText: {
      fontSize: 16,
      textAlign: 'center',
      color: themeColors.buttonText,
    },
    cancelButton: {
      marginTop: 8,
    },
  });
}
