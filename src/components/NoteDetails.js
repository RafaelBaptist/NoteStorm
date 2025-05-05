import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NotesContext} from './NotesContext';
import {ThemeContext} from '../context/ThemeContext';
import ColorPickerModal from './ColorPickerModal';
import NoteImage from './NoteImage';

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
    image: note.image || null,
    imagePosition: note.imagePosition || 'top',
    imageSize: note.imageSize || 'medium',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const styles = getStyles(themeColors, currentNote);

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

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Erro', 'Não foi possível selecionar a imagem');
        return;
      }

      const imageUri = response.assets[0].uri;
      setCurrentNote({...currentNote, image: imageUri});
      setShowEditModal(false);
    });
  };

  const handleImagePositionChange = position => {
    setCurrentNote({...currentNote, imagePosition: position});
  };

  const handleImageSizeChange = size => {
    setCurrentNote({...currentNote, imageSize: size});
  };

  const renderContentWithImage = () => {
    const content = (
      <>
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
      </>
    );

    switch (currentNote.imagePosition) {
      case 'top':
        return (
          <>
            <NoteImage
              imageUri={currentNote.image}
              position={currentNote.imagePosition}
              size={currentNote.imageSize}
            />
            {content}
          </>
        );
      case 'bottom':
        return (
          <>
            {content}
            <NoteImage
              imageUri={currentNote.image}
              position={currentNote.imagePosition}
              size={currentNote.imageSize}
            />
          </>
        );
      case 'left':
        return (
          <View style={styles.rowContainer}>
            <NoteImage
              imageUri={currentNote.image}
              position={currentNote.imagePosition}
              size={currentNote.imageSize}
            />
            <View style={styles.textContainer}>{content}</View>
          </View>
        );
      case 'right':
        return (
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>{content}</View>
            <NoteImage
              imageUri={currentNote.image}
              position={currentNote.imagePosition}
              size={currentNote.imageSize}
            />
          </View>
        );
      default:
        return content;
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
        {renderContentWithImage()}
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
              style={styles.optionButton}
              onPress={handleImagePick}>
              <Text style={styles.optionText}>
                {currentNote.image ? 'Alterar imagem' : 'Adicionar imagem'}
              </Text>
            </TouchableOpacity>

            {currentNote.image && (
              <>
                <Text style={styles.sectionTitle}>Posição da Imagem</Text>
                <View style={styles.positionOptions}>
                  {['top', 'bottom', 'left', 'right'].map(position => (
                    <TouchableOpacity
                      key={position}
                      style={[
                        styles.positionButton,
                        currentNote.imagePosition === position &&
                          styles.selectedPosition,
                      ]}
                      onPress={() => handleImagePositionChange(position)}>
                      <Text style={styles.positionButtonText}>
                        {position === 'top' && 'Topo'}
                        {position === 'bottom' && 'Rodapé'}
                        {position === 'left' && 'Esquerda'}
                        {position === 'right' && 'Direita'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>Tamanho da Imagem</Text>
                <View style={styles.sizeOptions}>
                  {['small', 'medium', 'large'].map(size => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        currentNote.imageSize === size && styles.selectedSize,
                      ]}
                      onPress={() => handleImageSizeChange(size)}>
                      <Text style={styles.sizeButtonText}>
                        {size === 'small' && 'Pequeno'}
                        {size === 'medium' && 'Médio'}
                        {size === 'large' && 'Grande'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowEditModal(false)}>
              <Text style={[styles.optionText, {color: themeColors.danger}]}>
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

const getStyles = (themeColors, note) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 16,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal:
        note?.imagePosition === 'left' || note?.imagePosition === 'right'
          ? 0
          : 20,
    },
    rowContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    textContainer: {
      flex: 1,
      padding: 15,
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
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: themeColors.text,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      color: themeColors.text,
      alignSelf: 'flex-start',
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
    positionOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    positionButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: themeColors.card,
      margin: 2,
      width: '48%',
    },
    selectedPosition: {
      backgroundColor: themeColors.primary,
    },
    positionButtonText: {
      color: themeColors.text,
      textAlign: 'center',
    },
    sizeOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 10,
    },
    sizeButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: themeColors.card,
      margin: 2,
      width: '32%',
    },
    selectedSize: {
      backgroundColor: themeColors.primary,
    },
    sizeButtonText: {
      color: themeColors.text,
      textAlign: 'center',
    },
    cancelButton: {
      marginTop: 8,
    },
  });
