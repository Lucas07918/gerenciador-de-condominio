import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { 
    Container,
    Card,
    UserInfo,
    UserImgWrapper,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
 } from "../styles/MessageStyles";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs, or } from "firebase/firestore";
import { database } from "../../config/firebase.js";
import ContactsFloatingIcon from "../components/ContactsFloatingIcon";
import { useState } from "react";



const MessageScreen = () => {
  const navigation = useNavigation();
  const [rooms,setRooms] = useState([])
  const {userInfo} = useContext(AuthContext)

  useEffect( () => {

  const users = [];
  const userRef = collection(database, "Usuario");
  const consultaUser = query(userRef)
  
  const userResposta = async () => await getDocs(consultaUser);
  userResposta().then((respostaPesquisa)=> {
    respostaPesquisa.docs.forEach((doc)=>{
      users.push(doc.data())
    })})

    ///
    console.log(userInfo.bloco)
    console.log(userInfo.num_apart)
     const salasRef = collection(database, "Salas");
     const consulta = query(salasRef, 
        or(where('user_email','==', userInfo.email), where('contact_email','==',userInfo.email))
        
      )
 
     //console.log(getDocs(q))
     
     const resposta = async () => await getDocs(consulta);
     resposta().then((respostaPesquisa)=> {
       console.log(respostaPesquisa.docs.length)
       const data = [];
       console.log('Users2',users)
       respostaPesquisa.docs.forEach((doc,index)=>{
         console.log(doc.data())

        const userContact = doc.data().user_email === userInfo.email 
        ? doc.data().contact_email 
        : doc.data().user_email; 

        const currentContact = users.filter((user)=>user.email === userContact).pop();
        
          
         data.push({
          id: index +1,
          userName: currentContact.nome,
          bloco:'bloco',
          email: userContact,
          nome:currentContact.nome,
          num_apart:' n  apart',
          userImg: require('../assets/users/None-user.jpg'),
          //messageTime: '4 mins ago',
          messageText:
            'Continuar conversa',
        })
       })
       setRooms([...data])
      // setTasks(data)
     }).catch((erro)=>{
       console.log(erro)
     })
    ///
   

  


   
 
     return () => {
      // resposta();
     };
   }, []);

    return(
        <Container>
            <FlatList
                data={rooms}
                keyExtractor={item=>item.id}
                renderItem={({item}) => (
                    <Card onPress={() => navigation.navigate('Chat', item)} >
                      <UserInfo>
                        <UserImgWrapper>
                          <UserImg source={item.userImg} />
                        </UserImgWrapper>
                        <TextSection>
                          <UserInfoText>
                            <UserName>{item.userName}</UserName>
                            <PostTime>{item.messageTime}</PostTime>
                          </UserInfoText>
                          <MessageText>{item.messageText}</MessageText>
                        </TextSection>
                      </UserInfo>
                    </Card>
                )}
            />
            <ContactsFloatingIcon />
        </Container>
    );
}


export default MessageScreen;