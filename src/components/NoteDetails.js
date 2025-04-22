import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useColorScheme} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {lightTheme, darkTheme} from '../theme/colors';
import {NotesContext} from './NotesContext';
import WheelColorPicker from 'react-native-wheel-color-picker';

export default function NoteDetails({route}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation();

  const {note} = route.params;
  const {notes, setNotes} = useContext(NotesContext);
  const [currentNote, setCurrentNote] = useState(note);

  const handleColorChange = color => {
    const updatedNote = {...currentNote, color};
    setCurrentNote(updatedNote);
    setNotes(prev =>
      prev.map(n => (n.id === updatedNote.id ? updatedNote : n)),
    );
    setShowColorPicker(false);
  };

  return (
    <Pressable
      onLongPress={() => setShowEditModal(true)}
      style={[styles.container, {backgroundColor: currentNote.color}]}>
      <Text style={[styles.title, {color: themeColors.text}]}>
        Nota: {currentNote.title}
      </Text>

      {/* Modal de opções */}
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
                setShowColorPicker(true);
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

      {/* Modal do color picker */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.modalTitle}>Escolha uma cor</Text>
            <WheelColorPicker
              initialColor={currentNote.color}
              onColorChangeComplete={handleColorChange}
              thumbStyle={{height: 30, width: 30, borderRadius: 15}}
              sliderSize={30}
              style={{height: 300, width: '100%'}}
            />
            <TouchableOpacity
              onPress={() => setShowColorPicker(false)}
              style={{marginTop: 12}}>
              <Text style={{color: 'blue', textAlign: 'center'}}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Pressable>
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
    backgroundColor: '#eee',
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
  pickerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '90%',
  },
});
