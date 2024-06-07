import { View, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const Header = ({ title, subtitle, bigger = false, alturaFixa = false }) => {
  const titleStyle = bigger ? [styles.title, styles.titleBigger] : styles.title;
  const subTitleStyle = bigger
    ? [styles.subtitle, styles.subTitleBigger]
    : styles.subtitle;
  const textsHeaderStyle = bigger
    ? [styles.textsHeader, styles.textsHeaderBigger]
    : styles.textsHeader;

  return (
    <View style={[styles.backgroundTheme, alturaFixa ? { flex: 0.7 } : {}]}>
      <View style={textsHeaderStyle}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={subTitleStyle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundTheme: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
    textAlign: 'center',
    width: windowWidth
  },
  textsHeader: {
    textAlign: 'center',
    gap: 12,
  },
  title: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1D70A2',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#195D8D',
  },
  textsHeaderBigger: {
    gap: 1,
  },
  titleBigger: {
    fontSize: 60,
  },
  subTitleBigger: {
    fontSize: 20,
  },
});

export default Header;
