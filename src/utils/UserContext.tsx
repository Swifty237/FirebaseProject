import React, { createContext } from "react"
//import auth from "@react-native-firebase/auth"


export type contextType = {
    isLoggedIn: boolean
    setIsLoggedIn: (param: boolean) => void
}

export type refreshContextType = {
    refresh: boolean
    setRefresh: (param: boolean) => void
}

export const UserContext = createContext<contextType>({ isLoggedIn: false, setIsLoggedIn: () => { } })

export const RefreshContext = createContext<refreshContextType>({ refresh: false, setRefresh: () => { } })