import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ onPress, type = 'default', title }) => {
  const buttonStyle =
    type === 'secondary'
      ? [styles.button, styles.buttonSecondary]
      : styles.button;
  const buttonTextStyle =
    type === 'secondary'
      ? [styles.buttonText, styles.buttonTextSecondary]
      : styles.buttonText;

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#195D8D',
  },
  buttonSecondary: {
    backgroundColor: '#7FB3D5',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
});

export default Button;
