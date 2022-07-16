import React, { FunctionComponent } from "react"
import { View, Modal, Pressable, Text, StyleSheet } from "react-native"
import Btn from "../components/Btn"

type ModifButtonsType = {
    visibleButtons: boolean,
    getButtons: (param: boolean) => void,
    getModifForm: (param: boolean) => void,
    getDelete: (param: boolean) => void
}




const ModifButtons: FunctionComponent<ModifButtonsType> = ({ visibleButtons, getButtons, getModifForm, getDelete }) => {

    return (
        <View style={styles.container}>
            <Modal visible={visibleButtons} animationType="slide" transparent={true}>
                <View style={styles.modalBox}>
                    <Pressable style={styles.cancelBtn} onPress={() => getButtons(false)}>
                        <Text style={{ color: "black" }}>X</Text>
                    </Pressable>
                    <View style={styles.modifModalButtons}>
                        <View style={styles.btnModifBox}>
                            <Btn label="Modifier" textStyle={styles.btnModif} onPress={() => {
                                console.log("modification")
                                getModifForm(true)
                                getButtons(false)
                            }} />
                        </View>
                        <View style={styles.btnSupprBox}>
                            <Btn label="Supprimer" textStyle={styles.btnSuppr} onPress={() => {
                                console.log("suppression")
                                getDelete(true)
                                getButtons(false)
                            }} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },

    btnModif: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15
    },

    btnSuppr: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15
    },

    btnModifBox: {
        backgroundColor: "#2c3e50",
        marginEnd: 5,
        height: 50,
        padding: 15,
        borderRadius: 5
    },

    btnSupprBox: {
        backgroundColor: "red",
        marginEnd: 5,
        height: 50,
        padding: 15,
        borderRadius: 5
    },

    modifModalButtons: {
        flexDirection: "row",
        justifyContent: "center",
    },

    modalBox: {
        width: 300,
        height: 120,
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#ecf0f1",
        marginTop: 350,
        borderWidth: 2,
        borderColor: "#ecf0f1"
    },

    cancelBtn: {
        borderWidth: 2,
        borderRadius: 3,
        paddingHorizontal: 5,
        alignSelf: "flex-end",
        margin: 5,
        backgroundColor: "white"
    }
})


export default ModifButtons