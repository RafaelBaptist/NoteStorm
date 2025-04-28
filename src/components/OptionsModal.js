import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';

export default function OptionsModal({
  visible,
  onClose,
  onEdit,
  onColorChange,
  onImageChange,
  onDelete,
  styles,
  setShowColorPicker,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>O que deseja fazer?</Text>

            <Pressable style={styles.modalBtnEdit} onPress={onEdit}>
              <Text style={styles.modalBtnText}>✏️ Editar conteúdo</Text>
            </Pressable>

            <Pressable
              style={styles.modalBtnEdit}
              onPress={() => {
                onClose();

                setShowColorPicker(true);
              }}>
              <Text style={styles.modalBtnText}>🎨 Editar cor</Text>
            </Pressable>

            <Pressable style={styles.modalBtnEdit} onPress={onImageChange}>
              <Text style={styles.modalBtnText}>🖼️ Trocar imagem</Text>
            </Pressable>

            <Pressable
              style={[styles.modalBtnEdit, {backgroundColor: 'red'}]}
              onPress={onDelete}>
              <Text style={styles.modalBtnText}>🗑️ Excluir nota</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
