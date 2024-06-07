import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ isLoading }) => (
  isLoading ? (
    <Modal transparent={true} animationType="none">
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#195D8D" />
      </View>
    </Modal>
  ) : null
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default Loader;
