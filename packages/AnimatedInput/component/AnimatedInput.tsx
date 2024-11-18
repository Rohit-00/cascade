import React, { useRef } from 'react';
import { StyleSheet, TextInput, View, Animated, TextInputProps, Appearance } from 'react-native';

const animationConfig = {
  duration: 200,
  useNativeDriver: true,
};

const theme = {
  light: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F2',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E0E0E0',
    error: '#FF3B30',
    inputBackground: '#F2F2F2',
  },
  dark: {
    primary: '#0A84FF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    border: '#38383A',
    error: '#FF453A',
    inputBackground: '#1C1C1E',
  },
};

const isDarkMode = Appearance.getColorScheme() === 'dark';
const colors = theme[isDarkMode ? 'dark' : 'light'];

interface AnimatedInputProps extends TextInputProps {
  label?: string;
  labelStyle?: object;
  containerStyle?: object;
  inputStyle?: object;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label = 'Email',
  labelStyle,
  containerStyle,
  inputStyle,
  value,
  onChangeText,
  ...props
}) => {
  const emailLabelPositionY = useRef(new Animated.Value(0)).current;
  const emailLabelPositionX = useRef(new Animated.Value(0)).current;
  const emailLabelScale = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.parallel([
      Animated.timing(emailLabelPositionY, {
        toValue: -35,
        ...animationConfig,
      }),
      Animated.timing(emailLabelPositionX, {
        toValue: -10,
        ...animationConfig,
      }),
      Animated.timing(emailLabelScale, {
        toValue: 0.8,
        ...animationConfig,
      }),
    ]).start();
  };

  const handleBlur = () => {
    if (value === '') {
      Animated.parallel([
        Animated.timing(emailLabelPositionY, {
          toValue: 0,
          ...animationConfig,
        }),
        Animated.timing(emailLabelPositionX, {
          toValue: 0,
          ...animationConfig,
        }),
        Animated.timing(emailLabelScale, {
          toValue: 1,
          ...animationConfig,
        }),
      ]).start();
    }
  };

  return (
    <View style={[styles.inputView, { backgroundColor: colors.inputBackground, borderColor: colors.border }, containerStyle]}>
      <Animated.Text
        style={[
          styles.label,
          {
            transform: [
              { translateY: emailLabelPositionY },
              { translateX: emailLabelPositionX },
              { scale: emailLabelScale },
            ],
            color: colors.textSecondary,
          },
          labelStyle,
        ]}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.input, { color: colors.text }, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </View>
  );
};

export default AnimatedInput;

const styles = StyleSheet.create({
  inputView: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  label: {
    position: 'absolute',
    left: 10,
    top: 13,
    fontSize: 16,
  },
});
