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
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { database } from "../../config/firebase.js";
import ContactsFloatingIcon from "../components/ContactsFloatingIcon";


 const Messages = [
  {
    id: '1',
    userName: 'Tracy Mcconell',
    userImg: require('../assets/users/tracy-mcconnell.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'Marshall Eriksen',
    userImg: require('../assets/users/marshall-eriksen.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Barney Stinson',
    userImg: require('../assets/users/barney-stinson.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Lily Audrin',
    userImg: require('../assets/users/lily-aldrin.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '5',
    userName: 'Robin Scherbatsky',
    userImg: require('../assets/users/robin-scherbatsky.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

const MessageScreen = () => {
  const navigation = useNavigation();
  const {userInfo} = useContext(AuthContext)

  /*useEffect( () => {

    console.log(userInfo.bloco)
    console.log(userInfo.num_apart)
     const salasRef = collection(database, "Salas");
     const consulta = query(salasRef, where('bloco','==', userInfo.bloco), where('num_apart','==',userInfo.num_apart))
 
     //console.log(getDocs(q))
     
     const resposta = async () => await getDocs(consulta);
     resposta().then((respostaPesquisa)=> {
       //console.log(respostaPesquisa.docs)
       const data = [];
       respostaPesquisa.docs.forEach((doc)=>{
         data.push(doc.data())
       })
       setTasks(data)
     }).catch((erro)=>{
       console.log(erro)
     })
 
     return () => {
       resposta();
     };
   }, []);*/

    return(
        <Container>
            <FlatList
                data={Messages}
                keyExtractor={item=>item.id}
                renderItem={({item}) => (
                    <Card onPress={() => navigation.navigate('Chat', {userName:item.userName})} >
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