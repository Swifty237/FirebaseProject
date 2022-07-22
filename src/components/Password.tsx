import React, { useState } from "react"
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"



export type InputProps = {
    value: string
}

const Password: React.FunctionComponent<InputProps> = ({ value }) => {

    const [eyeOff, setEyeOff] = useState<boolean>(true)

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    secureTextEntry={eyeOff}
                    editable={false} />

                <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => setEyeOff(!eyeOff)}>
                    <Text>
                        <Icon name={eyeOff ? "eye-off" : "eye"} size={25} color="#2c3e50" />
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1
    },

    inputContainer: {
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#2c3e50",
        borderRadius: 5,
        justifyContent: "space-between"
    },

    input: {
        height: 40,
        color: "black"
    },

    text: {
        color: "red",
        fontSize: 10,
        marginTop: 3,
        paddingLeft: 10,
        width: 300
    },

    labelStyle: {
        color: "black",
        marginStart: 10,
        marginBottom: 5,
        fontWeight: "bold"
    }
})

export default Password