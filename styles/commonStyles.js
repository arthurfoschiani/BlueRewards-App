import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const commonStyles = StyleSheet.create({
  modalScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingVertical: 50,
    paddingHorizontal: 20,
    textAlign: 'center',
    gap: 40,
    width: windowWidth,
    flex: 1,
  },
  footerText: {
    color: '#1D70A2',
    marginTop: -20,
  },
  textBold: {
    color: '#1D70A2',
    fontWeight: 800,
  },
});


export default commonStyles;