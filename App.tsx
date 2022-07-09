/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native"
import Home from "./src/screens/Home"
import Registration from "./src/screens/Registration"
import Connection from "./src/screens/Connection"
import UserHome from "./src/screens/UserHome"


export type RootStackParamList = {
  Home: undefined
  Registration: undefined
  Connection: undefined
  UserHome: { email: string, userUid?: string }
}



const App = () => {

  const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>()

  return (
    <NavigationContainer>
      <Navigator initialRouteName="Home">
        <Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Screen name="Registration" component={Registration} options={{ title: "Inscription", headerTitleAlign: "center" }} />
        <Screen name="Connection" component={Connection} options={{ title: "Connexion", headerTitleAlign: "center" }} />
        <Screen name="UserHome" component={UserHome} options={{ title: "Accueil", headerTitleAlign: "center" }} />
      </Navigator>
    </NavigationContainer>
  )
}

export default App;
