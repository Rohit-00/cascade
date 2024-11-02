import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native'
import React, { useRef, useState} from 'react'
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'


const {height , width} = Dimensions.get('window')

type page = {
  image : ImageSourcePropType,
  heading : string,
  subheading : string
}

interface MyComponentProps {
    Pages:page[],
    backgroundColors:any[],
    onDone: () => void,
    headingStyle?:{},
    subheadingStyle?:{},
    buttonColor?:string,
    pagerDotsColor?:string,
    buttonTextStyle?:{},
    nextButton?:React.ReactNode
  }

const OnboardAnimation : React.FC<MyComponentProps> = ({
  Pages,
  backgroundColors,
  onDone,
  headingStyle,
  buttonColor,
  subheadingStyle,
  pagerDotsColor,
  buttonTextStyle,
  nextButton}) => {
    
    const translationX = useSharedValue(0)
    const bgColor = useSharedValue('red')
    const scrollPosition = useSharedValue(0)
    const [lastPage,setLastPage] = useState<boolean>(false)

    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const scrollHandler = useAnimatedScrollHandler((event)=>{
        translationX.value = event.contentOffset.x
        scrollPosition.value = event.contentOffset.x

        
      })

    
    const handleNextPage = () => {
    if (scrollViewRef.current) {
      const nextPage = Math.ceil(scrollPosition.value / width) + 1;
      scrollViewRef.current.scrollTo({ x: nextPage * width, animated: true });
      const pageIndex = Math.round(translationX.value / width);
      if(pageIndex+1===Pages.length-1){
        setLastPage(true)
      }

      if(lastPage===true){
        onDone()
      }
    }
  };

  //Pager Dots
  const renderDots = () => {

    return Pages.map((_, index) => {
      const animatedDotStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const scale = interpolate(translationX.value, inputRange, [0.8, 1.5, 0.8], Extrapolation.CLAMP);
        const opacity = interpolate(translationX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
        
        
        return {
          transform: [{ scale }],
          opacity,
        };
      });

      return (
        
      <Animated.View key={index} style={[styles.dot, animatedDotStyle,{backgroundColor:pagerDotsColor||'black'}]} />
      
    );
    });
  };

  const handleScrollEnd = (event: any) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);

    if(pageIndex+1===Pages.length){
      setLastPage(true)
    }    
 
  };

  return (
    <View >

        <Animated.ScrollView ref={scrollViewRef} horizontal onScroll={scrollHandler} scrollEventThrottle={16}  pagingEnabled  contentOffset={{ x: scrollPosition.value, y: 0 }} showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScrollEnd} alwaysBounceHorizontal={false}
        >
        {Pages.map((item,index)=>
        {
                const animatedStyle = useAnimatedStyle(()=>{
                const inputRange = [0,width,width*2]  
                const color = interpolateColor(translationX.value,inputRange,backgroundColors)
                bgColor.value = color

                return{
                    backgroundColor:bgColor.value
                }
            })
                const imageAnimatedStyle = useAnimatedStyle(()=>{
                const inputRange = [(index-1)*width,index*width,(index+1)*width]
                const scale = interpolate(translationX.value,inputRange,[0,1,0], Extrapolation.CLAMP)
                const translate = interpolate(translationX.value,inputRange,[100,0,100], Extrapolation.CLAMP)

                return{
                    opacity:scale,
                    transform:[{translateY:translate}],
                }
            })
            
            return(<Animated.View style={[animatedStyle,styles.container]} key={index}>
                <View key={index}>
                    <Animated.Image
                    source={item.image}
                    style={[styles.image,imageAnimatedStyle]}
                    key={index}
                    />
                </View>
                <Animated.Text style={[headingStyle||styles.text,imageAnimatedStyle]} key={item.heading}>{item.heading}</Animated.Text>
                <Animated.Text style={[subheadingStyle||styles.subtext,imageAnimatedStyle]} key={item.subheading} >{item.subheading}</Animated.Text>
                </Animated.View>)
        }
        )}
       
        </Animated.ScrollView>

        <View style={styles.footerContainer}>
        <View style={styles.dotsContainer}>{renderDots()}</View>

   
        <TouchableOpacity style={[styles.nextButton,{backgroundColor:buttonColor||"#ff6347"}]} onPress={handleNextPage}>
          <Text style={buttonTextStyle||styles.buttonText}>{lastPage===true?'done':nextButton||'Next'}</Text>
        </TouchableOpacity>

      </View>
    
    </View>
  )
}

export default OnboardAnimation

const styles = StyleSheet.create({
    container:{
        height,
        width,
        alignItems:'center',
        justifyContent:'center',

    },
    image:{
        height:300,
        width:width,
        resizeMode:'contain',
        bottom:30
    },
    text:{
        fontSize:36,
        fontWeight:'bold',
        color:'black'
    },
    subtext:{
        fontSize:16,
        color:'black',
        textAlign:'center',
        width:width-40
    },
    nextButton: {
        position: "absolute",
        right: 20,  // Adjust to position button on screen
       
        paddingVertical: 10,
        paddingHorizontal:30,
        borderRadius: 100,
        alignItems:'center',
        justifyContent:'center'
  
      },
      buttonText: {
        color: "white",
        fontSize:16
      },
      dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        position: "absolute",  
        width: "100%",
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
      },
      footerContainer: {
        position: "absolute",
        bottom: 80,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor:'red'
      
      },
    
})