import React, { createContext } from "react"
import { DataType } from "../screens/UserHome"
//import auth from "@react-native-firebase/auth"

enum STACKCHOICE { SIGN_IN, LOGGED }

export type contextType = {
    isLoggedIn: STACKCHOICE.SIGN_IN | STACKCHOICE.LOGGED
    setIsLoggedIn: (param: number) => void
    userEmail: string
    setUserEmail: (param: string) => void
    userPassword: string
    setUserPassword: (param: string) => void
    userUID: string
    setUserUID: (param: string) => void
}

export const UserContext = createContext<contextType>({
    isLoggedIn: STACKCHOICE.SIGN_IN,
    setIsLoggedIn: () => { },
    userEmail: "",
    setUserEmail: () => { },
    userPassword: "",
    setUserPassword: () => { },
    userUID: "",
    setUserUID: () => { }
})