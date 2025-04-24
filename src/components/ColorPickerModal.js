import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import {lightTheme, darkTheme} from '../theme/colors';

export default function ColorPickerModal({
  visible,
  currentColor,
  onClose,
  onColorChange,
  theme,
}) {
  const systemTheme = useColorScheme();
  const activeTheme = theme || systemTheme;
  const themeColors = activeTheme === 'dark' ? darkTheme : lightTheme;

  const [color, setColor] = useState(currentColor);

  useEffect(() => {
    setColor(currentColor);
  }, [currentColor]);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: themeColors.modalOverlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pickerContainer: {
      backgroundColor: themeColors.modalBackground,
      padding: 20,
      borderRadius: 16,
      width: '90%',
      maxWidth: 400,
      borderWidth: 1,
      borderColor: themeColors.borderColor,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: themeColors.text,
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
      borderColor: themeColors.borderColor,
    },
    closeButton: {
      backgroundColor: themeColors.primary,
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    closeButtonText: {
      color: themeColors.buttonText,
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <Text style={styles.modalTitle}>Escolha uma cor</Text>

          <View style={[styles.colorPreview, {backgroundColor: color}]} />

          <WheelColorPicker
            initialColor={currentColor}
            onColorChange={setColor}
            thumbSize={30}
            sliderSize={30}
            style={styles.colorPicker}
          />

          <TouchableOpacity
            onPress={() => {
              onColorChange(color);
              onClose();
            }}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Aplicar Cor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
