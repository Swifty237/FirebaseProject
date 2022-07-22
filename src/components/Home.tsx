import React from "react"
import Registration from "../screens/Registration"
import Connection from "../screens/Connection"
import UserHome from "../screens/UserHome"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { UserContext } from "../utils/UserContext"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage" // Permet de faire persister les données dans le téléphone
import UserGallery from "../screens/UserGallery"
import UserDatabaseGallery from "../screens/UserDatabaseGallery"
import CameraRoll from "@react-native-community/cameraroll"



export type HomeStackParamList = {
    Registration: undefined
    Connection: undefined
    UserHome: { email: string, password?: string, userUid: string }
    UserGallery: undefined
    UserDatabaseGallery: { userImages: CameraRoll.PhotoIdentifier[] }
}

const storage = new MMKVLoader().initialize()

const Home: React.FunctionComponent = (): JSX.Element => {
    console.log("----------------------------------------------- In home component ----------------------------------------------------")

    enum STACKCHOICE { SIGN_IN, LOGGED } // SIGN_IN = 0, LOGGED = 1
    const [isLoggedIn, setIsLoggedIn] = useMMKVStorage<STACKCHOICE.SIGN_IN | STACKCHOICE.LOGGED>("isLoggedIn", storage, STACKCHOICE.SIGN_IN) // Permet de savoir si l'utilisateur est logué ou non et établir les routes en conséquences
    const [userEmail, setUserEmail] = useMMKVStorage<string>("Email", storage, "")
    const [userPassword, setUserPassword] = useMMKVStorage<string>("Password", storage, "")
    const [userUID, setUserUID] = useMMKVStorage<string>("UID", storage, "")
    const { Navigator, Screen, Group } = createNativeStackNavigator<HomeStackParamList>()

    console.log("isLoggedIn: ", isLoggedIn)

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail, userPassword, setUserPassword, userUID, setUserUID }}>
            <Navigator initialRouteName={isLoggedIn ? "UserHome" : "Connection"}>
                {isLoggedIn === STACKCHOICE.LOGGED ?
                    <Group>
                        <Screen name="UserHome" component={UserHome} options={{ title: "Accueil", headerTitleAlign: "center" }} initialParams={{ email: "", password: "", userUid: "" }} />
                        <Screen name="UserGallery" component={UserGallery} options={{ title: "Selectionnez des photos !", headerTitleAlign: "center" }} />
                        <Screen name="UserDatabaseGallery" component={UserDatabaseGallery} options={{ title: "Gallerie Photos", headerTitleAlign: "center" }} initialParams={{ userImages: [] }} />
                    </Group>
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