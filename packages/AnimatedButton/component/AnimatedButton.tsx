import { View,FlatList, ViewToken, Dimensions } from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withTiming , SharedValue, withSpring} from 'react-native-reanimated'
import React from 'react'

const { height : deviceHeight , width : deviceWidth } = Dimensions.get('window')

interface MyComponentProps {
  data:any[],
  ItemStyle:React.ElementType,
  animation?:string
}

const AnimatedList :React.FC<MyComponentProps>  = ({data,ItemStyle,animation}) => {
 
const viewableItems = useSharedValue<ViewToken[]>([])
let viewTable:ViewToken[] = []

return (
<View>
<FlatList
        data={data}
        onViewableItemsChanged={({viewableItems:vItem})=>{           
            viewTable=[...viewTable,...vItem]
            viewableItems.value = viewTable
            // viewableItems.value = vItem
        }
        }
        renderItem={({item})=>{
        return <ListItem item={item} viewableItems={viewableItems} ItemStyle={ItemStyle} animation={animation} />}}
        keyExtractor={item => item.id}  
        showsVerticalScrollIndicator={false}   
      />

</View>
    )
  }

type ListItemProps = {
    viewableItems: SharedValue<ViewToken[]>;
    item:{
        name:string,
        age:number
    };
    ItemStyle:React.ElementType,
    animation?:string
}

const ListItem:React.FC<ListItemProps>  = React.memo(
    
    ({item,viewableItems,ItemStyle,animation})=>{
    
    const animatedStyle = useAnimatedStyle(()=>{

        const isVisible =Boolean( viewableItems.value.filter((item:any)=>item.isViewable)
        .find((viewableItem:any)=>viewableItem.item.name===item.name))
        
        switch(animation){

            case 'slide-left':
                return{
        
                    transform:[
                     {
                         translateX:withTiming(isVisible?0:deviceWidth)
                         
                     },
                    ]
                 }
            case 'slide-right':
                return{
        
                    transform:[
                     {
                         translateX:withTiming(isVisible?0:-deviceWidth)
                         
                     },
                    ]
                 }
            case 'slide-left-spring':
                return{
        
                    transform:[
                     {
                         translateX:withSpring(isVisible?0:deviceWidth)
                         
                     },
                    ]
                 }
            case 'slide-right-spring':
                return{
        
                    transform:[
                     {
                         translateX:withSpring(isVisible?0:-deviceWidth)
                         
                     },
                    ]
                 }
                 
            case 'bottom-up':
                return{
        
                    transform:[
                     {
                         translateY:withTiming(isVisible?0:100)
                         
                     },
                    ]
                 }
            case 'bottom-up-spring':
                return{
        
                    transform:[
                     {
                         translateY:withSpring(isVisible?0:deviceHeight)
                         
                     },
                    ]
                 }

                default:
                    return{
                        transform:[
                            {
                                scale:withTiming(isVisible?1:0)
                                
                            },
                           ]
                    }
        }
            
        
    })
        return(
        <Animated.View style={[animatedStyle]}>
            <ItemStyle item={item} />
        </Animated.View>
        )
    }
   
)


export default AnimatedList

