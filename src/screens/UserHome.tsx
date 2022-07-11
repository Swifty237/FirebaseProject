import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, SafeAreaView, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Pressable, Animated } from "react-native"
import Btn from "../components/Btn"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Password from "../components/Password"
import Input from "../components/Input"
import { Formik } from "formik"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"




type UserHomeProps = NativeStackScreenProps<RootStackParamList, "UserHome">

export type DataType = {
    id: string | undefined
    userId: string
    login: string
    name: string
    password: string
    type: string
}


const UserHome: React.FunctionComponent<UserHomeProps> = ({ navigation, route }) => {

    const { email, userUid } = route.params

    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
    const [userId, setUserId] = useState<string>()
    const [data, setData] = useState<DataType[]>([])
    const [modifButtons, setModifButtons] = useState<boolean>(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<string>("")
    const [itemToModify, setItemToModify] = useState<DataType>()
    const [deleteItem, setDeleteItem] = useState<boolean>(false)
    const [modif, setModif] = useState<"add" | "update">("add")
    const [refresh, setRefresh] = useState<boolean>(false)

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



    const deleteDoc = (item: string) => {

        console.log("in deleteDoc")
        firestore()
            .collection("data")
            .get()
            .then(querySnapshot => {

                console.log("in querySnashopt")

                querySnapshot.forEach((snapshot) => {
                    //console.log("snapshot(documentShot): ", snapshot.exists)
                    if (snapshot.exists) {
                        firestore()
                            .collection("data")
                            .doc(snapshot.id)
                            .onSnapshot((documentShot) => {
                                //console.log("documentShot: ", documentShot.exists)

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
                console.log("out querySnapshot")
            }).catch(err => console.error(err))
        setRefresh(!refresh)
        console.log("out deleteDoc")

    }


    const handleDeleteItem = () => {
        if (deleteItem) {

            setDeleteItem(false)
            deleteDoc(itemIdToDelete)
        }

    }
    handleDeleteItem()


    const addDocId = () => {

        console.log("in addDocId")

        firestore()
            .collection("data")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((snapshot) => {
                    //console.log("snapshot(documentSnapshot): ", snapshot.exists)

                    if (snapshot.exists) {
                        firestore()
                            .collection("data")
                            .doc(snapshot.id)
                            .onSnapshot((documentSnapshot) => {
                                //console.log("documentSnapshot: ", documentSnapshot.exists)

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

        console.log("out addDocId")
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
                    console.log("in onSubmit")

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
                        addDocId()
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


                    console.log("out onSubmit")
                }}>

                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <View>
                        <Modal visible={modalVisible} animationType="slide">
                            <Text style={styles.text}> Nouvel enregistrement</Text>
                            <ScrollView style={styles.inputContainer}>
                                <Input
                                    defaultValue={itemToModify?.name}
                                    label="Nom"
                                    placeholder="Entrez le nom de l'application"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={() => handleBlur("name")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.name} />

                                <Input
                                    defaultValue={itemToModify?.login}
                                    label="Login"
                                    placeholder="Entrez le login"
                                    value={values.login}
                                    onChangeText={handleChange("login")}
                                    onBlur={() => handleBlur("login")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.login} />

                                <Input
                                    defaultValue={itemToModify?.password}
                                    label="Mot de passe"
                                    placeholder="Entrez le mot de passe"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={() => handleBlur("password")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.password} />

                                <Input
                                    defaultValue={itemToModify?.type}
                                    label="Type"
                                    placeholder="Entrez le type d'application"
                                    value={values.type}
                                    onChangeText={handleChange("type")}
                                    onBlur={() => handleBlur("type")}
                                    onFocus={() => {
                                        modif != "add" ? setModif("add") : null
                                    }}
                                    error={errors.type} />
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
                                    error={errors.name} />

                                <Input
                                    defaultValue={itemToModify?.login}
                                    label="Login"
                                    placeholder="Entrez le login"
                                    onChangeText={handleChange("login")}
                                    onBlur={() => handleBlur("login")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.login} />

                                <Input
                                    defaultValue={itemToModify?.password}
                                    label="Mot de passe"
                                    placeholder="Entrez le mot de passe"
                                    onChangeText={handleChange("password")}
                                    onBlur={() => handleBlur("password")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.password} />

                                <Input
                                    defaultValue={itemToModify?.type}
                                    label="Type"
                                    placeholder="Entrez le type d'application"
                                    onChangeText={handleChange("type")}
                                    onBlur={() => handleBlur("type")}
                                    onFocus={() => {
                                        modif != "update" ? setModif("update") : null
                                    }}
                                    error={errors.type} />
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

                        <Text style={styles.text}>Bonjour {email}</Text>

                        <View style={styles.btnContainer}>
                            <View style={styles.register}>
                                <Btn label="Nouvel enregistrement" textStyle={styles.btnLabel} onPress={() => setModalVisible(true)} />
                            </View>

                            <View style={styles.logOut}>
                                <Btn label="Deconnexion" textStyle={styles.btnLabel} onPress={() => {
                                    auth()
                                        .signOut()
                                        .then(() => {
                                            console.log('User signed out!')
                                            navigation.navigate("Home")
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
                                        data.filter(value => value.userId == userUid).map((item, i) => (
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