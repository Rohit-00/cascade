import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

type menuItem = {
    icon:React.ReactNode,
    onPress:()=>void
}
interface FABprop {
    menuItems : menuItem[]  
}
const FABMenu : React.FC<FABprop> = ({menuItems}) => {
const [isOpen, setIsOpen] = useState(false);
const rotation = useSharedValue(0); 

const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    rotation.value = withTiming(isOpen ? 0 : 45, { duration: 300 });
};

const animatedStyle = useAnimatedStyle(() => {
    const rotate = `${rotation.value}deg`;

    return {
    transform: [withSpring({ rotate })],
    };
});

// FAB menu item styles
const animatedMenuStyle = (index: number) =>
    useAnimatedStyle(() => {
    const translateY = withTiming(isOpen ? -60 * (index + 1) : 0, { duration: 300 });
    
    return {
        transform: [{ translateY }],        
    };
    });

return (
    <View style={styles.container}>

    {/* Menu Items */}
    {menuItems.map((item,index)=>

    <Animated.View style={[styles.menuItem, animatedMenuStyle(index)]} key={index}>
    <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
    <Text style={styles.menuText}>{item.icon}</Text>
    </TouchableOpacity>
    </Animated.View>

    )}
   

    {/* Floating Action Button */}
    <TouchableOpacity style={styles.fab} onPress={toggleMenu} activeOpacity={1}>
        <Animated.View style={animatedStyle}>
        <Icon name="add" size={30} color="white" />
        </Animated.View>
    </TouchableOpacity>
    </View>
);
};

export default FABMenu;

const styles = StyleSheet.create({
container: {
    position: 'absolute',
    bottom: 50,
    right: 30,
},
fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
},
menuItem: {
    position: 'absolute',
    alignSelf:'center'
},
menuButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
},
menuText: {
    color: 'white',
    fontWeight: 'bold',
},
});
