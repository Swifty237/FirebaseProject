import React, { useEffect, useState, useContext, useMemo } from "react"
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Password from "../components/Password"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { HomeStackParamList } from "../components/Home"
import { UserContext } from "../utils/UserContext"
import { deleteDocument } from "../utils/functions"
import AddForm from "../components/AddForm"
import UpdateForm from "../components/UpdateForm"
import ModifButtons from "../components/ModifButtons"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import getStorage from "@react-native-firebase/storage"
import ref from "@react-native-firebase/storage"
import uploadBytes from "@react-native-firebase/storage"



type UserHomeProps = NativeStackScreenProps<HomeStackParamList, "UserHome">

export type DataType = {
    id: string | undefined
    userId: string
    login: string
    name: string
    password: string
    type: string
}

const UserHome: React.FunctionComponent<UserHomeProps> = ({ navigation, route }): JSX.Element => {

    console.log("----------------------------------------------- In UserHome screen ---------------------------------------------------")

    const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail, userUID, setUserUID } = useContext(UserContext)
    enum STACKCHOICE { SIGN_IN, LOGGED }
    const { email, userUid } = route.params
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false) // Gère la modal qui contient le formulaire d'ajout de documents
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false) // Gère la modal qui contient le formulaire de modification des documents
    const [userId, setUserId] = useState<string>() // récupère l'UID de l'utilisateur pour le rajouter dans un document qu'il créé
    const [modifButtons, setModifButtons] = useState<boolean>(false) // Gère la modal qui contient les boutons de modification et de suppression de document
    const [itemIdToDelete, setItemIdToDelete] = useState<string>("") // Récupère l'id du document à supprimer
    const [itemToModify, setItemToModify] = useState<DataType>() // Récupère le document à modifier
    const [deleteItem, setDeleteItem] = useState<boolean>(false) // Valide la suppression d'un document
    const [data, setData] = useState<DataType[]>([]) // récupère tous les documents de la collection
    const [refresh, setRefresh] = useState<boolean>(false) // Permet de provoquer un rendu après modification dans la database


    useMemo(() => {
        console.log("State addModalVisible in UserHome: ", addModalVisible)
    }, [addModalVisible])

    useMemo(() => {
        console.log("State modifButtons in UserHome: ", modifButtons)
    }, [modifButtons])

    useMemo(() => {
        console.log("State updateModalVisible in UserHome: ", updateModalVisible)
    }, [updateModalVisible])

    useMemo(() => {
        console.log("State deleteItem in UserHome: ", deleteItem)
    }, [deleteItem])



    function onAuthStateChanged(user: any) {
        if (user) {
            setUserId(user.uid)
        }
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
                refresh ? setRefresh(false) : null

            }).catch(error => console.log(error))
        return (() => setData([]))
    }, [refresh])


    const handleDeleteItem = () => {
        if (deleteItem) {
            setDeleteItem(false)
            deleteDocument(itemIdToDelete)
            setRefresh(true)
        }
    }
    handleDeleteItem()


    return (
        <SafeAreaView style={styles.container}>
            <AddForm
                userID={userId}
                addModalVisible={addModalVisible}
                getAddModalVisible={(param) => setAddModalVisible(param)}
                addFormRefresh={refresh}
                getAddFormRefresh={(param) => setRefresh(param)}
            />

            <UpdateForm
                updateModalVisible={updateModalVisible}
                item={itemToModify}
                getUpdateModalVisible={(param) => setUpdateModalVisible(param)}
                updateFormRefresh={refresh}
                getUpdateFormRefresh={(param) => setRefresh(param)}
            />

            <View style={styles.headerContainer}>
                <View style={styles.pictureBox}>

                </View>

                <View style={styles.txtBtnBox}>
                    <View>
                        <Text style={styles.text}>{email != "" ? email : userEmail}</Text>
                    </View>
                    <View style={styles.containerBtn}>

                        <TouchableOpacity style={styles.btnUpload} onPress={() => setAddModalVisible(true)}>
                            <AntDesign name="addfile" size={30} color="#2c3e50" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnUpload} onPress={() => navigation.navigate("UserGallery")}>
                            <Entypo name="upload" size={30} color="#2c3e50" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnUpload} onPress={() => navigation.navigate("UserDatabaseGallery", { userImages: [] })}>
                            <Entypo name="folder-images" size={30} color="#2c3e50" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnLogout} onPress={() => {
                            auth()
                                .signOut()
                                .then(() => {
                                    isLoggedIn === STACKCHOICE.LOGGED && setIsLoggedIn(STACKCHOICE.SIGN_IN)
                                    console.log('User signed out!')

                                    // setUserEmail("")    // =>  Réinitialisation les données à la déconnection
                                    // setUserUID("")    // =>  Réinitialisation les données à la déconnection
                                    navigation.navigate("Connection")
                                })
                        }}>
                            <AntDesign name="logout" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.datasContainer}>
                <ModifButtons
                    visibleButtons={modifButtons}
                    getButtons={(param) => setModifButtons(param)}
                    getModifForm={(param) => setUpdateModalVisible(param)}
                    getDelete={(param) => setDeleteItem(param)}
                />

                {data != [] ?
                    <ScrollView>
                        {
                            data.filter(item => userUid ? item.userId == userUid : item.userId == userUID).map((item, i) => (
                                <TouchableOpacity style={styles.containerData} key={i} onLongPress={() => {
                                    console.log("suppression or modification ?")
                                    item.id ? setItemIdToDelete(item.id) : null
                                    setItemToModify(item)
                                    setModifButtons(true)
                                }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.dataText}>Nom: </Text>
                                        <Text style={{ color: "black" }} >{item.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.dataText}>Login: </Text>
                                        <Text style={{ color: "black" }} >{item.login}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.dataText}>Mots de passe: </Text>

                                        {/* Password: composant créé pour gérer l'affichage ou non des mots de passes */}

                                        <Password value={item.password} />
                                        {/* <Text>{eyeToggle ? item.password : '*'.padStart(item.password.length, '*')}</Text> */}
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
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    containerData: {
        width: 320,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#2c3e50",
        marginVertical: 10,
        padding: 10

    },

    text: {
        color: "black",
        fontSize: 18,
        fontStyle: "italic",
        fontWeight: "bold",
        textAlign: "center"
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

    pictureBox: {
        width: 100,
        height: 100,
        backgroundColor: "green",
        marginEnd: 5
    },
    headerContainer: {
        width: "98%",
        flexDirection: "row"
    },

    containerBtn: {
        flexDirection: "row",
        justifyContent: "space-around"
    },

    btnUpload: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#2c3e50",
        borderRadius: 5
    },

    btnLogout: {
        width: 45,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#2c3e50",
        borderRadius: 5,
        marginLeft: 15,
        backgroundColor: "#2c3e50"
    },

    txtBtnBox: {
        width: "70%",
        justifyContent: "space-around"
    }
})

export default UserHome