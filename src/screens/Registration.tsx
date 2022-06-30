import React from "react"
import Btn from "../components/Btn"
import Input from "../components/Input"
import { SafeAreaView, StyleSheet, View } from "react-native"
import auth from "@react-native-firebase/auth"
import * as yup from "yup"
import { Formik } from "formik"




const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
const validationSchema = yup.object().shape({
    email: yup.string().email().required("Champ obligatoire"),
    password: yup.string()
        .required("Champ obligatoire")
        .matches(regex, "Minimum 8 caractères,  une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial"),
    passwordConfirm: yup.string().required().oneOf([yup.ref("password"), null], "Les mots de passe ne correspondent pas")
})



const Registration = ({ navigation }: any) => {

    return (
        <SafeAreaView style={styles.container}>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "", password: "", passwordConfirm: "" }}
                onSubmit={values => {
                    console.log(values)

                    auth()
                        .createUserWithEmailAndPassword(values.email, values.password)
                        .then(() => {
                            console.log("User account created & signed in !")
                            navigation.navigate("UserHome", { email: values.email })
                        })
                        .catch(error => {
                            if (error.code === "auth/email-already-in-use") {
                                console.log("That email adress is already in use !")
                            }
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

                            <Input
                                label="Confirmation du mot de passe"
                                placeholder="Confirmez votre mot de passe"
                                value={values.passwordConfirm}
                                onChangeText={handleChange("passwordConfirm")}
                                onBlur={() => handleBlur("passwordConfirm")}
                                error={errors.passwordConfirm}
                                icon />
                        </View>

                        <View style={styles.btnContainer}>
                            <View style={styles.register}>
                                <Btn label="Enregistrer" textStyle={styles.btnLabel} onPress={handleSubmit} />
                            </View>
                        </View>
                    </View>
                )}
            </Formik>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    inputContainer: {
        height: 320,
        marginTop: 50
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

export default Registration