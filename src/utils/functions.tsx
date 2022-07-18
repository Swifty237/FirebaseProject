import React from "react"
import firestore from "@react-native-firebase/firestore"


export const deleteDocument = (item: string): void => {
    console.log("=> deleteDocument (function)")

    firestore()
        .collection("data")
        .get()
        .then(querySnapshot => {

            console.log("=> get querySnapshot (UserHome function - deleteDocument)")

            querySnapshot.forEach((snapshot) => {

                if (snapshot.exists) {
                    firestore()
                        .collection("data")
                        .doc(snapshot.id)
                        .onSnapshot((documentShot) => {

                            if (documentShot.exists && documentShot.data()?.id === item) {
                                console.log("item to delete name:", documentShot.data()?.name)


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
            console.log("=> querySnapshot (UserHome function - deleteDocument)")
        }).catch(err => console.error(err))
    console.log("=> exit deleteDocument (function)")
}



// addDocumentId est un fonction qui permet de récupérer l'ID d'un document et de le rajouter dans le champ "id" s'il est vide
// Cette fonction est utiliser pour l'ajout d'un nouveau document car au départ le document est ajouter avec le champ "id" vide
export const addDocumentId = (): void => {

    console.log("addDocumentId (UserHome function)")

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

    console.log("=> exit addDocumentId (UserHome function)")
}