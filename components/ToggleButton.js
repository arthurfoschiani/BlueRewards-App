import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ToggleButton = ({ selected, onToggle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selected === 'blocked'
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}
          onPress={() => onToggle('blocked')}>
          <Text
            style={
              selected === 'blocked'
                ? styles.selectedText
                : styles.unselectedText
            }>
            Bloqueados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selected === 'unblocked'
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}
          onPress={() => onToggle('unblocked')}>
          <Text
            style={
              selected === 'unblocked'
                ? styles.selectedText
                : styles.unselectedText
            }>
            Desbloqueados
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#195D8D',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#195D8D',
  },
  unselectedButton: {
    backgroundColor: '#FFFFFF',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 500,
  },
  unselectedText: {
    color: '#195D8D',
    fontWeight: 500,
  },
});

export default ToggleButton;
