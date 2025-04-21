import React from 'react';
import {TouchableOpacity, Text, Image, View, StyleSheet} from 'react-native';
import NoteDetails from './NoteDetails';
import {NotesProvider} from './NotesContext';
export default function NoteCard({note, onLongPress, themeColors, onPress}) {
  return (
    <TouchableOpacity
      style={[styles.noteCard, {backgroundColor: themeColors.card}]}
      onLongPress={onLongPress}
      onPress={onPress}>
      {note.icon ? (
        <Image source={note.icon} style={styles.icon} />
      ) : (
        <View style={styles.iconPlaceholder}>
          <Text style={{fontSize: 18}}>📝</Text>
        </View>
      )}
      <Text style={[styles.title, {color: themeColors.text}]}>
        {note.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
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
  },
});
