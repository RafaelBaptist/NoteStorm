import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

export default function Header({styles, logo, onMenuPress}) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      <Text style={styles.header}>NoteStorm</Text>
    </View>
  );
}
