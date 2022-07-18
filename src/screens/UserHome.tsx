import React, { useEffect, useState, useContext, useMemo } from "react"
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import Btn from "../components/Btn"
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


            <Text style={styles.text}>Bonjour {email != "" ? email : userEmail}</Text>

            <View style={styles.btnContainer}>
                <View style={styles.register}>
                    <Btn label="Nouvel enregistrement" textStyle={styles.btnLabel} onPress={() => setAddModalVisible(true)} />
                </View>

                <View style={styles.logOut}>
                    <Btn label="Deconnexion" textStyle={styles.btnLabel} onPress={() => {
                        auth()
                            .signOut()
                            .then(() => {
                                isLoggedIn ? setIsLoggedIn(false) : null
                                console.log('User signed out!')

                                setUserEmail("")    // =>  Réinitialisation les données à la déconnection
                                setUserUID("")    // =>  Réinitialisation les données à la déconnection
                                navigation.navigate("Connection")
                            })
                    }} />
                </View>
            </View>
            <View style={styles.datasContainer}>
                <ModifButtons
                    visibleButtons={modifButtons}
                    getButtons={(param) => setModifButtons(param)}
                    getModifForm={(param) => setUpdateModalVisible(param)}
                    getDelete={(param) => setDeleteItem(param)}
                //getResetForm={(param) => setResetForm(param)}
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

                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={styles.dataText}>Mots de passe: </Text>

                                        {/* Password: composant créé pour gérer l'affichage ou non des mots de passes */}
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
        </SafeAreaView >
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

    datasContainer: {
        flex: 1,
        alignItems: "center"
    },

    dataText: {
        color: "black",
        fontWeight: "bold",
        textAlignVertical: "center"
    }
})

export default UserHome