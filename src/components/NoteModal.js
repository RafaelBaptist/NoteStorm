// src/components/NoteModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  TouchableWithoutFeedback,
} from 'react-native';

export default function NoteModal({
  visible,
  onClose,
  onSave,
  newTitle,
  setNewTitle,
  toggleTheme,
  theme,
  styles,
  isDark,
}) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
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

              <Pressable style={styles.modalBtn} onPress={onSave}>
                <Text style={styles.modalBtnText}>Salvar</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
