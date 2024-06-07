import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { UserContext } from '../context/UserContext';
import Form from '../components/Form';
import Header from '../components/Header';
import Button from '../components/Button';
import Loader from '../components/Loader';
import {
  fetchUserPoints,
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
} from '../utils/api';

const windowWidth = Dimensions.get('window').width;

const updateUserDataFields = [
  { key: 'nome', label: 'Nome Completo', placeholder: 'Gustavo Ferreira' },
];

const updateSenhaFields = [
  {
    key: 'senhaAtual',
    label: 'Senha atual',
    placeholder: '**********',
    secureTextEntry: true,
  },
  {
    key: 'senha',
    label: 'Nova Senha',
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

const MyProfile = ({ route }) => {
  const { logOffUser } = route.params;
  const { points, setPoints } = useContext(UserContext);
  const [dataUser, setDataUser] = useState({
    nome: '',
    email: '',
    senhaAtual: '',
    senha: '',
    confirmarSenha: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserFromDatabase();
  }, []);

  const getUserFromDatabase = async () => {
    setIsLoading(true);
    try {
      const response = await fetchUserPoints();
      setDataUser({
        nome: response.data.nome,
        email: response.data.email,
      });
      setPoints(response.data.pontuacao);
    } catch (error) {
      showErrorMessage('Falha ao carregar dados do usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInDatabase = async () => {
    if (!dataUser.nome) {
      showErrorMessage('Por favor, insira um nomr válido.');
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile({ nome: dataUser.nome });
      showSuccessMessage('Seus dados foram atualizados com sucesso!');
    } catch (error) {
      showErrorMessage('Não foi possível atualizar seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (!validatePasswordChange(dataUser)) return;

    setIsLoading(true);
    try {
      await updateUserPassword({ senhaAntiga: dataUser.senhaAtual, senha: dataUser.senha });
      showSuccessMessage('Senha atualizada com sucesso!');
      resetPasswordFields();
    } catch (error) {
      showErrorMessage(error.response?.data?.message || 'Erro ao atualizar senha.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = () => {
    showMessage({
      message: 'Deletar Conta',
      description:
        'Tem certeza de que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.',
      type: 'warning',
      icon: 'warning',
      autoHide: false,
      onPress: confirmDeleteAccount,
    });
  };

  const confirmDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteUserAccount();
      showSuccessMessage('Conta deletada com sucesso.');
      logOffUser();
    } catch (error) {
      showErrorMessage('Erro ao deletar conta. Tente novamente mais tarde.');
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

  const validatePasswordChange = ({ senhaAtual, senha, confirmarSenha }) => {
    if (!senhaAtual || !senha || !confirmarSenha) {
      showErrorMessage('Todos os campos são obrigatórios.');
      return false;
    }
    if (senha === senhaAtual) {
      showErrorMessage('A nova senha deve ser diferente da atual.');
      return false;
    }
    if (senhaAtual.length < 6 || senha.length < 6) {
      showErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (senha !== confirmarSenha) {
      showErrorMessage('As senhas não são idênticas.');
      return false;
    }
    return true;
  };

  const resetPasswordFields = () => {
    setDataUser((prevState) => ({
      ...prevState,
      senhaAtual: '',
      senha: '',
      confirmarSenha: '',
    }));
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Loader isLoading={isLoading} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header title={points.toString()} subtitle="pontos" bigger />
        <View style={styles.bodyScreen}>
          <UpdateUserData
            dataUser={dataUser}
            setDataUser={setDataUser}
            updateUserInDatabase={updateUserInDatabase}
          />
          <UpdateSenha
            dataUser={dataUser}
            setDataUser={setDataUser}
            changePassword={changePassword}
          />
          <View style={styles.dangerButtons}>
            <Button title="Sair" type="secondary" onPress={logOffUser} />
            <TouchableOpacity onPress={deleteAccount}>
              <Text style={styles.linkText}>Deletar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const UpdateUserData = ({ dataUser, setDataUser, updateUserInDatabase }) => (
  <Form
    fields={updateUserDataFields}
    values={dataUser}
    typeInput="secondary"
    setData={(key, value) => {
      setDataUser((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }}
    extraComponent={
      <Button title="Atualizar Dados" onPress={updateUserInDatabase} />
    }
  />
);

const UpdateSenha = ({ dataUser, setDataUser, changePassword }) => (
  <Form
    fields={updateSenhaFields}
    values={dataUser}
    typeInput="secondary"
    setData={(key, value) => {
      setDataUser((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }}
    extraComponent={<Button title="Atualizar Senha" onPress={changePassword} />}
  />
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
  },
  bodyScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    textAlign: 'center',
    gap: 30,
    width: windowWidth,
    flex: 1,
  },
  dangerButtons: {
    width: '100%',
    gap: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  linkText: {
    textAlign: 'center',
    color: '#C50202',
    fontWeight: 'bold',
  },
});

export default MyProfile;
