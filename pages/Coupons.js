import { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { fetchCoupons, redeemCoupon, fetchUserPoints } from '../utils/api';
import Header from '../components/Header';
import ToggleButton from '../components/ToggleButton';
import Button from '../components/Button';
import Loader from '../components/Loader';
import BottomSheetModal from '../components/BottomSheetModal';
import Coupon from '../components/Coupon';
import { UserContext } from '../context/UserContext';

const windowWidth = Dimensions.get('window').width;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showUnlocked, setShowUnlocked] = useState('blocked');
  const [isLoading, setIsLoading] = useState(false);
  const { points, setPoints } = useContext(UserContext);

  useEffect(() => {
    loadUserPoints();
    loadCoupons();
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [points]);

  const loadUserPoints = async () => {
    setIsLoading(true);
    try {
      const response = await fetchUserPoints();
      setPoints(response.data.pontuacao);
    } catch (error) {
      showErrorMessage('Falha ao carregar pontos do usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCoupons();
      setCoupons(response.data);
    } catch (error) {
      showErrorMessage('Falha ao carregar cupons.');
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

  const handleCouponPress = (coupon) => {
    setSelectedCoupon(coupon);
    setModalVisible(true);
  };

  const handleRedeemCoupon = async (coupon) => {
    setIsLoading(true);
    try {
      const response = await redeemCoupon(coupon);
      showSuccessMessage('Cupom resgatado com sucesso!');
      setPoints(response.data.pontuacao);
      setModalVisible(false);
    } catch (error) {
      showErrorMessage('Falha ao resgatar cupom.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCoupons = () => {
    const filteredCoupons = coupons.filter((coupon) =>
      showUnlocked === 'unblocked' ? coupon.desbloqueado : !coupon.desbloqueado
    );

    if (filteredCoupons.length === 0) {
      return <Text style={styles.noDataText}>Não há cupons disponíveis.</Text>;
    }

    return filteredCoupons.map((coupon, index) => (
      <Coupon
        key={index}
        brand={coupon.empresa.nome}
        discount={coupon.descricao}
        points={coupon.pontuacao}
        disponivel={coupon.disponivel}
        desbloqueado={coupon.desbloqueado}
        onPress={() => handleCouponPress(coupon)}
      />
    ));
  };

  const renderModalContent = () => (
    <View style={styles.bottomSheetContainer}>
      {selectedCoupon && (
        <View style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeaderTexts}>
            <Text style={styles.bottomSheetHeaderBrand}>
              {selectedCoupon.empresa.nome}
            </Text>
            <Text style={styles.bottomSheetHeaderDesccription}>
              {selectedCoupon.descricao}
            </Text>
            <Text style={styles.bottomSheetHeaderExpiration}>
              Validade: {selectedCoupon.validade}
            </Text>
          </View>
          <Text style={styles.bottomSheetPrincipalText}>
            {selectedCoupon.desbloqueado
              ? selectedCoupon.codigo
              : `${selectedCoupon.pontuacao} pts.`}
          </Text>
          <View style={styles.termsAndConditions}>
            <Text style={styles.termsAndConditionsTitle}>
              Termos e Condições do Cupom
            </Text>
            <View style={styles.termsAndConditionsList}>
              <FlatList
                data={[
                  {
                    key: 'Validade',
                    description: 'Verifique a data de expiração no cupom.',
                  },
                  {
                    key: 'Uso',
                    description: 'Cupom válido para uma única utilização.',
                  },
                  {
                    key: 'Lojas Participantes',
                    description: 'Consulte a lista de lojas parceiras.',
                  },
                  {
                    key: 'Restrições',
                    description: 'Não cumulativo com outras promoções.',
                  },
                  {
                    key: 'Trocas e Devoluções',
                    description:
                      'Sujeito às políticas das lojas participantes.',
                  },
                  {
                    key: 'Pontos',
                    description:
                      'Pontos não serão reembolsados em caso de não utilização do cupom.',
                  },
                ]}
                renderItem={({ item }) => {
                  return (
                    <Text style={styles.termsAndConditionsListItem}>
                      {`\u2022`}{' '}
                      <Text style={styles.termsAndConditionsListItemBold}>
                        {item.key}:{' '}
                      </Text>
                      {item.description}
                    </Text>
                  );
                }}
              />
            </View>
          </View>
          {!selectedCoupon.desbloqueado && (
            <Button
              title="Aceitar e Resgatar"
              onPress={() => handleRedeemCoupon(selectedCoupon)}
            />
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Loader isLoading={isLoading} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header title={points} subtitle="pontos" bigger />
        <View style={styles.container}>
          <View style={styles.textsHeader}>
            <Text style={styles.title}>
              Resgate ou acesse seus cupons aqui utilizando seus pontos
            </Text>
            <Text style={styles.subTitle}>
              Utilize seus pontos acumulados para desbloquear cupons de desconto
              exclusivos e aproveite vantagens em nossas lojas parceiras.
            </Text>
          </View>
          <ToggleButton
            selected={showUnlocked}
            onToggle={(value) => setShowUnlocked(value)}
          />
          <View style={styles.containerCoupons}>{renderCoupons()}</View>
        </View>
      </ScrollView>
      <BottomSheetModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}>
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
    paddingBottom: 24,
    width: '100%',
    flex: 1,
  },
  textsHeader: {
    gap: 8,
  },
  title: {
    color: '#195D8D',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  subTitle: {
    color: '#195D8D',
    fontSize: 14,
    fontWeight: '200',
    textAlign: 'center',
  },
  containerCoupons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetContent: {
    gap: 30,
    paddingVertical: 30,
    alignItems: 'center',
  },
  bottomSheetHeaderTexts: {
    gap: 8,
    textAlign: 'center',
    alignItems: 'center',
  },
  bottomSheetHeaderBrand: {
    fontSize: 24,
    color: '#7FB3D5',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSheetHeaderDesccription: {
    fontSize: 28,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomSheetHeaderExpiration: {
    color: '#000000',
    fontWeight: '600',
  },
  bottomSheetPrincipalText: {
    fontSize: 40,
    color: '#258BD4',
    fontWeight: '600',
  },
  termsAndConditions: {
    width: '100%',
    gap: 8,
  },
  termsAndConditionsTitle: {
    fontSize: 20,
    color: '#195D8D',
    fontWeight: '500',
  },
  termsAndConditionsList: {
    gap: 4,
  },
  termsAndConditionsListItem: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
  termsAndConditionsListItemBold: {
    fontWeight: '700',
  },
  noDataText: {
    color: '#707070',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default Coupons;
