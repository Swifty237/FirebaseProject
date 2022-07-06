import React, { useState } from "react"
import { DataType } from "../screens/UserHome"
import { TouchableOpacity, TextInput, StyleSheet, View, Modal, Text } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"




const renderItem = ({ item }: { item: DataType }) => {
    //const [eyeOff, setEyeOff] = useState<boolean>(true)

    return (
        <TouchableOpacity style={styles.containerData}>
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
                <TextInput style={{ color: "black" }} editable={false} secureTextEntry>{item.password}</TextInput>
                <TouchableOpacity style={{ justifyContent: "center" }}>
                    <Text style={{ textAlignVertical: "center", marginStart: 5 }}>
                        <Icon name="eye-off" size={20} color="grey" />
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.dataText}>Type: </Text>
                <Text style={{ color: "black" }} >{item.type}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerData: {
        marginVertical: 20
    },

    dataText: {
        color: "black",
        fontWeight: "bold",
        textAlignVertical: "center"
    }
})

export default renderItem