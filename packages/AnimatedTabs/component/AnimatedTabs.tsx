import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Appearance } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const theme = {
  dark: {
    text: 'white',
    background: '#191e24',
    primary: '#007AFF',
  },
  light: {
    text: 'black',
    background: '#f2f2f2',
    primary: '#007AFF',
  }
};

const TAB_WIDTH = 100;

const isDarkMode = Appearance.getColorScheme() === 'dark';
const colors = theme[isDarkMode ? 'dark' : 'light'];

type TabProps = {
  tabs: string[],
  contents: React.ReactNode[],
};

const TabBar: React.FC<TabProps> = ({ tabs, contents }) => {
  const [activeTab, setActiveTab] = useState(0);
  const activeIndex = useSharedValue(0);

  const onTabPress = (index: number) => {
    setActiveTab(index);
    activeIndex.value = withTiming(index, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: activeIndex.value * TAB_WIDTH }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Animated.View style={[styles.highlight, animatedStyle]} />
        <View style={[styles.tabsContainer, { width: TAB_WIDTH * tabs.length }]}>
          {tabs.map((tab, index) => (
            <TouchableOpacity key={index} onPress={() => onTabPress(index)} style={styles.tab}>
              <Text style={activeTab === index ? styles.activeTabText : styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.content}>
        {contents[activeTab]}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    height: 50,
    flexDirection: 'row',
    backgroundColor: colors.background,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: colors.text,
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  highlight: {
    position: 'absolute',
    width: 90,
    height: '80%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    right: 5,
    left: 5,
  },
  content: {
    marginTop: 20,
  },
  contentText: {
    fontSize: 18,
    color: colors.text,
  },
});

export default TabBar;
