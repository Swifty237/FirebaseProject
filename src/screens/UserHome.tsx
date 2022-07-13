import React, { useEffect, useState, useContext } from "react"
import { StyleSheet, View, Text, SafeAreaView, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Pressable } from "react-native"
import Btn from "../components/Btn"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Password from "../components/Password"
import Input from "../components/Input"
import { Formik } from "formik"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { HomeStackParamList } from "../components/Home"
import { UserContext } from "../utils/UserContext"




type UserHomeProps = NativeStackScreenProps<HomeStackParamList, "UserHome">

export type DataType = {
    id: string | undefined
    userId: string
    login: string
    name: string
    password: string
    type: string
}


const UserHome: React.FunctionComponent<UserHomeProps> = ({ navigation, route }) => {

    console.log("-------------------------------- In UserHome screen ----------------------------------------")

    const { isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const { email, userUid } = route.params

    console.log(email)
    console.log(userUid)



    const [modalVisible, setModalVisible] = useState<boolean>(false) // Gère la modal qui contient le formulaire d'ajout de documents
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false) // Gère la modal qui contient le formulaire de modification des documents
    const [userId, setUserId] = useState<string>() // récupère l'UID de l'utilisateur dans un document
    const [data, setData] = useState<DataType[]>([]) // récupère toutes les documents de la collection
    const [modifButtons, setModifButtons] = useState<boolean>(false) // Gère la modal qui contient les boutons de modification et de suppression de document
    const [itemIdToDelete, setItemIdToDelete] = useState<string>("") // Récupère l'id du document à supprimer
    const [itemToModify, setItemToModify] = useState<DataType>() // Récupère le document à modifier
    const [deleteItem, setDeleteItem] = useState<boolean>(false) // Valide la suppression d'un document
    const [modif, setModif] = useState<"add" | "update">("add") // Permet de savoir s'il s'agit d'un nouveau document ou d'une modif d'un document existant
    const [refresh, setRefresh] = useState<boolean>(false) // Sert à provoquer un nouveau rendu apères chaque modification dans la base de données


    function onAuthStateChanged(user: any) {
        user ? setUserId(user.uid) : null
    }

    auth().onAuthStateChanged(onAuthStateChanged)

    useEffect(() => {

        let items: DataType[] = []

        firestore()
            .collection("data")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((snapshot) => {
                    items.push(snapshot.data() as DataType)
                })
                setData(items)

            }).catch(error => console.log(error))

        return (() => setData([]))

    }, [refresh])


    const deleteDocument = (item: string) => {

        console.log("deleteDocument function: --------------------------------------------")
        firestore()
            .collection("data")
            .get()
            .then(querySnapshot => {

                console.log("collection get method: querySnapshot")

                querySnapshot.forEach((snapshot) => {

                    if (snapshot.exists) {
                        firestore()
                            .collection("data")
                            .doc(snapshot.id)
                            .onSnapshot((documentShot) => {

                                if (documentShot.exists && documentShot.data()?.id === item) {

                                    firestore()
                                        .collection("data")
                                        .doc(snapshot.id)
                                        .delete()
                                        .then(() => {
                                            console.log("item deleted")
                                        })
                                }

                                else return
                            })
                    }
                    console.log("1")
                })
                console.log("exit collection querySnapshot")
            }).catch(err => console.error(err))
        setRefresh(!refresh)
        console.log("exit deleteDocument function: --------------------------------------------")

    }


    const handleDeleteItem = () => {
        if (deleteItem) {

            setDeleteItem(false)
            deleteDocument(itemIdToDelete)
        }

    }
    handleDeleteItem()


    const addDocumentId = () => {

        console.log("addDocumentId function: -------------------------------------------------------")

        firestore()
            .collection("data")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((snapshot) => {

                    if (snapshot.exists) {
                        firestore()
                            .collection("data")
                            .doc(snapshot.id)
                            .onSnapshot((documentSnapshot) => {

                                if (documentSnapshot.exists && documentSnapshot.data()?.id == "") {

                                    firestore()
                                        .collection("data")
                                        .doc(snapshot.id)
                                        .update({ id: snapshot.id })
                                        .then(() => {
                                            console.log("id of ", documentSnapshot.data()?.name, " added")

                                        })
                                }
                                else return
                            })
                        console.log("2")
                    }
                    else return
                })

                console.log("3")
            })

        console.log("exit addDocumentId function: ----------------------------------------------------------------")
    }


    return (
        <SafeAreaView style={styles.container}>
            <Formik
                initialValues={modif == "update" ? {
                    name: itemToModify?.name,
                    login: itemToModify?.login,
                    password: itemToModify?.password,
                    type: itemToModify?.type
                }
                    : { name: "", login: "", password: "", type: "" }}

                onSubmit={values => {
                    console.log("onSubmit (in UserHome): -----------------------------------")

                    if (modif == "add") {
                        firestore()
                            .collection("data")
                            .add({
                                id: "",
                                userId: userId,
                                name: values.name,
                                login: values.login,
                                password: values.password,
                                type: values.type
                            })
                        addDocumentId()
                        modalVisible ? setModalVisible(false) : null
                        setRefresh(!refresh)
                    }

                    else if (modif == "update") {
                        firestore()
                            .collection("data")
                            .doc(itemToModify?.id)
                            .update({
                                name: values.name,
                                login: values.login,
                                password: values.password,
                                type: values.type
                            })
                            .then(() => {
                                console.log("User updated!")
                            })
                        updateModalVisible ? setUpdateModalVisible(false) : null
                        setRefresh(!refresh)
                    }

                    console.log("exit onSubmit (in UserHome): -------------------------------------------------")
                }}>

                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View>
                        <Modal visible={modalVisible} animationType="slide">
                            <Text style={styles.text}> Nouvel enregistrement</Text>
                            <ScrollView style={styles.inputContainer}>
                                <Input
                                    label="Nom"
                                    placeholder="Entrez le nom de l'application"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={() => handleBlur("name")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.name}
                                    onSubmitEditing={() => { }} />

                                <Input
                                    label="Login"
                                    placeholder="Entrez le login"
                                    value={values.login}
                                    onChangeText={handleChange("login")}
                                    onBlur={() => handleBlur("login")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.login}
                                    onSubmitEditing={() => { }} />

                                <Input
                                    label="Mot de passe"
                                    placeholder="Entrez le mot de passe"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={() => handleBlur("password")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.password}
                                    onSubmitEditing={() => { }} />

                                <Input
                                    label="Type"
                                    placeholder="Entrez le type d'application"
                                    value={values.type}
                                    onChangeText={handleChange("type")}
                                    onBlur={() => handleBlur("type")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.type}
                                    onSubmitEditing={() => { }} />
                            </ScrollView>

                            <View style={styles.btnContainer}>
                                <View style={styles.register}>
                                    <Btn label="Enregistrer" textStyle={styles.btnLabel} onPress={handleSubmit} />
                                </View>
                                <View style={styles.cancel}>
                                    <Btn label="Annuler" textStyle={styles.btnLabel} onPress={() => {
                                        console.log("Annulation ajout doc")
                                        setModalVisible(false)
                                    }} />
                                </View>
                            </View>
                        </Modal>

                        <Modal visible={updateModalVisible} animationType="slide">
                            <Text style={styles.text}> Modification enregistrement</Text>
                            <ScrollView style={styles.inputContainer}>
                                <Input
                                    defaultValue={itemToModify?.name}
                                    label="Nom"
                                    placeholder="Entrez le nom de l'application"
                                    onChangeText={handleChange("name")}
                                    onBlur={() => handleBlur("name")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.name}
                                    onSubmitEditing={() => { }} />

                                <Input
                                    defaultValue={itemToModify?.login}
                                    label="Login"
                                    placeholder="Entrez le login"
                                    onChangeText={handleChange("login")}
                                    onBlur={() => handleBlur("login")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.login}
                                    onSubmitEditing={() => { }} />

                                <Input
                                    defaultValue={itemToModify?.password}
                                    label="Mot de passe"
                                    placeholder="Entrez le mot de passe"
                                    onChangeText={handleChange("password")}
                                    onBlur={() => handleBlur("password")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.password}
                                    onSubmitEditing={() => { }} />

                                <Input
                                    defaultValue={itemToModify?.type}
                                    label="Type"
                                    placeholder="Entrez le type d'application"
                                    onChangeText={handleChange("type")}
                                    onBlur={() => handleBlur("type")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.type}
                                    onSubmitEditing={() => { }} />
                            </ScrollView>

                            <View style={styles.btnContainer}>
                                <View style={styles.register}>
                                    <Btn label="Enregistrer" textStyle={styles.btnLabel} onPress={handleSubmit} />
                                </View>
                                <View style={styles.cancel}>
                                    <Btn label="Annuler" textStyle={styles.btnLabel} onPress={() => {
                                        console.log("Annulation modif doc")
                                        setUpdateModalVisible(false)
                                    }} />
                                </View>
                            </View>
                        </Modal>

                        <Text style={styles.text}>Bonjour {email ? email : null}</Text>

                        <View style={styles.btnContainer}>
                            <View style={styles.register}>
                                <Btn label="Nouvel enregistrement" textStyle={styles.btnLabel} onPress={() => setModalVisible(true)} />
                            </View>

                            <View style={styles.logOut}>
                                <Btn label="Deconnexion" textStyle={styles.btnLabel} onPress={() => {
                                    auth()
                                        .signOut()
                                        .then(() => {
                                            isLoggedIn ? setIsLoggedIn(false) : null
                                            console.log('User signed out!')
                                            navigation.navigate("Connection")
                                        })
                                }} />
                            </View>
                        </View>
                        <View style={styles.datasContainer}>

                            {data != [] ?
                                <ScrollView>
                                    <View>
                                        <Modal visible={modifButtons} animationType="slide" transparent={true}>
                                            <View style={styles.modalBox}>
                                                <Pressable style={styles.cancelBtn} onPress={() => setModifButtons(false)}>
                                                    <Text style={{ color: "black" }}>X</Text>
                                                </Pressable>
                                                <View style={styles.modifModalButtons}>
                                                    <View style={styles.btnModifBox}>
                                                        <Btn label="Modifier" textStyle={styles.btnModif} onPress={() => {
                                                            console.log("in modif btn");
                                                            setUpdateModalVisible(true)
                                                            setModifButtons(false)
                                                            console.log("out modif btn")
                                                        }} />
                                                    </View>
                                                    <View style={styles.btnSupprBox}>
                                                        <Btn label="Supprimer" textStyle={styles.btnSuppr} onPress={() => {
                                                            console.log("in suppression")
                                                            setDeleteItem(true)
                                                            setModifButtons(false)
                                                            console.log("out suppression")
                                                        }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                    {
                                        data.filter(item => item.userId == userUid).map((item, i) => (
                                            <TouchableOpacity style={styles.containerData} key={i} onLongPress={() => {
                                                console.log("in suppression or modif")
                                                item.id ? setItemIdToDelete(item.id) : null
                                                setItemToModify(item)
                                                setModifButtons(true)
                                                console.log("out suppression or modif")
                                            }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={styles.dataText}>Nom: </Text>
                                                    <Text style={{ color: "black" }} >{item.name}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={styles.dataText}>Login: </Text>
                                                    <Text style={{ color: "black" }} >{item.login}</Text>
                                                </View>

                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={styles.dataText}>Mots de passe: </Text>
                                                    <Password value={item.password} />
                                                </View>

                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={styles.dataText}>Type: </Text>
                                                    <Text style={{ color: "black" }} >{item.type}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>

                                :
                                <ActivityIndicator />
                            }
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
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    },

    containerData: {
        width: 320,
        borderWidth: 2,
        marginVertical: 10,
        borderColor: "gray",
        padding: 10

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

    logOut: {
        backgroundColor: "#2c3e50",
        marginEnd: 5,
        height: 50,
        padding: 15,
        borderRadius: 5,
        justifyContent: "center"
    },

    btnLabel: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15
    },

    cancel: {
        backgroundColor: "#2c3e50",
        marginEnd: 5,
        height: 50,
        padding: 15,
        borderRadius: 5
    },

    datasContainer: {
        flex: 1,
        alignItems: "center"
    },

    dataText: {
        color: "black",
        fontWeight: "bold",
        textAlignVertical: "center"
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

export default UserHome