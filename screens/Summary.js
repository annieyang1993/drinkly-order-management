import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useMemo, useEffect} from 'react';
import { Dimensions, TouchableOpacity, StyleSheet, ScrollView, Text, View, TextInput, KeyboardAvoidingView, FlatList, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {Firebase, db} from '../config/firebase';
// import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
// import client from '../api_util/mobile_api_util.js';
import AuthContext from '../context/Context'
// //import { createConsumer } from '@rails/actioncable';
// import ActionCable from 'react-native-actioncable'

// global.addEventListener = () => {};
// global.removeEventListener = () => {};



//const auth = Firebase.auth();

export default function SummaryScreen({navigation}) {
  const authContext = useContext(AuthContext);
  //const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  // const { user } = useContext(AuthenticatedUserContext);
  // const [channel, setChannel] = useState();
  // // const [orders, setOrders] = useState([]);
  // const [newOrders, setNewOrders] = useState([]);
  // const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString({hour: '2-digit', minute:'2-digit', second: '0-digit'}));
  // const CableApp = {}
  // var intervalId = 0;
  // var notAccepted = 0;
  // var accepted = 0;
  // var filled = 0;
  // var completed = 0;

  // const acceptOrder = async (id, date, restaurant_id) =>{
  //   const response = await client.patch(`/order_sessions/${id}`, {accepted: true, accepted_at: date})
  //   refreshAcceptedOrders(restaurant_id);
  //   refreshNewOrders(restaurant_id);
  // }

  // const refreshAcceptedOrders = async (restaurant_id) =>{
  //     const response = await client.get(`/order_sessions/accepted_orders/${restaurant_id}`, {restaurant_id: restaurant_id});
    
  //     authContext.setAcceptedOrders(Object.values(response.data));
  // }

  // const refreshNewOrders = async (restaurant_id) =>{
  //   const response = await client.get(`/order_sessions/new_orders/${restaurant_id}`, {restaurant_id: restaurant_id});
  //   if (response.ok){
  //     console.log("NEW ORDERS", restaurant_id, response.data)
  //     setNewOrders(Object.values(response.data));
  //   } else{
  //     console.log("ERROR", response.error)
  //   }
    
  // }

  // const setUpChannel = async (id) =>{
  //       const consumer2 = ActionCable.createConsumer(`ws://localhost:3000/cable/`);
  //       const channel = consumer2.subscriptions.create({channel: "OrdersChannel", restaurant_id: id},
  //        {received(data){
  //          console.log("DATA", data);

  //          refreshNewOrders(id);
           
  //         //  var newOrdersDup = newOrders
  //         //    setNewOrders(newOrdersDup.push(data))
          
  //         }});
  //       setChannel(channel);
  //       intervalId = setInterval(()=>{
  //       setCurrentTime(new Date().toLocaleTimeString({hour: '2-digit', minute:'2-digit', second: '0-digit'}))
  //       refreshNewOrders(id);
      
  //   }, 60000)
  // }
  // const getCurrentRestaurant = async ()=>{
  //   console.log("UID", user.uid)
  //       const response = await client.get(`/restaurant_users/${user.uid}`)
  //       console.log(response)
  //       if (response.ok){
  //         console.log("RESPONSE", response.data)
  //         const id = Object.values(response.data)[0].restaurant_id;
  //         console.log("ID HERE", id)
  //         authContext.setRestaurantId(id);
  //         setUpChannel(id);
  //         refreshAcceptedOrders(id);
  //         refreshNewOrders(id);
  //       } else{
  //         console.log(response.errors)
  //       }
        
  //   }


  // var newList = [];
  // var progressList = [];
  // var completedList = [];
  // const acceptOrder = async (order, index) => {
  //   var set = true;
  //   try{
  //     await Firebase.firestore().collection('restaurants').doc(order["restaurant_id"]).collection('orders').doc(order["order_id"]).update({
  //     accepted: true,
  //     accepted_at: new Date()
  //   }, {merge: true})
  //   } catch (error) {
  //     set = false;
  //   } 
  //   ///FIX THIS!!!
  //   if (set===true){
  //     const id = order.order_id;
  //     const ordersTemp = authContext.orders
  //     ordersTemp[index]["accepted"] = true;
  //     authContext.setOrders(ordersTemp);
  //   }
  // }

  
  return (
    
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 12, color: 'black'}}>
        <Text style = {{fontSize: 20, fontWeight: 'bold', width: '100%', alignSelf: 'flex-start'}}>Today's Summary</Text>            
        </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{height: '100%', width: '100%'}}>
        {authContext.currentTime > new Date(new Date().setHours(authContext.closingHour, authContext.closingMinute, 0)) ? <View>

          <Text style={{fontSize: 20, width: '90%', fontWeight: 'bold', alignSelf: 'center'}}>Sales</Text>

          <View style={{alignItems: 'center', width: '85%', marginTop: 20, alignSelf: 'center', padding: 15, borderRadius: 10, backgroundColor: 'white', shadowColor: 'gray', alignSelf: 'center', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
          <Text style={{color: 'gray', fontSize: 18}}>${authContext.rounded(authContext.totalDollars).toFixed(2)} Total Sales</Text>
          <Text style={{color: 'gray', fontSize: 18}}>-${authContext.rounded(authContext.totalDollars*0.029 + 0.30*authContext.totalNumber).toFixed(2)} Commission</Text>
          <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, width: '100%', height: 10}}></View>
          <Text style={{color: 'gray', fontSize: 18, fontWeight: 'bold', color: 'green', marginTop: 20}}>${authContext.rounded(authContext.totalDollars - (authContext.totalDollars*0.029 + 0.30*authContext.totalNumber)).toFixed(2)} Net Sales</Text>
          </View>

          <View style={{alignItems: 'center', width: '85%', marginTop: 20, alignSelf: 'center', padding: 15, borderRadius: 10, backgroundColor: 'white', shadowColor: 'gray', alignSelf: 'center', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
          <Text style={{color: 'gray', fontSize: 18}}>{authContext.totalNumber} Orders</Text>
          <View style={{borderBottomColor: 'gray', borderBottomWidth: 1, width: '100%', height: 10}}></View>
          <Text style={{color: 'gray', fontSize: 18, fontWeight: 'bold', color: 'green', marginTop: 20}}>${authContext.rounded((authContext.totalDollars - (authContext.totalDollars*0.029 + 0.30*authContext.totalNumber))/authContext.totalNumber).toFixed(2)} Avg Per Size</Text>
          </View>

          <Text style={{fontSize: 20, width: '90%', fontWeight: 'bold', alignSelf: 'center', marginTop: 20}}>Items sold</Text>

          <View style={{alignItems: 'center', width: '85%', marginTop: 20, alignSelf: 'center', padding: 15, borderRadius: 10, backgroundColor: 'white', shadowColor: 'gray', alignSelf: 'center', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>

          {Object.keys(authContext.itemGrouping).map((itemName, i)=>{
            return (<Text key={i} style={{fontSize: 16, color: 'gray'}}>{itemName}: {authContext.itemGrouping[itemName]}</Text>)
          })}

          </View>

          <Text style={{fontSize: 20, width: '90%', fontWeight: 'bold', alignSelf: 'center', marginTop: 20}}>Add-ons and Preferences</Text>

          <View style={{alignItems: 'center', width: '85%', marginTop: 20, alignSelf: 'center', padding: 15, borderRadius: 10, backgroundColor: 'white', shadowColor: 'gray', alignSelf: 'center', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>


          {Object.keys(authContext.toppingGrouping).map((toppingName, i)=>{
            return (<Text key={i} style={{fontSize: 16, color: 'gray'}}>{toppingName}: {authContext.toppingGrouping[toppingName]}</Text>)
          })}

          </View>
        </View> : <View style={{alignItems: 'center', marginTop: '50%'}}>
          <Text>Stats will be calculated after store close.</Text></View>}
        
            
      </ScrollView>
    </View>
  );
}

            


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 0,
    alignItems: 'center'

  },

  container2: {
    flex: 1,
    backgroundColor: 'white',

  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff'
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#fff'
  },


  messages: {
    flex: 1,
  },
  message: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 8,
  },
  form: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 75,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
});