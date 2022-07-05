import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Btn from "../components/Btn"
import Input from "../components/Input"
import auth from "@react-native-firebase/auth"
import * as yup from "yup"
import { Formik } from "formik"



const validationSchema = yup.object().shape({
    email: yup.string().email().required("Champ obligatoire"),
    password: yup.string().required("Champ obligatoire")
})



const Connection = ({ navigation }: any) => {

    return (
        <View style={styles.container}>

            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "", password: "" }}
                onSubmit={values => {
                    auth()
                        .signInWithEmailAndPassword(values.email, values.password)
                        .then((userAuth) => {
                            console.log("User signed in !")
                            navigation.navigate("UserHome", { email: values.email, user: userAuth.user.uid })
                        })
                        .catch(error => {
                            if (error.code === "auth/invalid-email") {
                                console.log("That email address is invalid !")
                            }
                            console.error(error)
                        })
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