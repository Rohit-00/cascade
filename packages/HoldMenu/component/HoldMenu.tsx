import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps,
  
} from 'react-native';

interface MenuItem {
  id: string | number;
  label: string;
  onPress?: () => void;
}

interface HoldMenuProps {
  children: React.ReactNode;
  items: MenuItem[];
  holdDuration?: number;
  menuStyle?: ViewStyle;
  menuItemStyle?: ViewStyle;
  menuItemTextStyle?: TextStyle;
  overlayColor?: string;
  triggerStyle?: ViewStyle;
  onOpen?: () => void;
  onClose?: () => void;
}

interface MenuItemComponentProps extends PressableProps {
  item: MenuItem;
  textStyle?: any;
  style?: any;
  onItemPress: (item: MenuItem) => void;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  textStyle,
  style,
  onItemPress,
  ...pressableProps
}) => (
  <Pressable
    style={style}
    onPress={() => onItemPress(item)}
    {...pressableProps}
  >
    <Text style={textStyle}>{item.label}</Text>
  </Pressable>
);

const HoldMenu: React.FC<HoldMenuProps> = ({
  children,
  items,
  holdDuration = 500,
  menuStyle,
  menuItemStyle,
  menuItemTextStyle,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  triggerStyle,
  onOpen,
  onClose,
}) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuVisible(true);
      onOpen?.();
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 7,
      }).start();
    }, holdDuration);
  };

  const handlePressOut = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const closeMenu = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      onClose?.();
    });
  };

  const handleMenuItemPress = (item: MenuItem) => {
    item.onPress?.();
    closeMenu();
  };

  return (
    <View>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.trigger, triggerStyle]}
      >
        {children}
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={[styles.modalOverlay, { backgroundColor: overlayColor }]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menuContainer,
                  menuStyle,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {items.map((item) => (
                  <MenuItemComponent
                    key={item.id}
                    item={item}
                    style={[styles.menuItem, menuItemStyle]}
                    textStyle={[styles.menuItemText, menuItemTextStyle]}
                    onItemPress={handleMenuItemPress}
                  />
                ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    // Base trigger styles
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HoldMenu;