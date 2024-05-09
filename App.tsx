import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Box from './box'
import Draggable from './draggable'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'
import Reanimated from './src/reanimated'
import BlockGame from './src/blockGame'
import Test from './src/test'

const arr = new Array(25).fill('').map((_, i) => i)

const App = () => {

  const positions = useSharedValue(Object.assign({}, ...arr.map(item => ({[item]: item}))))
console.log("App.js positions", positions)

return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.wrapper}>
            {/* {arr.map(item => <Draggable key={item} positions={positions} id={item}><Box count={item} /></Draggable>)} */}
            {/* <Reanimated /> */}
            <BlockGame />
            {/* <Test /> */}
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3f31a8',
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // padding: 16,
    flex: 1,
  }
})