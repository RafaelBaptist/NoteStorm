import {StyleSheet} from 'react-native';

export const getStyles = (themeColors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      padding: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    logo: {
      width: 60,
      height: 60,
      marginRight: 5,
      resizeMode: 'contain',
    },
    search: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 16,
      color: themeColors.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      backgroundColor: isDark ? '#222' : '#fff',
      padding: 20,
      borderRadius: 10,
      elevation: 10,
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
      color: themeColors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 12,
      color: themeColors.text,
    },
    modalBtn: {
      backgroundColor: '#db125f',
      padding: 12,
      borderRadius: 8,
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#db125f',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    addText: {
      fontSize: 30,
      color: 'white',
    },
    modalBtnEdit: {
      backgroundColor: 'rgba(219, 18, 95, 0.6)',
      padding: 8,
      borderRadius: 4,
      marginTop: 6,
    },
    modalBtnText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
    themeToggle: {
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    menuItem: {
      color: themeColors.text,
    },
  });
