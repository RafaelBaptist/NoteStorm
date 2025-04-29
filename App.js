import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import NoteDetails from './src/components/NoteDetails';
import {NotesProvider} from './src/components/NotesContext';
import {ThemeProvider} from './src/context/ThemeContext';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NoteDetails" component={NoteDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </NotesProvider>
    </ThemeProvider>
  );
}

export default App;
