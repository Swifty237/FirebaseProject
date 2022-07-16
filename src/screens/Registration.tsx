import React, { useContext } from "react"
import Btn from "../components/Btn"
import Input from "../components/Input"
import { SafeAreaView, StyleSheet, View } from "react-native"
import auth from "@react-native-firebase/auth"
import * as yup from "yup"
import { Formik } from "formik"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { HomeStackParamList } from "../components/Home"
import { UserContext } from "../utils/UserContext"





const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
const validationSchema = yup.object().shape({
    email: yup.string().email().required("Champ obligatoire"),
    password: yup.string()
        .required("Champ obligatoire")
        .matches(regex, "Minimum 8 caractères,  une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial"),
    passwordConfirm: yup.string().required().oneOf([yup.ref("password"), null], "Les mots de passe ne correspondent pas")
})

type RegistrationNavigationProp = { navigation: NativeStackNavigationProp<HomeStackParamList, "Registration"> }

const Registration: React.FunctionComponent<RegistrationNavigationProp> = ({ navigation }) => {

    console.log("------------------------------------------- In Registration screen ---------------------------------------------------")

    const { isLoggedIn, setIsLoggedIn, setUserEmail, setUserUID } = useContext(UserContext)

    return (
        <SafeAreaView style={styles.container}>
            <Formik
                validationSchema={validationSchema}
                initialValues={{ email: "", password: "", passwordConfirm: "" }}
                onSubmit={values => {
                    console.log("=> onSubmit (Registration screen)")

                    auth()
                        .createUserWithEmailAndPassword(values.email, values.password)
                        .then(userAuth => {
                            console.log("User account created & signed in !")

                            if (!isLoggedIn) { setIsLoggedIn(true) }

                            navigation.navigate("UserHome", { email: values.email, userUid: userAuth.user.uid })

                            setUserEmail(values.email)
                            setUserUID(userAuth.user.uid)
                        })
                        .catch(error => {
                            if (error.code === "auth/email-already-in-use") {
                                console.log("Registration error: That email adress is already in use !")
                            }
                            setIsLoggedIn(false)
                            //console.error(error)
                        })
                    console.log("=> exit onSubmit (Registration screen)")
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