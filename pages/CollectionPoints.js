import { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { fetchCollectionPoints, registerCollection } from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import InputField from '../components/InputField';
import BottomSheetModal from '../components/BottomSheetModal';
import Loader from '../components/Loader';
import { UserContext } from '../context/UserContext';

const windowWidth = Dimensions.get('window').width;

const CollectionPoints = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [plasticAmount, setPlasticAmount] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setPoints } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    loadCollectionPoints();
  }, []);

  const loadCollectionPoints = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCollectionPoints();
      setCollectionPoints(response.data);
    } catch (error) {
      showErrorMessage('Falha ao carregar pontos de coleta.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterCollection = async () => {
    if (!plasticAmount) {
      showErrorMessage('A quantidade de plástico não pode estar vazia.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerCollection(plasticAmount, selectedPoint);
      showSuccessMessage('Coleta registrada com sucesso!');
      setPoints(response.data.usuarioResponse.pontuacao);
      navigation.navigate('Cupons');
      resetModal();
    } catch (error) {
      showErrorMessage('Erro ao registrar coleta.');
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

  const handlePlasticAmountChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPlasticAmount(numericText);
  };

  const resetModal = () => {
    setModalVisible(false);
    setPlasticAmount('');
  };

  const openModal = (point) => {
    setSelectedPoint(point);
    setModalVisible(true);
  };

  const renderCollectionPoints = () => {
    if (collectionPoints.length === 0) {
      return <Text style={styles.noDataText}>Não há pontos de coleta cadastrados.</Text>;
    }

    return collectionPoints.map((point) => (
      <View key={point.id} style={styles.collectionPointBox}>
        <View style={styles.collectionPointInfo}>
          <Text style={styles.pointName}>{point.nome}</Text>
          <Text style={styles.pointAddress}>{point.endereco}</Text>
        </View>
        <TouchableOpacity onPress={() => openModal(point)}>
          <Image source={require('../assets/Add.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
    ));
  };

  const renderModalContent = () => (
    <View style={styles.bottomSheetContainer}>
      <View style={styles.bottomSheetContent}>
        <View style={styles.bottomSheetBody}>
          <View style={styles.bottomSheetDescription}>
            <Text style={styles.bottomSheetTitle}>Registrar Coleta</Text>
            <Text style={styles.bottomSheetSubtitle}>
              Insira os dados da sua coleta para calcularmos sua pontuação
            </Text>
          </View>
          <InputField
            label="Quantidade de plástico em gramas (g)"
            placeholder="500"
            value={plasticAmount}
            onChangeText={handlePlasticAmountChange}
            keyboardType="numeric"
          />
        </View>
        <Button
          title="Registrar e calcular"
          onPress={handleRegisterCollection}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Loader isLoading={isLoading} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.textsHeader}>
            <Text style={styles.title}>
              Registre aqui suas coletas nos pontos de entrega
            </Text>
            <Text style={styles.subTitle}>
              Acumule pontos registrando suas coletas e aproveite benefícios em
              nossas lojas parceiras.
            </Text>
          </View>

          <View style={styles.bodyScreen}>
            {renderCollectionPoints()}
          </View>
        </View>
      </ScrollView>
      <BottomSheetModal
        isVisible={isModalVisible}
        onClose={resetModal}>
        {renderModalContent()}
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    width: windowWidth,
  },
  safeAreaView: {
    flex: 1,
    width: windowWidth,
    backgroundColor: '#FFF',
  },
  container: {
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: '100%',
  },
  textsHeader: {
    gap: 8,
  },
  title: {
    color: '#195D8D',
    fontSize: 20,
    fontWeight: 500,
  },
  subTitle: {
    color: '#195D8D',
    fontSize: 14,
    fontWeight: 200,
  },
  collectionPointBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  collectionPointInfo: {
    gap: 8,
  },
  pointName: {
    color: '#195D8D',
    fontSize: 16,
    fontWeight: 500,
  },
  pointAddress: {
    color: '#000',
    fontSize: 14,
    fontWeight: 200,
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetContent: {
    gap: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  bottomSheetBody: {
    width: '100%',
    gap: 20,
  },
  bottomSheetDescription: {
    gap: 8,
  },
  bottomSheetTitle: {
    color: '#195D8D',
    fontWeight: 500,
    fontSize: 26,
  },
  bottomSheetSubtitle: {
    color: '#707070',
    fontWeight: 400,
    fontSize: 16,
  },
  noDataText: {
    color: '#707070',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CollectionPoints;
