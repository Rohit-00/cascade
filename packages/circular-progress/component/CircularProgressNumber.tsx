import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, ViewStyle, TextStyle, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress?: number;
  progressColor?: string;
  backgroundColor?: string;
  duration?: number;
  textColor?: string;
  textSize?: number;
  style?: ViewStyle;
  showPercentage?: boolean;
}

interface StyleProps {
  container: ViewStyle;
  counterContainer: ViewStyle;
  counterText: TextStyle;
  percentSymbol: TextStyle;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 100,
  strokeWidth = 10,
  progress = 0,
  progressColor = '#2196F3',
  backgroundColor = '#E0E0E0',
  duration = 1000,
  textColor = '#000000',
  textSize = 24,
  style,
  showPercentage = true,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);
  
  useEffect(() => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    
    Animated.timing(progressAnimation, {
      toValue: clampedProgress,
      duration: duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Animate counter separately
    let startTime = Date.now();
    const startValue = displayValue;
    const endValue = clampedProgress;
    
    const animateCounter = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < duration) {
        const progress = elapsed / duration;
        const currentValue = startValue + (endValue - startValue) * progress;
        setDisplayValue(Math.round(currentValue));
        requestAnimationFrame(animateCounter);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    requestAnimationFrame(animateCounter);
  }, [progress, duration]);

  const strokeDashoffset = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>
      
      <View style={[StyleSheet.absoluteFill, styles.counterContainer]}>
        <Text 
          style={[
            styles.counterText,
            { 
              color: textColor,
              fontSize: textSize
            }
          ]}
        >
          {displayValue}
          {showPercentage && (
            <Text style={[styles.percentSymbol, { color: textColor }]}>%</Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create<StyleProps>({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontWeight: 'bold',
  },
  percentSymbol: {
    fontSize: 16,
  },
});

export default CircularProgress;