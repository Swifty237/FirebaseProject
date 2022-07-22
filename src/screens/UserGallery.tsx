import React, { useEffect, useState, useMemo } from "react"
import { StyleSheet, View, SafeAreaView, TouchableOpacity, PermissionsAndroid, Image, FlatList } from "react-native"
import CameraRoll from "@react-native-community/cameraroll"
import Btn from "../components/Btn"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { HomeStackParamList } from "../components/Home"



type UserGalleryNavigationProp = { navigation: NativeStackNavigationProp<HomeStackParamList, "UserGallery"> }

const UserGallery: React.FunctionComponent<UserGalleryNavigationProp> = ({ navigation }): JSX.Element => {

    const [imageUpload, setImageUpload] = useState<CameraRoll.PhotoIdentifier[]>([])
    const [result, setResult] = useState<CameraRoll.PhotoIdentifier[]>([])
    const [visible, setVisible] = useState<boolean>(false)

    const hasAndroidPermission = async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        const hasPermission = await PermissionsAndroid.check(permission)
        console.log("hasPermission: ", hasPermission)

        if (hasPermission) {
            return true
        }

        const status = await PermissionsAndroid.request(permission, {
            title: "Access Gallery app permissions",
            message: "Image Gallery needs your permission to access your photos",
            buttonPositive: "Ok"
        })
        return status === "granted"
    }

    // Installation du module fbjs au préalable sinon => error: Error: Unable to resolve module fbjs/lib/invariant...
    const getPictures = () => {
        const photos = CameraRoll.getPhotos({
            first: 100,
            assetType: "Photos"
        })

        photos
            .then(photo => {
                setImageUpload(photo.edges.map(item => item))
            })
    }

    const handleSelection = (item: CameraRoll.PhotoIdentifier) => {

        if (result.includes(item)) {
            setResult(result.filter(element => element !== item))
        }
        else {
            setResult([...result, item])
        }
    }

    const isSelected = (item: CameraRoll.PhotoIdentifier): boolean => {
        return result.includes(item)
    }

    const renderItem = ({ item }: { item: CameraRoll.PhotoIdentifier }): JSX.Element => {
        const itemSelected = isSelected(item)


        return (
            <TouchableOpacity
                onLongPress={() => {
                    handleSelection(item)
                }}
                style={itemSelected ? styles.selectedBoxImage : styles.boxImage}>
                <Image source={{ uri: item.node.image.uri }} style={itemSelected ? styles.selectedImage : styles.image} />
            </TouchableOpacity>
        )

    }

    const handleButton = () => {
        if (result.length != 0) {
            setVisible(true)
        }
        else {
            setVisible(false)
        }
    }

    useMemo(() => {
        handleButton()
    }, [result])




    useEffect(() => {
        hasAndroidPermission()
            .then(() => {
                getPictures()
            })
            .catch(err => {
                console.error(err)
            })
    }, [])



    return (
        <SafeAreaView style={styles.container}>
            {visible &&
                <View style={styles.register}>
                    <Btn label="Téléverser" onPress={() => {
                        navigation.navigate("UserDatabaseGallery", { userImages: result })
                        setVisible(false)
                        setResult([])
                    }}
                        textStyle={styles.button} />
                </View>
            }

            {imageUpload.length != 0 &&
                <FlatList
                    data={imageUpload}
                    numColumns={2}
                    initialNumToRender={20}
                    renderItem={renderItem}
                    keyExtractor={item => item.node.timestamp.toString()}
                    ItemSeparatorComponent={() => (<View style={styles.separator} />)}
                />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginTop: 10
    },

    separator: {
        borderWidth: 2,
        marginTop: 5,
        borderColor: "transparent"
    },

    boxImage: {
        marginHorizontal: 5,
    },

    selectedBoxImage: {
        marginHorizontal: 5,
        borderWidth: 5,
        borderColor: "#3498db"
    },

    image: {
        width: 150,
        height: 150
    },

    selectedImage: {
        width: 140,
        height: 140
    },

    button: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15
    },

    register: {
        backgroundColor: "#2c3e50",
        height: 50,
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#2c3e50",
        width: "96%",
        marginBottom: 10
    },
})

export default UserGallery