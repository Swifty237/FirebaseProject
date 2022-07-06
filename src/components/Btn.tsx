import React from "react";
import { TouchableOpacity, Text } from "react-native"

type ButtonProps = {
    label: string
    textStyle: {}
    onPress: () => void
}

const Btn: React.FunctionComponent<ButtonProps> = ({ label, textStyle, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} >
            <Text style={textStyle}>{label}</Text>
        </TouchableOpacity>
    )
}

export default Btn