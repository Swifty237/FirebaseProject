import React, { useContext } from "react"
import { View, StyleSheet, Pressable, Text } from "react-native"
import Btn from "../components/Btn"
import Input from "../components/Input"
import auth from "@react-native-firebase/auth"
import * as yup from "yup"
import { Formik } from "formik"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { HomeStackParamList } from "../components/Home"
import { UserContext } from "../utils/UserContext"
import MMKVStorage from "react-native-mmkv-storage"




const validationSchema = yup.object().shape({
    email: yup.string().email().required("Champ obligatoire"),
    password: yup.string().required("Champ obligatoire")
})

type ConnectionNavigationProp = { navigation: NativeStackNavigationProp<HomeStackParamList, "Connection"> }

const Connection: React.FunctionComponent<ConnectionNavigationProp> = ({ navigation }) => {

    console.log("---------------------------------------------- In Connection screen --------------------------------------------------")


    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    return (
        <View style={styles.container}>

            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "", password: "" }}
                onSubmit={values => {
                    console.log("onSubmit (in Connection): --------------------------")

                    console.log("Auth Email: ", values.email)
                    console.log("Auth Password: ", values.password)

                    auth()
                        .signInWithEmailAndPassword(values.email, values.password)
                        .then(userAuth => {

                            if (!isLoggedIn) { setIsLoggedIn(true) }
                            console.log("User signed in !")
                            navigation.navigate("UserHome", { email: values.email, userUid: userAuth.user.uid })
                        })
                        .catch(error => {
                            if (error.code === "auth/user-not-found" || "auth/wrong-password") {
                                console.log("Authentication error: Invalid user or password !")
                            }
                            setIsLoggedIn(false)
                            //console.error(error)
                        })

                    console.log("exit onSubmit (in Connection): -------------------------")

                }}>

                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View>
                        <View style={styles.inputContainer}>
                            <Input
                                label="Email"
                                placeholder="Entrez votre email"
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={() => handleBlur("email")}
                                error={errors.email} />

                            <Input
                                label="Mot de passe"
                                placeholder="Entrez votre mot de passe"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={() => handleBlur("password")}
                                error={errors.password}
                                icon />
                        </View>

                        <View style={styles.btnContainer}>
                            <View style={styles.register}>
                                <Btn label="Valider" textStyle={styles.btnLabel} onPress={handleSubmit} />
                            </View>
                            <Pressable onPress={() => navigation.navigate("Registration")}>
                                <Text style={{ color: "black", margin: 10, textAlign: "center" }}>Pas encore inscrit ? <Text style={{ color: "blue" }}>Inscrivez vous ici !</Text></Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },

    inputContainer: {
        height: 220,
        marginTop: 50
    },

    text: {
        color: "black"
    },

    btnContainer: {
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


export default Connection