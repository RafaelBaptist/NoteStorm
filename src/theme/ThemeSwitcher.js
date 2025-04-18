import React from 'react';
import {View, Switch, Text, StyleSheet} from 'react-native';

export default function ThemeSwitcher({theme, onToggle}) {
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isDark ? 'Dark' : 'Light'} Mode</Text>
      <Switch
        value={isDark}
        onValueChange={onToggle}
        thumbColor={isDark ? '#fff' : '#000'}
        trackColor={{false: '#767577', true: '#81b0ff'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center',
  },
  label: {
    marginRight: 10,
    fontSize: 16,
    color: '#888',
  },
});
