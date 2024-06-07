import { View, Text, StyleSheet, TextInput } from 'react-native';

const InputField = ({ label, placeholder, type = 'default', ...props }) => {
  const inputStyle =
    type === 'secondary' ? [styles.input, styles.inputSecondary] : styles.input;

  return (
    <View style={styles.inputSpace}>
      <Text style={styles.labelInput}>{label}</Text>
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor="#707070"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputSpace: {
    gap: 4,
    width: '100%',
  },
  labelInput: {
    fontSize: 16,
    textAlign: 'start',
    color: '#1D70A2',
    marginBottom: 10,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#707070',
  },
  inputSecondary: {
    backgroundColor: '#F2F2F2',
  },
});

export default InputField;
