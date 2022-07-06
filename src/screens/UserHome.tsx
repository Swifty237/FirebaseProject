import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, SafeAreaView, Modal, FlatList, ScrollView } from "react-native"
import Btn from "../components/Btn"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import Input from "../components/Input"
import { Formik } from "formik"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"
import renderItem from "../components/Card"




type UserHomeProps = NativeStackScreenProps<RootStackParamList, "UserHome">

export type DataType = {
    userId: string
    login: string
    name: string
    password: string
    type: string
}


const UserHome: React.FunctionComponent<UserHomeProps> = ({ navigation, route }) => {
    const { email, user } = route.params
    const db = firestore().collection("data")

    const [modalVisible, setModalVisible] = useState(false)
    const [userId, setUserId] = useState()
    const [data, setData] = useState<DataType[]>()

    db.get()
        .then(querySnapshot => {

            let items: DataType[] = []
            querySnapshot.forEach((snapshot) => {

                items.push(snapshot.data() as DataType)
            })
            setData(items)

        }).catch(error => console.log(error))


    function onAuthStateChanged(user: any) {
        user ? setUserId(user.uid) : null
    }

    useEffect(() => {
        auth().onAuthStateChanged(onAuthStateChanged)
    }, [])


    return (
        <SafeAreaView style={styles.container}>
            <Formik
                initialValues={{ name: "", login: "", password: "", type: "" }}
                onSubmit={values => {
                    setModalVisible(false)
                    db.add({
                        userId: userId,
                        name: values.name,
                        login: values.login,
                        password: values.password,
                        type: values.type
                    })
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
                                    error={errors.name} />

                                <Input
                                    label="Login"
                                    placeholder="Entrez le login"
                                    value={values.login}
                                    onChangeText={handleChange("login")}
                                    onBlur={() => handleBlur("login")}
                                    error={errors.login} />

                                <Input
                                    label="Mot de passe"
                                    placeholder="Entrez le mot de passe"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={() => handleBlur("password")}
                                    error={errors.password} />

                                <Input
                                    label="Type"
                                    placeholder="Entrez le type d'application"
                                    value={values.type}
                                    onChangeText={handleChange("type")}
                                    onBlur={() => handleBlur("type")}
                                    error={errors.type} />
                            </ScrollView>

                            <View style={styles.btnContainer}>
                                <View style={styles.register}>
                                    <Btn label="Enregistrer" textStyle={styles.btnLabel} onPress={handleSubmit} />
                                </View>
                                <View style={styles.cancel}>
                                    <Btn label="Annuler" textStyle={styles.btnLabel} onPress={() => setModalVisible(false)} />
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
                            <FlatList
                                style={styles.listStyle}
                                data={data ? data.filter((item: DataType) => item.userId == user) : null}
                                keyExtractor={item => item.name}
                                renderItem={renderItem}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
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

    listStyle: {
        width: "90"
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
        marginVertical: 15
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

    separator: {
        borderWidth: 2,
        marginTop: 5,
        borderColor: "gray"
    }
})

export default UserHome