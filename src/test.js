import { View, Text } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const Test = () => {
    const start = useSharedValue({ x: 0, y: 20 })
    const isPressed = useSharedValue(false)
    const offset = useSharedValue({ x: 0, y: 0 });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value.x },
                { translateY: offset.value.y },
                // { scale: withTiming(isPressed.value ? 1.2 : 1) },
            ],
        };
    });

    const gesture = Gesture.Pan()
        .onBegin((e) => {
            console.log("onUpdate onBegin", e)

            isPressed.value = true;
            offset.value = {
                x: start.value.x,
                y: start.value.y,
            };
        })
        .onUpdate((e, ctx) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y,
            };
            console.log("onUpdate", e)
            
            
        })
        .onEnd((e) => {
            console.log("onUpdate onEnd", e)
            // start.value = {
            //     x: offset.value.x,
            //     y: offset.value.y,
            // };
        })
        .onFinalize((e) => {
            console.log("onUpdate onFinalize", e)
            // isPressed.value = false;
        });
  return (
    <View style={{flex: 1}}>
        <View style={{height: 100}} />
                    <GestureDetector gesture={gesture}>
                        <Animated.View onLayout={(e) => {
                            console.log("onLayout", e.nativeEvent)
                        }} style={[{
                            height: 100,
                            width: 80,
                            backgroundColor: '#a11212',
                            borderRadius: 10,
                            marginLeft: 100
                        }, animatedStyles]} />
                    </GestureDetector>
                </View>
  )
}

export default Test