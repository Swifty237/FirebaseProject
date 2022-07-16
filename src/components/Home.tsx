import React, { useEffect, useState } from "react"
import Registration from "../screens/Registration"
import Connection from "../screens/Connection"
import UserHome from "../screens/UserHome"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { UserContext } from "../utils/UserContext"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"
import firestore from "@react-native-firebase/firestore"
import { DataType } from "../screens/UserHome"



export type HomeStackParamList = {
    Registration: undefined
    Connection: undefined
    UserHome: { email: string, userUid: string }
}

const storage = new MMKVLoader().initialize()

//Si je type mon composant Home comme ceci => Home: React.FunctionComponent<RootStackParamList>, j'obtiens une erreur dans App
const Home: React.FunctionComponent = () => {
    console.log("----------------------------------------------- In home component ----------------------------------------------------")

    const [isLoggedIn, setIsLoggedIn] = useMMKVStorage<boolean>("isLoggedIn", storage, false) // Permet de savoir si l'utilisateur est logué ou non et établir les routes en conséquences
    const [userEmail, setUserEmail] = useMMKVStorage<string>("Email", storage, "")
    const [userUID, setUserUID] = useMMKVStorage<string>("UID", storage, "")
    const { Navigator, Screen, Group } = createNativeStackNavigator<HomeStackParamList>()

    console.log("isLoggedIn: ", isLoggedIn)

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail, userUID, setUserUID }}>
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