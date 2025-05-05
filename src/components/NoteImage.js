import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const NoteImage = ({imageUri, position, size}) => {
  if (!imageUri) return null;

  const imageStyles = [
    styles.image,
    size === 'small' && styles.small,
    size === 'medium' && styles.medium,
    size === 'large' && styles.large,
    position === 'left' && styles.leftPosition,
    position === 'right' && styles.rightPosition,
  ];

  return (
    <View style={styles.container}>
      <Image
        source={{uri: imageUri}}
        style={imageStyles}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    margin: 10,
  },
  small: {
    width: 100,
    height: 100,
  },
  medium: {
    width: 200,
    height: 200,
  },
  large: {
    width: 300,
    height: 300,
  },
  leftPosition: {
    marginRight: 15,
  },
  rightPosition: {
    marginLeft: 15,
  },
});

export default NoteImage;
