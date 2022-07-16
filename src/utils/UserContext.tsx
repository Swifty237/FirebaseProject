import React, { createContext } from "react"
import { DataType } from "../screens/UserHome"
//import auth from "@react-native-firebase/auth"


export type contextType = {
    isLoggedIn: boolean
    setIsLoggedIn: (param: boolean) => void
    userEmail: string
    setUserEmail: (param: string) => void
    userUID: string
    setUserUID: (param: string) => void
}

export const UserContext = createContext<contextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    userEmail: "",
    setUserEmail: () => { },
    userUID: "",
    setUserUID: () => { }
})