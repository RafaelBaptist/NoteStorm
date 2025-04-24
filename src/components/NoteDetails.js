import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {useColorScheme} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NotesContext} from './NotesContext';
import ColorPickerModal from './ColorPickerModal';
import {lightTheme, darkTheme} from '../theme/colors';
export default function NoteDetails({route}) {
  const {note} = route.params;
  const {notes, setNotes} = useContext(NotesContext);
  const [currentNote, setCurrentNote] = useState({
    ...note,
    color: note.color || '#FFFFFF',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = getStyles(theme, colorScheme === 'dark');

  const handleColorChange = async color => {
    try {
      const updatedNote = {...currentNote, color};
      setCurrentNote(updatedNote);

      const updatedNotes = notes.map(n =>
        n.id === updatedNote.id ? updatedNote : n,
      );

      const success = await setNotes(updatedNotes);

      if (success) {
        ToastAndroid.show('Cor salva com sucesso!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Erro ao salvar cor', ToastAndroid.LONG);
      }
    } catch (error) {
      console.error('Erro ao atualizar cor:', error);
      ToastAndroid.show('Erro ao salvar cor', ToastAndroid.LONG);
    }
  };
  return (
    <View style={[styles.container, {backgroundColor: currentNote.color}]}>
      <Text style={[styles.title, {color: themeColors.text}]}>
        {currentNote.title}
      </Text>

      <TouchableOpacity
        onLongPress={() => setShowEditModal(true)}
        style={styles.contentBox}
        activeOpacity={0.8}></TouchableOpacity>

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
              <Text style={styles.optionText}>🎨 Editar cor</Text>
            </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  contentBox: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.buttonBackground,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 8,
  },
});
