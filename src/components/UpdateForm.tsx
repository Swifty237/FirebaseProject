import React, { FunctionComponent } from "react"
import { Modal, Text, ScrollView, StyleSheet, View } from "react-native"
import Input from "./Input"
import { Formik } from "formik"
import Btn from "../components/Btn"
import firestore from "@react-native-firebase/firestore"
import type { DataType } from "../screens/UserHome"


type updateFormType = {
    item: DataType | undefined,
    updateModalVisible: boolean,
    getUpdateModalVisible: (param: boolean) => void,
    updateFormRefresh: boolean,
    getUpdateFormRefresh: (param: boolean) => void
}


const UpdateForm: FunctionComponent<updateFormType> = ({ updateModalVisible, item, getUpdateModalVisible, updateFormRefresh, getUpdateFormRefresh }) => {

    return (

        <Formik
            enableReinitialize={true} // A permis la résolution du bug 1) 
            initialValues={{ name: item?.name, login: item?.login, password: item?.password, type: item?.type }}
            onSubmit={values => {
                console.log("=> onSubmit (UpdateForm)")
                console.log("State updateModalVisible in UpdateForm (Enter): ", updateModalVisible)
                console.log("item content Enter:", item)

                firestore()
                    .collection("data")
                    .doc(item?.id)
                    .update({
                        name: values.name,
                        login: values.login,
                        password: values.password,
                        type: values.type
                    })
                updateModalVisible ? getUpdateModalVisible(false) : null
                !updateFormRefresh ? getUpdateFormRefresh(true) : null

                console.log("item content Exit (item adding to database):", { name: values.name, login: values.login, password: values.password, type: values.type })
                console.log("State updateModalVisible in UpdateForm (Exit): ", updateModalVisible)
                console.log("=> exit onSubmit (UpdateForm)")
            }}>

            {({ handleChange, handleBlur, handleSubmit, errors }) => (


                <View style={styles.container}>
                    <Modal visible={updateModalVisible} animationType="slide">
                        <Text style={styles.text}> Modification enregistrement</Text>
                        <ScrollView style={styles.inputContainer}>
                            <Input
                                defaultValue={item?.name}
                                label="Nom"
                                placeholder="Entrez le nom de l'application"
                                onChangeText={handleChange("name")}
                                onBlur={() => handleBlur("name")}
                                error={errors.name}
                                onSubmitEditing={() => { }} />

                            <Input
                                defaultValue={item?.login}
                                label="Login"
                                placeholder="Entrez le login"
                                onChangeText={handleChange("login")}
                                onBlur={() => handleBlur("login")}
                                error={errors.login}
                                onSubmitEditing={() => { }} />

                            <Input
                                defaultValue={item?.password}
                                label="Mot de passe"
                                placeholder="Entrez le mot de passe"
                                onChangeText={handleChange("password")}
                                onBlur={() => handleBlur("password")}
                                error={errors.password}
                                onSubmitEditing={() => { }} />

                            <Input
                                defaultValue={item?.type}
                                label="Type"
                                placeholder="Entrez le type d'application"
                                onChangeText={handleChange("type")}
                                onBlur={() => handleBlur("type")}
                                error={errors.type}
                                onSubmitEditing={() => { }} />
                        </ScrollView>

                        <View style={styles.btnContainer}>
                            <View style={styles.register}>
                                <Btn label="Enregistrer" textStyle={styles.btnLabel} onPress={handleSubmit} />
                            </View>
                            <View style={styles.cancel}>
                                <Btn label="Annuler" textStyle={styles.btnLabel} onPress={() => {
                                    console.log("Modification document canceled")
                                    getUpdateModalVisible(false)
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


export default UpdateForm