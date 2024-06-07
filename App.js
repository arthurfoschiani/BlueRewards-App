import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';
import CollectionPoints from './pages/CollectionPoints';
import Coupons from './pages/Coupons';
import FlashMessage from 'react-native-flash-message';
import { UserProvider } from './context/UserContext';

const Tab = createBottomTabNavigator();

const App = () => {
  const [logado, setLogado] = useState(null);
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setLogado(true)
      }
    };
    checkToken();
  }, []);

  const logOffUser = async () => {
    await AsyncStorage.removeItem('userToken');
    setLogado(false);
  };

  return (
    <UserProvider>
      <NavigationContainer>
        {logado ? (
          <Tab.Navigator>
            <Tab.Screen name="Pontos de Coleta" component={CollectionPoints} />
            <Tab.Screen name="Cupons" component={Coupons} />
            <Tab.Screen name="Perfil" component={MyProfile} initialParams={{ logOffUser }}/>
          </Tab.Navigator>
        ) : newUser ? (
          <SignUp setNewUser={setNewUser} />
        ) : (
          <Login setLogado={setLogado} setNewUser={setNewUser} />
        )}
        <FlashMessage position="top" />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
