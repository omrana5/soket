import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Home';
import Imagecollection from './src/Imagecollection';
// import Mergeimage from './src/Mergeimage';
import Customeimageframe from './src/Customeimageframe';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Imagecollection" component={Imagecollection} />
      <Stack.Screen name="Customeimageframe" component={Customeimageframe} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default App