import React from "react"
import { StyleSheet, View, Text, SafeAreaView } from "react-native"
import Btn from "../components/Btn"
import auth from "@react-native-firebase/auth"



const UserHome = ({ navigation, route }: any) => {

    const { email } = route.params

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>Bonjour {email}</Text>
                <View style={styles.btnContainer}>
                    <View style={styles.logOut}>
                        <Btn label="Logout" textStyle={styles.btnLabel} onPress={() => {
                            auth()
                                .signOut()
                                .then(() => {
                                    console.log('User signed out!')
                                    navigation.navigate("Home")
                                })
                        }} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },

    text: {
        color: "black",
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: "bold"
    },

    btnContainer: {
        justifyContent: "center",
        marginVertical: 15
    },

    logOut: {
        backgroundColor: "#2c3e50",
        marginEnd: 5,
        height: 50,
        padding: 15,
        borderRadius: 5
    },

    btnLabel: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15
    }
})

export default UserHome