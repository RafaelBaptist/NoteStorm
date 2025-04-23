import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';

export default function ColorPickerModal({
  visible,
  currentColor,
  onClose,
  onColorChange,
}) {
  const [color, setColor] = useState(currentColor);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <Text style={styles.modalTitle}>Escolha uma cor</Text>

          <View style={styles.colorPreview} backgroundColor={color} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Aplicar Cor</Text>
          </TouchableOpacity>
          <WheelColorPicker
            initialColor={currentColor}
            onColorChange={color => {
              setColor(color);
              onColorChange(color);
            }}
            thumbSize={30}
            sliderSize={30}
            style={styles.colorPicker}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorPicker: {
    width: '100%',
    height: 300,
    marginVertical: 20,
  },
  colorPreview: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#db125f',
    padding: 10,
    borderRadius: 8,
    marginTop: 3,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
