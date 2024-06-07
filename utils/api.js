import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCollectionPoints = async () => {
  return await api.get('/pontoscoleta');
};

export const registerCollection = async (plasticAmount, selectedPoint) => {
  return await api.post('/coletas', {
    peso: plasticAmount / 10,
    pontoColeta: {
      id: selectedPoint.id,
    },
  });
};

export const fetchCoupons = async () => {
  return await api.get('/cupons');
};

export const redeemCoupon = async (coupon) => {
  return await api.post('/usuario/cupons', coupon);
};

export const fetchUserPoints = async () => {
  return await api.get('/usuario');
};

export const updateUserProfile = async (userData) => {
  return await api.put('/usuario', userData);
};

export const updateUserPassword = async (passwordData) => {
  return await api.put('/usuario/password', passwordData);
};

export const deleteUserAccount = async () => {
  return await api.delete('/usuario');
};

export const createUser = async (userData) => {
  return await api.post('/usuario', userData);
};
