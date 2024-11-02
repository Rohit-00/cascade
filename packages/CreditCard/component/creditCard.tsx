import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const { width: deviceWidth } = Dimensions.get('window');

type creditCardProps = {
  bankName?: string,
  cardNumber?: string,
  cardHolderName?: string,
  expiryDate?: string,
  cvv?: number
}

const CreditCard: React.FC<creditCardProps> = ({ bankName, cardNumber, cardHolderName, expiryDate, cvv }) => {
  const rotateY = useSharedValue(0);

  const animatedFrontStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${interpolate(rotateY.value, [0, 180], [0, 180])}deg` },
      ],
      backfaceVisibility: 'hidden',
      shadowOpacity: interpolate(rotateY.value, [0, 90, 180], [0.3, 0, 0.3]),
    };
  });

  const animatedBackStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${interpolate(rotateY.value, [0, 180], [180, 360])}deg` },
      ],
      backfaceVisibility: 'hidden',
      shadowOpacity: interpolate(rotateY.value, [0, 90, 180], [0.3, 0, 0.3]),
      position: 'absolute',
      top: 0,
      left: 0,
    };
  });

  const flipCard = () => {
    rotateY.value = withTiming(rotateY.value === 0 ? 180 : 0, { duration: 800 });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard} activeOpacity={1}>
        <Animated.View style={[styles.creditCard, animatedFrontStyle]}>
          <Text style={styles.bankName}>{bankName ? bankName : "BANKNAME"}</Text>
          <Text style={styles.cardNumber}>{cardNumber ? cardNumber : "1234 5678 9123 4567"}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardHolder}>{cardHolderName ? cardHolderName : "CARDHOLDER NAME"}</Text>
            <Text style={styles.expiryDate}>{expiryDate ? expiryDate : '12/24'}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.creditCard, animatedBackStyle]}>
          <View style={styles.magneticStrip}></View>
          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>CVV</Text>
            <Text style={styles.cvvNumber}>{cvv ? cvv : '123'}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default CreditCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: deviceWidth - 40,
  },
  creditCard: {
    width: deviceWidth - 40,
    height: 200,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bankName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 10,
    letterSpacing: 2,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolder: {
    fontSize: 12,
    color: '#fff',
  },
  expiryDate: {
    fontSize: 12,
    color: '#fff',
  },
  magneticStrip: {
    marginTop: 20,
    height: 40,
    backgroundColor: '#000',
    width: '100%',
    borderRadius: 4,
  },
  cvvContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  cvvLabel: {
    fontSize: 12,
    color: '#fff',
    marginRight: 5,
  },
  cvvNumber: {
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderRadius: 2,
  },
});
