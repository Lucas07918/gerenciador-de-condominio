import React, { useEffect, useState } from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { auth, database } from "../../config/firebase.js";
import { collection, query, where, getDocs } from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import { Container, Card, UserInfo, UserImgWrapper, UserImg, UserInfoText, UserName, PostTime, MessageText, TextSection } from "../styles/MessageStyles";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";
import Avatar from "../components/Avatar.js";


export default function ContactsScreen({ type, description, user, style, time, room, image }) {
  const [contacts, setContacts] = useState([]);
  const {userInfo} = useContext(AuthContext)
  const navigation = useNavigation();

  useEffect(() => {
    console.log(userInfo)
    const fetchContacts = async () => {
        const userRef = collection(database, "Usuario");
        const consulta = query(userRef, where('email','!=', userInfo.email))

        const resposta = async () => await getDocs(consulta);
        resposta().then((respostaPesquisa)=> {
        const data = [];
        respostaPesquisa.docs.forEach((doc)=>{
            
            data.push(doc.data())
        })
            setContacts(data);
        }).catch((erro)=>{
            console.log(erro)
        })
    };

    fetchContacts().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={true}
        data={contacts}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("Chat", { user, room, image })}>
              <Card onPress={() => navigation.navigate("Chat", item)}>
                <UserInfo>
                  <UserImgWrapper>
                    <Avatar size={50} />
                  </UserImgWrapper>
                  <TextSection>
                    <UserInfoText>
                      <UserName>{item.nome}</UserName>
                      {time && <PostTime>{new Date(time.seconds * 1000)}</PostTime>}
                    </UserInfoText>
                  </TextSection>
                </UserInfo>
              </Card>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  Tasks: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  },
  deleteTask: {
    justifyContent: "center",
    paddingLeft: 15
  },
  DescriptionTask: {
    width: "75%",
    alignContent: "flex-start",
    backgroundColor: "#f5f5f5cf",
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 5,
    marginRight: 15,
    color: "#282b2db5"
  },
  label: {
    width: "90%",
    marginTop: 20,
    fontSize: 16,
    marginLeft: 20,
    color: "#F92E6A"
  },
  input: {
    width: "90%",
    marginTop: 10,
    padding: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#F92E6A",
    marginLeft: "auto",
    marginRight: "auto"
  },
  buttonNewTask: {
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "#F92e6a",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  iconButton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
