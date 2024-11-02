import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface AnimatedSubscribeButtonProps {
  buttonColor: string;
  buttonTextColor?: string;
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
  buttonWidth?:number
}

const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  buttonColor,
  subscribeStatus = false,
  buttonTextColor = '#fff',
  initialText,
  changeText,
  buttonWidth
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  // Shared value for the opacity animation
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Animate styles based on the subscription status
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 300 }),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(translateY.value, { duration: 300 }) }],
    };
  });

  const handlePress = () => {
    // Trigger animation and toggle subscription state
    opacity.value = 0; // Fade out
    translateY.value = -50; // Move text up

    setTimeout(() => {
      setIsSubscribed(!isSubscribed);
      opacity.value = 1; // Fade in
      translateY.value = 0; // Move text back to original position
    }, 300);
  };

  return (
    <Animated.View style={[styles.buttonContainer,{width:buttonWidth||200}]}>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          { backgroundColor: isSubscribed ? '#fff' : buttonColor, borderColor: buttonColor },
        ]}
        activeOpacity={1}
      >
        <Animated.View style={[animatedButtonStyle, animatedTextStyle]}>
          {isSubscribed ? (
            <View style={styles.textContainer}>
              <Text style={[styles.buttonText, { color: buttonColor }]}>{changeText}</Text>
            </View>
          ) : (
            <View style={styles.textContainer}>
              <Text style={[styles.buttonText, { color: buttonTextColor }]}>{initialText}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedSubscribeButton
// Styles for the component
const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
