import React, { useEffect, useState, useContext, useMemo } from "react"
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import type { RouteProp } from "@react-navigation/native"
import { HomeStackParamList } from "../components/Home"
import { UserContext } from "../utils/UserContext"
import { deleteDocument } from "../utils/functions"
import ModifButtons from "../components/ModifButtons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import getStorage from "@react-native-firebase/storage"
//import storage from "@react-native-firebase/storage"
import ref from "@react-native-firebase/storage"
import uploadBytes from "@react-native-firebase/storage"
import { v4 as uuidv4 } from "uuid"


type UserDatabaseGalleryRouteProp = { route: RouteProp<HomeStackParamList, "UserDatabaseGallery"> }


const UserDatabaseGallery: React.FunctionComponent<UserDatabaseGalleryRouteProp> = ({ route }) => {
    //const [imageUpload, setImageUpload] = useState()
    const { userImages } = route.params
    console.log("userImages: ", userImages)
    const storage = getStorage()


    const uploadImage = () => {
        if (userImages === null) return

        const imageRef = storage.ref(`images/${userImages.forEach(e => e.node.image.filename + uuidv4())}`)
        //const imageRef = storage.ref(`${userImages.forEach(e => "images/" + e.node.image.filename + uuidv4())}`)

    }


    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>Hello</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    text: {
        color: "black"
    }
})

export default UserDatabaseGallery