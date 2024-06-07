import { useRef } from 'react';
import {
  Animated,
  PanResponder,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;

const BottomSheetModal = ({ isVisible, onClose, children }) => {
  const bottomSheetHeight = windowHeight * 0.5;
  const bottomSheetTranslateY = useRef(
    new Animated.Value(bottomSheetHeight)
  ).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderMove: (evt, gestureState) => {
        bottomSheetTranslateY.setValue(bottomSheetHeight - gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > bottomSheetHeight / 3) {
          closeBottomSheet();
        } else {
          Animated.timing(bottomSheetTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openBottomSheet = () => {
    Animated.timing(bottomSheetTranslateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(backdropOpacity, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(bottomSheetTranslateY, {
      toValue: bottomSheetHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
    Animated.timing(backdropOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  if (isVisible) {
    openBottomSheet();
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="none">
      <TouchableWithoutFeedback onPress={closeBottomSheet}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: bottomSheetTranslateY }],
          },
        ]}
        {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    padding: 20,
  },
});

export default BottomSheetModal;
