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

export default function OrderScreen({navigation}) {
  const authContext = useContext(AuthContext);
  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  // const { user } = useContext(AuthenticatedUserContext);
  // const [channel, setChannel] = useState();
  // // const [orders, setOrders] = useState([]);
  // const [newOrders, setNewOrders] = useState([]);
  // const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString({hour: '2-digit', minute:'2-digit', second: '0-digit'}));
  // const CableApp = {}
  // var intervalId = 0;
  var notAccepted = 0;
  var accepted = 0;
  var filled = 0;
  var completed = 0;

    useEffect(()=>{
      // getCurrentRestaurant();
      
      // var today = new Date();
      // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(); 

      
      // return () => {
      //   clearInterval(intervalId);
      // }
    }, []);

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
  const acceptOrder = async (order, index) => {
    var set = true;
    var accepted_at = new Date();
    try{
      await Firebase.firestore().collection('restaurants').doc(order["restaurant_id"]).collection('orders').doc(order["order_id"]).update({
      accepted: true,
      accepted_at: accepted_at
    }, {merge: true})
    } catch (error) {
      set = false;
    } 

    try{
      await Firebase.firestore().collection('users').doc(order["user_uid"]).collection('orders').doc(order["order_id"]).update({
      accepted: true,
      accepted_at: accepted_at
    }, {merge: true})
    } catch (error) {
      set = false;
    } 
    ///FIX THIS!!!
    if (set===true){
      const id = order.order_id;
      const ordersTemp = authContext.orders
      ordersTemp[index]["accepted"] = true;
      authContext.setOrders(ordersTemp);
    }
  }

  
  return (
    
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 12, color: 'black'}}>
        <Text style = {{fontSize: 20, fontWeight: 'bold', width: '100%', alignSelf: 'flex-start'}}>Today's Active Orders</Text>            
        </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{height: '100%', width: '100%'}}>

        <Text style={{padding: 12, marginTop: 0, fontWeight: 'bold', fontSize: 17}}>New</Text>
            {authContext.orders.map((order, i)=>{
                  var time = (new Date(order["ready_by"]["seconds"]*1000)).toLocaleTimeString().split(":")
                  var displayTime = time[0]+":"+time[1]+" "+time[2].split(" ")[1]
                  var dueIn = ((order["ready_by"]["seconds"]*1000 - (authContext.currentTime.getTime()))/60000).toFixed(0)
                if (order["accepted"]===false && order["filled"]===false && order["completed"]===false){
                    const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
                    notAccepted+=1;
                    return(<View key={i} onPress={async ()=>{
                        const items_list = await getOrder(order);
                        navigation.navigate("Order Page", {order: order, items_list: items_list, status: 'Waiting to be accepted'})}}>
                        <View style={{backgroundColor: '#dff8dd', width: '100%', height: 90, padding: 10, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 0.8,}}>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <Text style={{fontWeight: 'bold', width: '65%'}} numberOfLines={1}>{order["user_first_name"]}</Text>
                                <Text style = {{alignSelf: 'flex-end', fontWeight: 'bold', position: 'absolute', right: 10, color: 'gray'}}>Waiting to accept</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
                                {order["number_of_items"]===1 ? 
                                <Text> - {order["number_of_items"]} item</Text> : <Text> - {order["number_of_items"]} items</Text>}
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                <Text>Ready by - {monthList[new Date(order["ready_by"]["seconds"]*1000).getMonth()]} {new Date(order["ready_by"]["seconds"]*1000).getDate()}, {dateArray[0]+':'+dateArray[1]+' '+dateArray[2].split(' ')[1]}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                <Text>Order placed - Waiting to be accepted</Text>
                            </View>

                            <TouchableOpacity onPress={()=>acceptOrder(order, i)} style={{position: 'absolute', right: 20, top: 40, backgroundColor: '#e1e6e6', padding: 5, paddingHorizontal: 10, borderRadius: 10}}><Text style={{color: 'gray'}}>Accept</Text></TouchableOpacity>
                        </View>
                    </View>) 
                }

            })} 

            {notAccepted === 0 ? <View style={{backgroundColor: '#e8ebeb', paddingVertical: 40, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: 'lightgray'}}><Text style={{alignSelf: 'center', color: 'gray'}}>You have no newly created orders.</Text></View> : null}

             <Text style={{padding: 12, marginTop: 10, fontWeight: 'bold', fontSize: 17}}>Accepted</Text>
            {authContext.orders.map((order, i)=>{
                  var time = (new Date(order["ready_by"]["seconds"]*1000)).toLocaleTimeString().split(":")
                  var displayTime = time[0]+":"+time[1]+" "+time[2].split(" ")[1]
                  var dueIn = ((order["ready_by"]["seconds"]*1000 - (authContext.currentTime.getTime()))/60000).toFixed(0)
                if (order["accepted"]===true && order["filled"]===false && order["completed"]===false){
                    const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
                    accepted+=1;
                    return(<TouchableOpacity key={i} onPress={()=>authContext.getItemsAndAddons(order, authContext.storeData.restaurant_id).then((itemsArr) => navigation.navigate("Order Page", {order: order, itemsArr: itemsArr}))}>
                        <View style={{backgroundColor: dueIn <=5 ? (dueIn <= 1 ? '#f2c9d1': '#f7f6cc') : '#dff8dd' , padding: 10, height: 90, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 1,}}>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                              <View style={{flexDirection: 'row', width: '65%'}}>
                                <Text style={{fontWeight: 'bold'}} numberOfLines={1}>{order["user_first_name"]}</Text>
                                <View>

                                {authContext.statsBool === true ? <Text style={{fontWeight: 'bold', color: 'gray'}}> Store closed</Text> : 
                                dueIn<=5 && dueIn > 0 ? <Text style={{fontWeight: 'bold', color: 'gray'}}> Due in {dueIn} mins</Text>:
                                
                                dueIn <= 0 && dueIn>= 0 ? <Text style={{fontWeight: 'bold', color: 'gray'}}> Due in {(dueIn)*-1} mins</Text>: 
                                dueIn<0 ? <Text style={{fontWeight: 'bold', color: 'red'}}> {(dueIn)*-1} mins past due</Text>: <Text></Text> }
                                </View>
                              </View>
                                <Text style = {{alignSelf: 'flex-end', fontWeight: 'bold', position: 'absolute', right: 10, color: 'gray'}}>Waiting to be filled</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                <Text>Ready by - {monthList[new Date(order["ready_by"]["seconds"]*1000).getMonth()]} {new Date(order["ready_by"]["seconds"]*1000).getDate()}, {dateArray[0]+':'+dateArray[1]+' '+dateArray[2].split(' ')[1]}</Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                <Text>Accepted - Waiting to be filled</Text>
                            </View>
                            <View style={{position: 'absolute', right: 20, top: 40, backgroundColor: '#e1e6e6', padding: 5, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row'}}>
                              <Text style={{color: 'gray'}}>Fill order</Text>
                              <MaterialCommunityIcons name="chevron-right" size={17} color='gray'/>
                            </View>
                        </View>
                    </TouchableOpacity>) 
                } 
            })} 

            {accepted === 0 ? <View style={{backgroundColor: '#e8ebeb', paddingVertical: 40, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: 'lightgray'}}><Text style={{alignSelf: 'center', color: 'gray'}}>You have no accepted orders.</Text></View> : null}

            <Text style={{padding: 12, marginTop: 10, fontWeight: 'bold', fontSize: 17}}>Filled</Text>

            {authContext.orders.map((order, i)=>{
                  var time = (new Date(order["ready_by"]["seconds"]*1000)).toLocaleTimeString().split(":")
                  var displayTime = time[0]+":"+time[1]+" "+time[2].split(" ")[1]
                  var dueIn = ((order["ready_by"]["seconds"]*1000 - (authContext.currentTime.getTime()))/60000).toFixed(0)
                 if (order["filled"]===true && order["completed"]===false){
                   filled +=1;
                    const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
                    return(<TouchableOpacity key={i} onPress={()=>authContext.getItemsAndAddons(order, authContext.storeData.restaurant_id).then((itemsArr) => navigation.navigate("Order Page", {order: order, itemsArr: itemsArr}))}>
                        <View style={{backgroundColor: '#d0eff1', padding: 10, height: 90, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 1,}}>
                            <View style={{flexDirection: 'row', width: '100%'}}>
                                <Text style={{fontWeight: 'bold'}}>{order["user_first_name"]}</Text>
                                <Text style = {{alignSelf: 'flex-end', fontWeight: 'bold', position: 'absolute', right: 10, color: 'gray'}}>Waiting for pickup</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                <Text>Ready by - {monthList[new Date(order["ready_by"]["seconds"]*1000).getMonth()]} {new Date(order["ready_by"]["seconds"]*1000).getDate()}, {dateArray[0]+':'+dateArray[1]+' '+dateArray[2].split(' ')[1]}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                {/* <Text>{monthList[new Date(order["created_at"]["seconds"]*1000).getMonth()]} {new Date(order["created_at"]["seconds"]*1000).getDate()}</Text> */}
                                <Text>Filled - Waiting to be picked up</Text>
                            </View>

                            <View onPress={()=>acceptOrder(order, i)} style={{position: 'absolute', right: 20, top: 40, backgroundColor: '#e1e6e6', padding: 5, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row'}}>
                              <Text style={{color: 'gray'}}>Complete</Text>
                              <MaterialCommunityIcons name="chevron-right" size={17} color='gray'/>
                            </View>

                        </View>
                    </TouchableOpacity>) 
 
                } 
            })} 

            {filled === 0 ? <View style={{backgroundColor: '#e8ebeb', paddingVertical: 40, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: 'lightgray'}}><Text style={{alignSelf: 'center', color: 'gray'}}>You have no filled orders.</Text></View> : null}

             <Text style={{padding: 12, marginTop: 10, fontWeight: 'bold', fontSize: 17}}>Completed</Text>

             {authContext.orders.map((order, i)=>{
                  var time = (new Date(order["ready_by"]["seconds"]*1000)).toLocaleTimeString().split(":")
                  var displayTime = time[0]+":"+time[1]+" "+time[2].split(" ")[1]
                  var dueIn = ((order["ready_by"]["seconds"]*1000 - (authContext.currentTime.getTime()))/60000).toFixed(0)
                 if (order["completed"]===true){
                   completed+=1;
                    const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
                    return(<TouchableOpacity key={i} onPress={()=>authContext.getItemsAndAddons(order, authContext.storeData.restaurant_id).then((itemsArr) => navigation.navigate("Order Page", {order: order, itemsArr: itemsArr}))}>
                        <View style={{backgroundColor: '#e8ebeb', padding: 10, height: 90, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 1,}}>
                            <Text style={{fontWeight: 'bold'}}>{order["user_first_name"]} </Text>
                                <Text style = {{alignSelf: 'flex-end', fontWeight: 'bold', position: 'absolute', right: 20, top: 10, color: 'gray'}}>Completed</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                <Text>Ready by - {monthList[new Date(order["ready_by"]["seconds"]*1000).getMonth()]} {new Date(order["ready_by"]["seconds"]*1000).getDate()}, {dateArray[0]+':'+dateArray[1]+' '+dateArray[2].split(' ')[1]}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 1}}>
                                {/* <Text>{monthList[new Date(order["created_at"]["seconds"]*1000).getMonth()]} {new Date(order["created_at"]["seconds"]*1000).getDate()}</Text> */}
                                <Text>Completed</Text>
                            </View>
                        </View>
                    </TouchableOpacity>) 

                }
            })} 

            {completed === 0 ? <View style={{backgroundColor: '#e8ebeb', paddingVertical: 40, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: 'lightgray'}}><Text style={{alignSelf: 'center', color: 'gray'}}>You have no completed orders.</Text></View> : null}

            <View style={{height: 200, width: '100%'}}></View>
            
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