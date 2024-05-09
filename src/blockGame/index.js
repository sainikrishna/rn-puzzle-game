import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const WIDTH = Dimensions.get('screen').width
const PLAY_PADDING = 16
const PLAY_WIDTH = WIDTH - PLAY_PADDING * 2;
const TOTAL_BOXES = 16
const TOTAL_BOX_ROWS = TOTAL_BOXES / 4;
const PLAY_VIEW_BORDER_WIDTH = 3;
const BOX_WIDTH = (PLAY_WIDTH / TOTAL_BOX_ROWS) - PLAY_VIEW_BORDER_WIDTH / 2;
const PRESS_GAP = 200;

const getBoxesData = (total) => {
    const boxes = [];
    for (let i = 0; i < total; i++) {
        boxes.push(i)
    }
    return boxes;
}

export const getOrder = (x, y) => {
    "worklet";
    const row = Math.round(y / BOX_WIDTH)
    const col = Math.round(x / BOX_WIDTH)
    return row * TOTAL_BOX_ROWS + col;
}

export const getPosition = (index) => {
    "worklet";
    return {
        x: (index % TOTAL_BOX_ROWS) * BOX_WIDTH,
        y: Math.floor(index / TOTAL_BOX_ROWS) * BOX_WIDTH
    }
}



const BlockGame = () => {
    const start = useSharedValue({ x: 0, y: 20 })
    const isPressed = useSharedValue(false)
    const offset = useSharedValue({ x: 0, y: 0 });

    const boxes = getBoxesData(TOTAL_BOXES)

    const boxesPosition = useSharedValue(Object.assign({}, ...boxes.map(item => ({ [item]: item }))))

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value.x },
                { translateY: offset.value.y },
                { scale: withTiming(isPressed.value ? 1.2 : 1) },
            ],
        };
    });

    const gesture = Gesture.Pan()
        .onBegin((e) => {
            console.log("onUpdate onBegin", {e})
            isPressed.value = true;
            offset.value = {
                x: start.value.x,
                y: start.value.y,
            };
        })
        .onUpdate((e, ctx) => {
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y - PRESS_GAP,
            };

            const newOrder = getOrder(offset.value.x, offset.value.y)
            console.log("onUpdate", {newOrder, e, ctx})
            // if(oldOrder !== newOrder) {
            //     const idToSwap = Object.keys(positions.value).find(key => positions.value[key] === newOrder)

            //     if(idToSwap) {
            //     const newPositions = JSON.parse(JSON.stringify(positions.value))
            //     newPositions[id] = newOrder
            //     newPositions[idToSwap] = oldOrder
            //     positions.value = newPositions
            //     }
            // }
            
        })
        .onEnd(() => {
            start.value = {
                x: offset.value.x,
                y: offset.value.y,
            };
        })
        .onFinalize(() => {
            isPressed.value = false;
        });

    console.log("BlockGame Render", { boxesPosition, boxes })
    return (
        <>
            <StatusBar hidden />
            <View style={styles.container}>
                <View style={styles.scoreView}>
                    <Text style={styles.scoreText}>148</Text>
                </View>
                <View style={styles.playView}>
                    {boxes.map(box => {
                        const position = getPosition(boxesPosition.value[box])
                        console.log("position", position)
                        return (<View style={[styles.box, {
                            position: 'absolute', transform: [
                                { translateX: position.x },
                                { translateY: position.y },
                            ]
                        }]}>
                            <Text style={{ color: 'white' }}>{box}</Text>
                        </View>)
                    })}
                    <GestureDetector gesture={gesture}>
                        <Animated.View style={[{
                            height: BOX_WIDTH * 0.8,
                            width: BOX_WIDTH * 0.8,
                            backgroundColor: '#a11212',
                            borderRadius: 10,
                        }, animatedStyles]} />
                    </GestureDetector>
                </View>
                {/* <View style={styles.blocksView}>
                    <GestureDetector gesture={gesture}>
                        <Animated.View style={[{
                            height: BOX_WIDTH * 0.8,
                            width: BOX_WIDTH * 0.8,
                            backgroundColor: '#a11212',
                            borderRadius: 10,
                        }, animatedStyles]} />
                    </GestureDetector>
                </View> */}
            </View>
        </>
    )
}

export default BlockGame

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3f31a8'
    },
    scoreView: {
        flex: 1,
        justifyContent: 'center'
    },
    scoreText: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    playView: {
        backgroundColor: '#191536',
        marginHorizontal: 16,
        borderRadius: 8,
        height: PLAY_WIDTH,
        width: PLAY_WIDTH,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: PLAY_VIEW_BORDER_WIDTH,
        borderColor: '#0d0a21'
    },
    box: {
        borderWidth: 1.5,
        borderRadius: 4,
        borderColor: '#0d0a21',
        width: BOX_WIDTH,
        height: BOX_WIDTH
    },
    blocksView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
})