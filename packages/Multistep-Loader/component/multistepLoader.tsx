import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg,{Path } from 'react-native-svg';

// Icons using react-native-svg
const CheckIcon = ({ color }: { color?: string }) => {
  return (
    <Svg  fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={color || "black"} width={24} height={24}>
      <Path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Svg>
  );
};

const CheckFilled = ({ color }: { color?: string }) => {
  return (
    <Svg  viewBox="0 0 24 24" fill={color || "black"} width={24} height={24}>
      <Path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </Svg>
  );
};

// Type for loading states
type LoadingState = {
  text: string;
};

// Core Loader
const LoaderCore = ({ loadingStates, value = 0 }: { loadingStates: LoadingState[]; value?: number }) => {
  return (
    <View style={styles.container}>
      {loadingStates.map((loadingState, index) => {
        const opacity = Math.max(1 - Math.abs(index - value) * 0.2, 0); // Adjust opacity based on distance

        const animatedStyle = useAnimatedStyle(() => ({
          opacity: withTiming(opacity, { duration: 500 }),
          transform: [{ translateY: withTiming(-value * 40, { duration: 500 }) }],
        }));

        return (
          <Animated.View key={index} style={[styles.stepContainer, animatedStyle]}>
            {index > value ? (
              <CheckIcon color="black" />
            ) : (
              <CheckFilled color={value === index ? "limegreen" : "black"} />
            )}
            <Text style={[styles.stepText, { color: value === index ? "limegreen" : "black" }]}>
              {loadingState.text}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

// Main MultiStepLoader
export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <LoaderCore value={currentState} loadingStates={loadingStates} />
    </View>
  );
};
export default MultiStepLoader
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 40,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepText: {
    fontSize: 16,
    marginLeft: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // semi-transparent background
  },
});

