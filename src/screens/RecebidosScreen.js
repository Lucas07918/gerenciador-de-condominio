import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { database } from "../../config/firebase.js";
import { StyleSheet } from 'react-native'
import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";

const RecebidosScreen = () => {
    const [tasks, setTasks] = useState([]);
    const {userInfo} = useContext(AuthContext)
  

  useEffect( () => {

    console.log(userInfo.bloco)
    console.log(userInfo.num_apart)
     const pedidosRef = collection(database, "Recebidos");
     const consulta = query(pedidosRef, where('bloco','==', userInfo.bloco), where('num_apart','==',userInfo.num_apart))
 
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
 
     
 
     // const unsubscribe = onSnapshot(collection(database, "Pedidos"), (snapshot) => {
     //   const taskList = snapshot.docs.map((doc) => ({
     //     id: doc.id,
     //     ...doc.data(),
     //   }));
     //   setTasks(taskList);
     // });
 
     return () => {
       resposta();
     };
   }, []);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={tasks}
        renderItem={({ item }) => {
            return(
          <View style={styles.Tasks}>
            
            <Text
              style={styles.DescriptionTask}
              onPress={() =>
                navigation.navigate("Details", item)
              }
            >
                {`${item.delivery} - ${item.bloco} - ${item.num_apart}`}
             
            </Text>
          </View>
            )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fff",
      paddingTop: 20
   },
   Tasks:{
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:5
   },
   deleteTask:{
     justifyContent:"center",
     paddingLeft:15,
   },
   DescriptionTask:{
    width:"75%",
    alignContent:"flex-start",
    backgroundColor:"#f5f5f5cf",
    padding:12,
    paddingHorizontal: 20,
    borderRadius:5,
    borderLeftWidth: 5,
    borderLeftColor: "#3e92d1",
    marginBottom: 5,
    marginRight:20,
    color:"#282b2db5",
   },
   buttonNewTask:{
    width:60,
    height:60,
    position:"absolute",
    bottom: 30,
    right:20,
    backgroundColor:"#3e92d1",
    borderRadius:50,
    justifyContent:"center",
    alignItems: "center"
   },
   iconButton:{
    color:"#ffffff",
    fontSize:25,
    fontWeight:"bold",
   },
  });



export default RecebidosScreen;