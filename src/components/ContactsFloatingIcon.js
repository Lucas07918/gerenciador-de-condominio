import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import  MaterialIcons  from "react-native-vector-icons/MaterialIcons";

export default function ContactsFloatingIcon() {
    const navigation = useNavigation()
    return(
        <TouchableOpacity 
        onPress={() => navigation.navigate("Contacts")}
        style={{
            position: "absolute",
            right: 20,
            bottom: 80,
            borderRadius: 60,
            width: 60,
            height: 60,
            backgroundColor: "#19ba67",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <MaterialIcons 
            name="message" 
            size={30} 
            color="white" 
            style={{transform: [{ scaleX: -1 }] }} />
        </TouchableOpacity>
    )
}