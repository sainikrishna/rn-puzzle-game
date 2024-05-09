import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { MARGIN, getOrder, getPosition } from './utils'

const Draggable = ({ children, positions, id }) => {
  const position = getPosition(positions.value[id])
  console.log(`Draggable Render position - ${id}`, position)

  const traslateX = useSharedValue(position.x)
  const traslateY = useSharedValue(position.y)
  const isGestureActive = useSharedValue(false)

  useAnimatedReaction(() => positions.value[id], newOrder => {
    const newPositions = getPosition(newOrder)
    traslateX.value = withTiming(newPositions.x)
    traslateY.value = withTiming(newPositions.y)
  })

  const panGesture = useAnimatedGestureHandler({
    onStart: (ent, ctx) => {
      console.log("Draggable onStart", {ent, ctx})
      ctx.startX = traslateX.value
      ctx.startY = traslateY.value
      isGestureActive.value = true
    },
    onActive: (evt, ctx) => {
      traslateX.value = ctx.startX + evt.translationX
      traslateY.value = ctx.startY+ evt.translationY

      const oldOrder = positions.value[id]
      const newOrder = getOrder(traslateX.value, traslateY.value)

      if(oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions.value).find(key => positions.value[key] === newOrder)

        if(idToSwap) {
          const newPositions = JSON.parse(JSON.stringify(positions.value))
          newPositions[id] = newOrder
          newPositions[idToSwap] = oldOrder
          positions.value = newPositions
        }
      }

      console.log(`Draggable onActive - ${oldOrder}`, newOrder)
    },
    onEnd: () => {
      const destination = getPosition(positions.value[id])
      traslateX.value = withTiming(destination.x)
      traslateY.value = withTiming(destination.y)
    },
    onFinish: () => {
      isGestureActive.value = false
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 1000 : 1
    const scale = isGestureActive.value ? 1.1 : 1;
    return {
      position: 'absolute',
      margin: MARGIN * 2,
      zIndex,
      transform: [
        { translateX: traslateX.value }, 
        { translateY: traslateY.value },
        {scale}
      ]
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}

export default Draggable