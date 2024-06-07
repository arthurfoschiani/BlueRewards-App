import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import { showMessage } from 'react-native-flash-message';

const Coupon = ({
  brand,
  discount,
  points,
  disponivel,
  desbloqueado,
  onPress,
}) => (
  <TouchableOpacity
    onPress={
      disponivel || desbloqueado
        ? onPress
        : () =>
            showMessage({
              message: 'Cupom indisponível',
              description: 'Saldo de pontos insuficiente para o resgate',
              type: 'warning',
            })
    }
    style={[
      styles.couponContainer,
      disponivel || desbloqueado ? styles.active : styles.inactive,
    ]}>
    <View
      style={[
        styles.couponTop,
        disponivel || desbloqueado ? styles.active : styles.inactive,
      ]}>
      <Text style={styles.brand}>{brand}</Text>
      <Text style={styles.discount}>{discount}</Text>
    </View>
    <View style={styles.couponBottom}>
      <Text
        style={[
          styles.points,
          disponivel || desbloqueado ? {} : styles.inactiveText,
          desbloqueado ? styles.seeMoreText : {},
        ]}>
        {desbloqueado ? 'Veja mais' : `${points} pts.`}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  couponContainer: {
    width: Dimensions.get('window').width / 2 - 30,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#195D8D',
    overflow: 'hidden',
    marginBottom: 20,
  },
  couponTop: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    gap: 4,
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#195D8D',
  },
  inactive: {
    backgroundColor: '#7FB3D5',
    color: '#7FB3D5',
    borderColor: '#7FB3D5',
  },
  inactiveText: {
    color: '#7FB3D5',
  },
  seeMoreText: {
    fontSize: 16,
  },
  couponBottom: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    alignItems: 'center',
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  discount: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
  },
  points: {
    fontSize: 24,
    fontWeight: '700',
    color: '#195D8D',
  },
});

export default Coupon;
