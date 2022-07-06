import React from "react"
import { StyleSheet, View, Text, SafeAreaView } from "react-native"
import Btn from "../components/Btn"
import { RootStackParamList } from "../../App"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"



type HomeNavigationProp = { navigation: NativeStackNavigationProp<RootStackParamList, "Home"> }

const Home: React.FunctionComponent<HomeNavigationProp> = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Ecran d'acceuil</Text>
            <View style={styles.btnContainer}>
                <View style={styles.register}>
                    <Btn label="Connexion" textStyle={styles.btnLabel} onPress={() => navigation.navigate("Connection")} />
                </View>
                <View style={styles.register}>
                    <Btn label="Inscription" textStyle={styles.btnLabel} onPress={() => navigation.navigate("Registration")} />
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
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 15
    },

    register: {
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


export default Home