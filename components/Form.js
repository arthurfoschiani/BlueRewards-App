import { View, StyleSheet } from 'react-native';
import InputField from './InputField';

const Form = ({
  fields,
  values,
  setData,
  typeInput = 'default',
  extraComponent,
}) => {
  return (
    <View style={styles.form}>
      {fields.map((field) => (
        <InputField
          key={field.key}
          label={field.label}
          placeholder={field.placeholder}
          type={typeInput}
          value={values ? values[field.key] : ''}
          onChangeText={(text) => setData(field.key, text)}
          secureTextEntry={field.secureTextEntry}
          autoCapitalize={field.autoCapitalize}
          autoCorrect={field.autoCorrect}
        />
      ))}
      {extraComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 15,
  },
});

export default Form;
