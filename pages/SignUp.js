import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Form from '../components/Form';
import Header from '../components/Header';
import Button from '../components/Button';
import Loader from '../components/Loader';
import commonStyles from '../styles/commonStyles';
import { createUser } from '../utils/api';

const signUpFields = [
  { key: 'nome', label: 'Nome Completo', placeholder: 'Arthur Foschiani' },
  { key: 'email', label: 'Email', placeholder: 'arthur@email.com' },
  {
    key: 'senha',
    label: 'Senha',
    placeholder: '**********',
    secureTextEntry: true,
  },
  {
    key: 'confirmarSenha',
    label: 'Confirmar Senha',
    placeholder: '**********',
    secureTextEntry: true,
  },
];

const SignUp = ({ setNewUser }) => {
  const [dataUser, setDataUser] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSetData = (key, value) => {
    setDataUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validateFields = () => {
    const { nome, email, senha, confirmarSenha } = dataUser;

    if (!nome || !email || !senha || !confirmarSenha) {
      showErrorMessage('Todos os campos são obrigatórios.');
      return false;
    }

    if (senha.length < 6) {
      showErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (senha !== confirmarSenha) {
      showErrorMessage('As senhas não são idênticas.');
      return false;
    }

    if (!/^[a-zA-Z0-9._+]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/.test(email)) {
      showErrorMessage('Por favor, insira um email válido.');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      const { nome, email, senha } = dataUser;
      const response = await createUser({ nome, email, senha });

      if (response.status === 201) {
        showSuccessMessage('Cadastro realizado com sucesso!');
        setNewUser(false);
      } else {
        showErrorMessage('Erro inesperado ao cadastrar.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao cadastrar.';
      showErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorMessage = (message) => {
    showMessage({
      message: 'Erro',
      description: message,
      type: 'danger',
    });
  };

  const showSuccessMessage = (message) => {
    showMessage({
      message: 'Sucesso',
      description: message,
      type: 'success',
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Loader isLoading={isLoading} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header title="BlueRewards" subtitle="Crie sua conta conosco." />
        <View style={commonStyles.modalScreen}>
          <Form fields={signUpFields} values={dataUser} setData={handleSetData} />
          <Button title="Cadastrar" onPress={handleSignUp} />
          <TouchableOpacity onPress={() => setNewUser(false)}>
            <Text style={commonStyles.footerText}>
              Já possui uma conta? <Text style={commonStyles.textBold}>Entre aqui</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F2F2F2',
  },
});

export default SignUp;
