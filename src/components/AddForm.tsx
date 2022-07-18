import React from "react"
import { Modal, Text, ScrollView, StyleSheet, View } from "react-native"
import Input from "./Input"
import { Formik } from "formik"
import Btn from "../components/Btn"
import { addDocumentId } from "../utils/functions"
import firestore from "@react-native-firebase/firestore"


type AddFormType = {
    userID: string | undefined,
    addModalVisible: boolean,
    getAddModalVisible: (param: boolean) => void,
    addFormRefresh: boolean,
    getAddFormRefresh: (param: boolean) => void
}

const AddForm: React.FunctionComponent<AddFormType> = ({ userID, addModalVisible, getAddModalVisible, addFormRefresh, getAddFormRefresh }) => {

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{ name: "", login: "", password: "", type: "" }}
            onSubmit={(values, { resetForm }) => {
                console.log("=> onSubmit (AddForm)")
                console.log("State addModalVisible in AddForm (Enter): ", addModalVisible)
                console.log("State userID in AddForm (Enter): ", userID) // Pas besoin de récupérer la valeur de sortie de userId car il ne change pas d'état

                firestore()
                    .collection("data")
                    .add({
                        id: "", // Vide à la création
                        userId: userID,
                        name: values.name,
                        login: values.login,
                        password: values.password,
                        type: values.type
                    })
                addDocumentId() // Permet de remplir le champ id vide
                addModalVisible ? getAddModalVisible(false) : null
                !addFormRefresh ? getAddFormRefresh(true) : null
                resetForm() // Permet de vider le formulaire après la soumission

                console.log("State addModalVisible in AddForm (Exit):", addModalVisible)
                console.log("=> exit onSubmit (AddForm)")
            }}>

            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

                <View style={styles.container}>
                    <Modal visible={addModalVisible} animationType="slide">
                        <Text style={styles.text}> Nouvel enregistrement</Text>
                        <ScrollView style={styles.inputContainer}>
                            <Input
                                label="Nom"
                                placeholder="Entrez le nom de l'application"
                                value={values.name}
                                onChangeText={handleChange("name")}
                                onBlur={() => handleBlur("name")}
                                error={errors.name}
                            />

                            <Input
                                label="Login"
                                placeholder="Entrez le login"
                                value={values.login}
                                onChangeText={handleChange("login")}
                                onBlur={() => handleBlur("login")}
                                error={errors.login}
                            />

                            <Input
                                label="Mot de passe"
                                placeholder="Entrez le mot de passe"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={() => handleBlur("password")}
                                error={errors.password}
                            />

                            <Input
                                label="Type"
                                placeholder="Entrez le type d'application"
                                value={values.type}
                                onChangeText={handleChange("type")}
                                onBlur={() => handleBlur("type")}
                                error={errors.type}
                            />
                        </ScrollView>

                        <View style={styles.btnContainer}>
                            <View style={styles.register}>
                                <Btn label="Enregistrer" textStyle={styles.btnLabel} onPress={handleSubmit} />
                            </View>
                            <View style={styles.cancel}>
                                <Btn label="Annuler" textStyle={styles.btnLabel} onPress={() => {
                                    console.log("add document canceled")
                                    getAddModalVisible(false)
                                }} />
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </Formik>
    )
}



const styles = StyleSheet.create({
    container: {

    },

    btnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 15,
        alignItems: "center"
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
    },

    inputContainer: {
        flex: 2,
        marginTop: 20,
        paddingHorizontal: 20
    },


    text: {
        color: "black",
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center"
    },

    cancel: {
        backgroundColor: "#2c3e50",
        marginEnd: 5,
        height: 50,
        padding: 15,
        borderRadius: 5
    }
})


export default AddForm