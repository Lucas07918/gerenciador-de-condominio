import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import  Icon  from "react-native-vector-icons/MaterialCommunityIcons";
import  FontAwesome  from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../context/authContext";
import { addDoc, and, collection, getDocs, or, orderBy, query, where } from "firebase/firestore";
import { database } from "../../config/firebase";

const ChatScreen = ({route}) => {
    const [messages, setMessages] = useState([]);
    const [hasRoom, setHasRoom] = useState(false);
    const [roomId, setRoomId] = useState(undefined)
    const contact = route.params;
    const {userInfo} = useContext(AuthContext)

    /*useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: 'Tô bem, obrigado por perguntar!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
            _id: 2,
            text: 'Eai, como vc tá?',
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
      ]);
    }, []);*/

    useEffect( () => {

      console.log(userInfo.email)
      console.log('contact', contact)
      const salasRef = collection(database, "Salas");
      /*const consulta = query(salasRef, 
        and(
          where('user_email','==', userInfo.email),
          where('contact_email','==', contact.email),
          or(
            where('user_email','==', contact.email ),
            where('contact_email','==', userInfo.email)
          )
        )
      );*/

      const consulta = query(salasRef, and(
        or(
          where("user_email","==", userInfo.email), 
          where("contact_email","==", userInfo.email)
        ),
        or(
          where("user_email","==", contact.email), 
          where("contact_email","==", contact.email)
        )
      ))

      //where('user_email','==', contact.email),
      //   or(where('user_email','==', contact.email), where('contact_email','==',userInfo.email)) 
   
       //console.log(getDocs(q))
       
       const resposta = async () => await getDocs(consulta);
      resposta().then((respostaPesquisa)=> {
        console.log('quantidade de salas', respostaPesquisa.docs.length)
        if(respostaPesquisa.docs.length === 0){
          setHasRoom(false);
        }else{

          const rooms = respostaPesquisa.docs.filter((doc)=>  
            {
              console.log('############################')
              console.log(userInfo.email, doc.data().user_email)
                if((doc.data().user_email === contact.email ||  doc.data().user_email === userInfo.email) 
                  && (doc.data().contact_email === userInfo.email ||  doc.data().contact_email === contact.email)  
                ){
                  return doc;
                }
            }
          )

          //console.log('Sala', room.pop().id)
          
          const room = rooms?.pop();
          //console.log('room', room)
          setHasRoom(true);
          setRoomId(room.id)
          updateMessages(room.id)

          //console.log(room.data());
        }
        //console.log('resposta',respostaPesquisa.docs)
         /*const data = [];
         respostaPesquisa.docs.forEach((doc)=>{
           data.push(doc.data())
         })*/
         //setTasks(data)
       }).catch((erro)=>{
         console.log(erro)
       })
   
       
       return () => {
         //resposta();
       };
     }, []);

    

    const renderSend = (props) => {
        return(
            <Send {...props} >
                <View>
                    <Icon name='send-circle' size={40} style={{marginBottom: 1, marginRight: 5}} color="#00ef98" />
                </View>
            </Send>
        )
    }

    async function createRoom(message) {
      
        await addDoc(collection(database, "Salas"), {
          user_email: userInfo.email,
          contact_email: contact.email,
        }).then((doc)=>{
          setRoomId(doc.id);
          createMessages(doc.id, message)
          setHasRoom(true)
        }).catch((erro)=>{
          console.log(erro)
        });;
     
    }

    async function createMessages(docId, message) {

      await addDoc(collection(database, "Salas", docId, "Messages"), {
        email: userInfo.email,
        message: message,
        createdAt: new Date()
      }).catch((erro)=>{
        console.log(erro)
      });
   
  }

  async function updateMessages(roomId){

    console.log(roomId);

    const messageRef = collection(database, "Salas", roomId, "Messages" );
          const consulta = query(messageRef, orderBy("createdAt","desc"))
          const messageResponse = async () => await getDocs(consulta);
          messageResponse().then((resp)=> {
            const chatMessages = [];
           
            resp.docs.forEach((doc,index)=>{

              const isUserMessage = doc.data().email === userInfo.email ? true : false;

              chatMessages.push({
                _id: index,
                text: doc.data().message,
                createdAt: new Date(),
                user: {
                  _id: isUserMessage ? 1 : 2,
                  name: contact.email,
                },
              });
            })
            
            setMessages([...chatMessages])
          });
    
  }
  
    const onSend = useCallback((messages = []) => {
     
      const message = messages?.pop()?.text;
      if(message){
        console.log('tem sala?', hasRoom, roomId)
        if(!hasRoom){
          createRoom(message);
        }else{
          createMessages(roomId, message)
          updateMessages(roomId);
        }
      }
      /*setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages),
      );*/
    }, [hasRoom,roomId]);

    const renderBubble = (props) => {
        return(
        <Bubble 
            {...props}
            textStyle={{ right: {color: '#000'}}}
            wrapperStyle={{
                right: {
                    backgroundColor: '#00ef98'
                },
                left: {
                    backgroundColor: '#fff'
                }
            }}
        />
        );
    }

    const scrollToBottomComponent = () => {
        return(
          <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
      }

    return(
        <View style={{backgroundColor: '#d0efdf', flex: 1}}>
        <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      timeTextStyle={{right: {color: '#000'}}}
      showAvatarForEveryMessage={true}
    />
        </View>
    );
}


export default ChatScreen;