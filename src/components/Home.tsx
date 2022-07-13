import React, { useState } from "react"
import Registration from "../screens/Registration"
import Connection from "../screens/Connection"
import UserHome from "../screens/UserHome"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { UserContext } from "../utils/UserContext"


export type HomeStackParamList = {
    Registration: undefined
    Connection: undefined
    UserHome: { email: string, userUid: string }
}

//Si je type mon composant Home comme ceci => Home: React.FunctionComponent<RootStackParamList>, j'obtiens une erreur dans App
const Home: React.FunctionComponent = () => {
    console.log("-------------------------------------------------- In home component -------------------------------------------------------")

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false) // Permet de savoir si l'utilisateur est loggé ou non et établir les routes en conséquences
    const { Navigator, Screen, Group } = createNativeStackNavigator<HomeStackParamList>()

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <Navigator initialRouteName={isLoggedIn ? "UserHome" : "Connection"}>
                {isLoggedIn ?
                    <Screen name="UserHome" component={UserHome} options={{ title: "Accueil", headerTitleAlign: "center" }} initialParams={{ email: "", userUid: "" }} />
                    :
                    <Group>
                        <Screen name="Connection" component={Connection} options={{ title: "Connexion", headerTitleAlign: "center" }} />
                        <Screen name="Registration" component={Registration} options={{ title: "Inscription", headerTitleAlign: "center" }} />
                    </Group>
                }
            </Navigator>
        </UserContext.Provider>
    )
}

export default Home