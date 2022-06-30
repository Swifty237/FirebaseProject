import React, { useState } from "react"
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"



type onChangeType = (entry: string) => any
type onBlurType = () => any

export type InputProps = {
    placeholder: string
    value: any
    label: string
    error: string | undefined
    onChangeText: onChangeType
    onBlur: onBlurType
    keyBoardNumeric?: boolean
    icon?: boolean
}

const Input = ({ label, placeholder, value, onChangeText, error, onBlur, keyBoardNumeric, icon }: InputProps) => {

    const [eyeOff, setEyeOff] = useState<boolean>(true)

    return (
        <View style={styles.container}>
            <Text style={styles.labelStyle}>{label}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    keyboardType={keyBoardNumeric ? "numeric" : "default"}
                    placeholderTextColor="#bdc3c7"
                    secureTextEntry={(label === "password" || "confirmPassword") && eyeOff && icon ? true : false} />

                <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => setEyeOff(!eyeOff)}>
                    <Text>
                        {(label === "password" || "confirmPassword") && icon ? <Icon name={eyeOff ? "eye-off" : "eye"} size={30} color="grey" /> : null}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>{error}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10
    },

    inputContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 5,
        paddingEnd: 10
    },

    input: {
        width: 300,
        height: 45,
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

export default Input