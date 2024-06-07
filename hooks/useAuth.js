import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuth = () => {
  const [isLogged, setIsLogged] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsLogged(true);
      }
    };
    checkToken();
  }, []);

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/login', {
        email,
        senha: password,
      });
      if (response.status === 200) {
        const data = response.data;
        await AsyncStorage.setItem('userToken', data.token);
        setIsLogged(true);
      }
    } catch (error) {
      throw new Error('Erro inesperado ao efetuar login.');
    } finally {
      setIsLoading(false);
    }
  };

  const logOffUser = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLogged(false);
  };

  return { isLogged, isLoading, loginUser, logOffUser };
};

export default useAuth;
