import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Form from '../components/Form';
import Header from '../components/Header';
import Button from '../components/Button';
import Loader from '../components/Loader';
import commonStyles from '../styles/commonStyles';
import useAuth from '../hooks/useAuth';

const loginFields = [
  {
    key: 'email',
    label: 'Email',
    placeholder: 'arthur@email.com',
    autoCapitalize: 'none',
    autoCorrect: false,
  },
  {
    key: 'senha',
    label: 'Senha',
    placeholder: '**********',
    secureTextEntry: true,
  },
];

const Login = ({ setLogado, setNewUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, isLoading } = useAuth();

  const validateFields = () => {
    if (!email || !password) {
      showMessage({
        message: 'Erro',
        description: 'Todos os campos são obrigatórios.',
        type: 'danger',
      });
      return false;
    }

    if (password.length < 6) {
      showMessage({
        message: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres.',
        type: 'danger',
      });
      return false;
    }

    if (!/^[a-zA-Z0-9._+]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/.test(email)) {
      showMessage({
        message: 'Erro',
        description: 'Por favor, insira um email válido.',
        type: 'danger',
      });
      return false;
    }

    return true;
  };

  const logUser = async () => {
    if (!validateFields()) return;

    try {
      await loginUser(email, password);
      showMessage({
        message: 'Sucesso',
        description: 'Login realizado com sucesso!',
        type: 'success',
      });
      setLogado(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao efetuar login.';
      showMessage({
        message: 'Erro de Login',
        description: errorMessage,
        type: 'danger',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Loader isLoading={isLoading} />
      <View style={styles.container}>
        <Header
          title="BlueRewards"
          subtitle="Bem-vindo novamente! Acesse sua conta."
          alturaFixa={true}
        />
        <View style={commonStyles.modalScreen}>
          <Form
            fields={loginFields}
            values={{ email, senha: password }}
            setData={(key, value) => {
              if (key === 'email') {
                setEmail(value);
              } else if (key === 'senha') {
                setPassword(value);
              }
            }}
          />
          <Button title="Login" onPress={logUser} />
          <TouchableOpacity onPress={() => setNewUser(true)}>
            <Text style={commonStyles.footerText}>
              Não possui uma conta?{' '}
              <Text style={commonStyles.textBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F2F2F2',
  },
});

export default Login;
