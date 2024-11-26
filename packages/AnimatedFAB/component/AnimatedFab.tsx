import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withTiming 
} from 'react-native-reanimated';

type menuItem = {
    icon: React.ReactNode;
    onPress: () => void;
    label:string;
};

interface FABprop {
    menuItems: menuItem[];
    fabColor?:string;
    fabMenuColor?:string;
    fabIcon:React.ReactNode;
    backdropOpacity?:number;
}

const FABMenu: React.FC<FABprop> = ({ menuItems, fabColor, fabMenuColor, fabIcon, backdropOpacity }) => {
    const [isOpen, setIsOpen] = useState(false);
    const rotation = useSharedValue(0);
    const blurOpacity = useSharedValue(0);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
        rotation.value = withTiming(isOpen ? 0 : 45, { duration: 300 });
        blurOpacity.value = withTiming(isOpen ? 0 : 1, { duration: 300 });
    };

    const animatedFabStyle = useAnimatedStyle(() => {
        const rotate = `${rotation.value}deg`;
        return {
            transform: [{ rotate }],
        };
    });

    const animatedBlurStyle = useAnimatedStyle(() => {
        return {
            opacity: blurOpacity.value,
        };
    });

    const animatedMenuStyle = (index: number) =>
        useAnimatedStyle(() => {
            const translateY = withTiming(isOpen ? -60 * (index + 1) : 0, { duration: 300 });
            return {
                transform: [{ translateY }],
            };
        });

    return (
        <>
            {/* Backdrop Blur */}
            {isOpen && (
                <Animated.View style={[StyleSheet.absoluteFill, animatedBlurStyle,{zIndex:40,backgroundColor:`rgba(0,0,0,${backdropOpacity||0.7})`}]}>
                   
                </Animated.View>
            )}

            {/* Menu Items and FAB */}
            <View style={styles.container}>
                {menuItems.map((item, index) => (
                    <Animated.View style={[styles.menuItem, animatedMenuStyle(index)]} key={index}>
                      <Animated.Text style={[animatedBlurStyle,styles.label]}>{item.label}</Animated.Text>
                        <TouchableOpacity style={[styles.menuButton,{backgroundColor:fabMenuColor||'black'}]} onPress={()=>{item.onPress();toggleMenu();}}>
                            {item.icon}
                        </TouchableOpacity>
                    </Animated.View>
                ))}

                <TouchableOpacity style={[styles.fab,{backgroundColor:fabColor||'black'}]} onPress={toggleMenu} activeOpacity={1}>
                    <Animated.View style={animatedFabStyle}>
                        {fabIcon}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default FABMenu;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        zIndex: 100,
    },
    fab: {
        width: 70,
        height: 70,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItem: {
        position: 'absolute',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:20,
        right:9.5
        
    },
    menuButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginBottom: 10,
    },
    menuText: {
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        fontSize:16,
        color:'white',
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        right:70,   
        top:10
    }
});
