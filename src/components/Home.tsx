import React from "react"
import Registration from "../screens/Registration"
import Connection from "../screens/Connection"
import UserHome from "../screens/UserHome"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { UserContext } from "../utils/UserContext"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"


export type HomeStackParamList = {
    Registration: undefined
    Connection: undefined
    UserHome: { email: string, userUid: string }
}

const storage = new MMKVLoader().initialize()

const Home: React.FunctionComponent = (): JSX.Element => {
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