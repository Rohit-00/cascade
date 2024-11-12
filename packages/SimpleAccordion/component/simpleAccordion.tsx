import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface AccordionItem {
  id: string | number;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  data: AccordionItem[];
  expandMultiple?: boolean;
  headerStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  contentStyle?: ViewStyle;
  iconColor?: string;
  activeOpacity?: number;
  animationDuration?: number;
  initiallyExpanded?: (string | number)[];
}

interface AccordionItemProps extends AccordionItem {
  isExpanded: boolean;
  onPress: () => void;
  headerStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  contentStyle?: ViewStyle;
  iconColor?: string;
  activeOpacity?: number;
  animationDuration?: number;
  borderColor?:string;
}

const AccordionItemComponent: React.FC<AccordionItemProps> = ({
  title,
  content,
  isExpanded,
  onPress,
  headerStyle,
  headerTextStyle,
  contentStyle,
  iconColor = '#000',
  activeOpacity = 0.7,
  animationDuration = 300,
  borderColor = 'grey'
}) => {
  const [contentHeight, setContentHeight] = useState<number>(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isExpanded ? contentHeight : 0,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: isExpanded ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded, contentHeight, animationDuration]);

  const arrowRotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const measureContent = (event: any) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={[styles.itemContainer,{borderBottomColor:borderColor}]}>
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={[styles.header, headerStyle]}
      >
        <Text style={[styles.headerText, headerTextStyle]}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
          <Icon name="keyboard-arrow-down" size={24} color={iconColor} />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.contentContainer,
          contentStyle,
          { height: animatedHeight }
        ]}
      >
        <View style={styles.contentMeasure} onLayout={measureContent}>
          <View style={styles.contentInner}>
            {content}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  data,
  expandMultiple = false,
  headerStyle,
  headerTextStyle,
  contentStyle,
  iconColor,
  activeOpacity,
  animationDuration,
  initiallyExpanded = [],
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string | number>>(
    new Set(initiallyExpanded)
  );

  const toggleItem = (id: string | number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setExpandedItems((prevItems) => {
      const newItems = new Set(prevItems);
      
      if (expandMultiple) {
        if (newItems.has(id)) {
          newItems.delete(id);
        } else {
          newItems.add(id);
        }
      } else {
        if (newItems.has(id)) {
          newItems.clear();
        } else {
          newItems.clear();
          newItems.add(id);
        }
      }
      
      return newItems;
    });
  };

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <AccordionItemComponent
          key={item.id}
          {...item}
          isExpanded={expandedItems.has(item.id)}
          onPress={() => toggleItem(item.id)}
          headerStyle={headerStyle}
          headerTextStyle={headerTextStyle}
          contentStyle={contentStyle}
          iconColor={iconColor}
          activeOpacity={activeOpacity}
          animationDuration={animationDuration}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
   
  },
  itemContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  contentMeasure: {
    position: 'absolute',
    width: '100%',
  },
  contentInner: {
    padding: 16,
    paddingTop: 8,
  },
});

export default Accordion;