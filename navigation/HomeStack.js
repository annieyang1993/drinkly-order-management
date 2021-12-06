import React, {useContext, useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
//import SignupScreen from '../screens/SignupScreen';
import { TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Dimensions, TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import 'firebase/firestore'
import firebase from 'firebase'

import OrderNavigation from './OrderNavigation'
import SummaryNavigation from './SummaryNavigation'
import AccountNavigation from './AccountNavigation'
import { getTotalDiskCapacityAsync } from 'expo-file-system';


const Tab = createBottomTabNavigator();

global.addEventListener = () => {};
global.removeEventListener = () => {};

//const auth = Firebase.auth();

export default function AuthStack() {
  const authContext = useContext(AuthContext)
  const [storeData, setStoreData] = useState({});
  const [userData, setUserData] = useState({});
  const [sections, setSections] = useState([]);
  const [restaurantPreferences, setRestaurantPreferences] = useState([]);
  const [currentItem, setCurrentItem] = useState({})
  const [storeHours, setStoreHours] = useState({})
  const [beginningDate, setBeginningDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endingDate, setEndingDate] =  useState(new Date(new Date().setHours(23,59,59,999)));
  const [orders, setOrders] = useState([]);
  const [ordersArray, setOrdersArray] = useState([])
  const [accepted, setAccepted] = useState([]);
  const [filled, setFilled] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [items, setItems] = useState([{}]);
  const [addons, setAddons] = useState({})
  const [closingHour, setClosingHour] = useState();
  const [closingMinute, setClosingMinute] = useState();
  const [closingTime, setClosingTime] = useState();
  const [totalDollars, setTotalDollars] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [itemGrouping, setItemGrouping] = useState({});
  const [toppingGrouping, setToppingGrouping] = useState({});
  const [statsBool, setStatsBool] = useState(false)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const rounded = (number) =>{
        const separated = String(Number(number)).split(".");
        if (separated.length===1){
            return number;
        } else{
            if (separated[1].length<=2){
                return number;
            } else{
                const first = Number(separated[1][0]);
                const second = Number(separated[1][1]);
                const third = Number(separated[1][2]);
                if (Number(third)<5){
                    return Number([separated[0], String(first)+String(second)].join('.'))
                } else{
                    if (second === 9 && first === 9){
                        return Number(separated[0])+1;
                    } else if (second === 9 && first <9){
                        return Number([separated[0], String(first+1)].join('.'))
                    } else if (second < 9){
                        return Number([separated[0], String(first)+String(second+1)].join('.'))
                    }
                        
                }
            }
        }

    }
  


  
   const { user, setUser, loggedIn, setLoggedIn } = useContext(AuthenticatedUserContext);

    const getOrders = async (restaurant_id, beginningDate, endingDate) => {
        const ordersTemp = []
        const orders = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').where("ready_by", ">=", beginningDate).where("ready_by", "<=", endingDate).orderBy('ready_by').addSnapshotListener();
        orders.docs.map(async (order, i)=>{
            const orderTemp = order.data();
            ordersTemp.push(orderTemp);
            const items = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.id).collection('items').get();
            ordersTemp[i]['items']={}
            items.docs.map((item, j)=>{
              ordersTemp[i]['items'][item.id]=item.data();
            })
        })
        setOrders(ordersTemp.reverse());

    }

    const getStore = async() => {
        const userTemp = await Firebase.firestore().collection('users')
        .doc(user.uid).get();
        setUserData(userTemp.data());
        const restaurantTemp = await Firebase.firestore().collection('restaurants')
        .doc(userTemp.data().restaurant_id).get();
        setStoreData(restaurantTemp.data());
        setSections(restaurantTemp.data().sections);

        const restPreferences = await Firebase.firestore().collection('restaurants').doc(restaurantTemp.data().restaurant_id).collection('add-ons').get();
        const restaurantPreferencesTemp = [];
        restPreferences.docs.map((pref, j)=>{
            restaurantPreferencesTemp.push(pref.data())
        })
        setRestaurantPreferences(restaurantPreferencesTemp);

        const hours = {};
            const firebaseHours = await Firebase.firestore().collection('restaurants').doc(restaurantTemp.data().restaurant_id).collection('operating hours').get();
            firebaseHours.docs.map((day, i)=>{
                hours[day.id]=day.data();
            })
        let closingHourTemp;
        let closingMinuteTemp;
        if (hours[days[new Date().getDay()]]["close"].split(' ')[1]==='pm'){
            if (Number(hours[days[new Date().getDay()]]["close"].split(':')[0])<12){
                setClosingHour(Number(hours[days[new Date().getDay()]]["close"].split(':')[0])+12);
                closingHourTemp = Number(hours[days[new Date().getDay()]]["close"].split(':')[0])+12;
            } else{
                setClosingHour(12);
                closingHourTemp = 12;
            }
        } else if (hours[days[new Date().getDay()]]["close"].split(' ')[1]==='am'){
            if (Number(hours[days[new Date().getDay()]]["close"].split(':')[0])<12){
                setClosingHour(Number(hours[days[new Date().getDay()]]["close"].split(':')[0]));
                closingHourTemp = Number(hours[days[new Date().getDay()]]["close"].split(':')[0]);
            } else{
                setClosingHour(0);
                closingHourTemp = 0;
            }

        }
        setClosingMinute(Number(hours[days[new Date().getDay()]]["close"].split(':')[1].split(' ')[0]));
        closingMinuteTemp=Number(hours[days[new Date().getDay()]]["close"].split(':')[1].split(' ')[0]);

        



        await setStoreHours(hours);
        // getOrders(restaurantTemp.data().restaurant_id, beginningDate, endingDate)
        return {restaurant_id: restaurantTemp.data().restaurant_id, closingHourTemp: closingHourTemp, closingMinuteTemp: closingMinuteTemp};
    }

//     const getHours = async () =>{
//         const hours = {};
//         const firebaseHours = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('operating hours').get();
//         firebaseHours.docs.map((day, i)=>{
//             hours[day.id]=day.data();
//         })

//         console.log("HOME STACK", hours);
//         await setStoreHours(hours);
//     }
    const getItems = async (restaurant_id, order_id, orderTemp)=>{

        const items = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order_id).collection('items').get();
            await items.docs.map(async (item, j)=>{
                orderTemp['items'][item.id]=item.data();
                //await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.id).collection('items').doc(item.id).collection('add-ons').get();
                orderTemp['items'][item.id]['add-ons'] = {}
                // addons.docs.map(async (addon, k)=>{
                //     orderTemp['items'][item.id]['add-ons'][addon.id] = addon.data();
                // })
        })

        return orderTemp;
    }

    const updateOrders = async(orders, restaurant_id) =>{
        var ordersTemp = orders;
        await orders.docs.map(async (order, i)=>{
            var orderTemp = order.data();
            ordersTemp[order.id] = orderTemp;
            //console.log(orderTemp);
            orderTemp['items'] = {}
            // const items = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.id).collection('items').get();
            //     await items.docs.map(async (item, j)=>{
            //         orderTemp['items'][item.id]=item.data();
            //         //await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.id).collection('items').doc(item.id).collection('add-ons').get();
            //         orderTemp['items'][item.id]['add-ons'] = {}
            //         // addons.docs.map(async (addon, k)=>{
            //         //     orderTemp['items'][item.id]['add-ons'][addon.id] = addon.data();
            //         // })
            // })
            
            
            
        })
        setOrders(ordersTemp);
    }

    const getTotal = async (restaurant_id) =>{
        var totalTemp = 0;
        var totalOrdersTemp = 0;
        var itemGroupTemp = {}
        var addonsGroupTemp = {}
        const ordersF = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').where("ready_by", ">=", beginningDate).where("ready_by", "<=", endingDate).orderBy('ready_by').get();
        var ordersTemp = [];
        await ordersF.docs.map(async (order, i)=>{
            var orderTemp = order.data();
            ordersTemp.push(orderTemp);
            totalOrdersTemp += 1;
            await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.id).collection('items').get().then(async (itemsF)=>{
                await itemsF.docs.map(async (item, j)=>{
                    if (itemGroupTemp[item.data().name]===undefined){
                        itemGroupTemp[item.data().name]=Number(item.data().quantity);
                    } else{
                        itemGroupTemp[item.data().name]+=Number(item.data().quantity);
                    }
                    await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.id).collection('items').doc(item.id).collection('add-ons').get().then(async (addonsF)=>{
                        await addonsF.docs.map(async (addon, k) =>{
                            if (addon.data().name!=="special_instructions"){
                                if (addonsGroupTemp[addon.data().choice]===undefined){
                                addonsGroupTemp[addon.data().choice]=Number(addon.data().quantity)*Number(item.data().quantity);
                                setToppingGrouping(addonsGroupTemp);
                                } else{
                                    addonsGroupTemp[addon.data().choice]+=Number(addon.data().quantity)*Number(item.data().quantity);
                                    setToppingGrouping(addonsGroupTemp);
                                }

                            }
                            
                        })
                    })
                    
                })
                
            })
            
            //console.log(orderTemp);
        })

        Object.values(ordersTemp).map((order, i)=>{
            totalTemp+= Number(order["subtotal"]) + Number(order["taxes"]) + Number(order["tip"]) - Number(order["discount"]);
        })
        setTotalDollars(totalTemp);
        setTotalNumber(totalOrdersTemp);
        setItemGrouping(itemGroupTemp);
        setToppingGrouping(addonsGroupTemp);
        setStatsBool(true);
    }

    

    useEffect(async ()=>{
        const {restaurant_id, closingHourTemp, closingMinuteTemp} = await getStore();
        const unsubscribe = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').where("ready_by", ">=", beginningDate).where("ready_by", "<=", endingDate).orderBy('ready_by').onSnapshot(async (orders) => {
                    var ordersTemp = [];
                    await orders.docs.map(async (order, i)=>{
                        var orderTemp = order.data();
                        ordersTemp.push(orderTemp);
                    })
                    
                    setOrders(ordersTemp);
        });
        setCurrentTime(new Date());
    
    var intervalId = 0;
    if (new Date() >= new Date(new Date().setHours(closingHourTemp, closingMinuteTemp, 0))){
        getTotal(restaurant_id);
    } else{
        var intervalId = setInterval(()=>{
        setCurrentTime(new Date());
        if (new Date() >= new Date(new Date().setHours(closingHourTemp, closingMinuteTemp, 0))){
            getTotal(restaurant_id);
            clearInterval(intervalId)
            unsubscribe();
        }
    }, 60000);

    }
    return () => {
        unsubscribe();
        clearInterval(intervalId);
    }

  }, [])







    const getItemsAndAddons = async (order, restaurant_id) => {
        var itemsTemp = []
        var length = 0;
        const items = await Firebase.firestore().collection('restaurants').doc(restaurant_id).collection('orders').doc(order.order_id).collection('items').get();
        items.docs.map(async (item, i)=>{
            var itemTemp = item.data();
            itemsTemp.push(itemTemp);
            setItems(itemsTemp);
            length+=1;
                
        })

        const itemsArr = new Array(length);

        for (var i = 0; i<length; i++){
            itemsArr[i] = new Array(0);
        }

        return itemsArr;
        
    }

  return (
      <AuthContext.Provider value={{storeData, setStoreData, userData, setUserData, sections, setSections, getStore, 
      items, setItems, restaurantPreferences, setRestaurantPreferences, currentItem, setCurrentItem,
      storeHours, setStoreHours, beginningDate, setBeginningDate, endingDate, setEndingDate, orders, setOrders, rounded, ordersArray, setOrdersArray, 
      accepted, setAccepted, filled, setFilled, completed, setCompleted, items, setItems, currentTime, setCurrentTime, getItemsAndAddons, addons, setAddons,
      closingHour, setClosingHour, closingMinute, setClosingMinute, statsBool, setStatsBool, totalDollars, setTotalDollars, totalNumber, setTotalNumber, 
      itemGrouping, setItemGrouping, toppingGrouping, setToppingGrouping}}>
        <View style={{height: Dimensions.get("screen").height}}>
            <Tab.Navigator
                independent={true}
                activeBackgroundColor='red'
                screenOptions={{
                tintColor: 'red',
                activeColor: 'red',
                activeTintcolor: 'white',
                inactiveBackgroundColor: 'blue',
                inactiveTintColor: 'black',
                safeAreaInsets: {
                    bottom: 0,
                    top: 0
                },
                tabBarActiveTintColor:'#119aa3',
                headerShown: false  
                }}>
                
                <Tab.Screen 
                    name="Today's Orders" 
                    component={OrderNavigation}
                    options={{headerMode: 'none', tabBarIcon: ({size, color})=> <MaterialCommunityIcons size={20} name="receipt" color={color}/>}}/>
                <Tab.Screen 
                    name="Today's Summary" 
                    component={SummaryNavigation}
                    options={{headerMode: 'none', tabBarIcon: ({size, color})=> <MaterialCommunityIcons size={20} name="google-analytics" color={color}/>}}/>
                <Tab.Screen 
                    name="Account" 
                    component={AccountNavigation}
                    options={{headerMode: 'none', tabBarIcon: ({size, color})=> <MaterialCommunityIcons size={20} name="account" color={color}/>}}/>
            </Tab.Navigator>

        </View>
        </AuthContext.Provider>
    
  );
}
  
  const styles = StyleSheet.create({
  screen: {
    paddingTop: 50,
    //backgroundColor: "brown",
    textAlignVertical: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: "100%"
  },

  image: {
      width: Dimensions.get("screen").width*0.85,
      height: Dimensions.get("screen").width*0.85,
      resizeMode: 'contain',
      flexDirection: 'column',
      alignSelf: 'center',
      opacity: .3,
      borderColor: "gray",
      marginVertical: "20%",
      position: 'absolute',
      top: "15%",
      borderRadius: 250

  },

  login: {
    position: 'absolute',
    backgroundColor: "#a1a8a8",
    borderRadius: 25,
    flexDirection: "row",
    width: '95%',
    padding: 15,
    marginVertical: 5,
    bottom: 30,
    color: "white",
    textDecorationColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
    
  },

  register: {
    position: 'absolute',
    backgroundColor: "#44bec6",
    borderRadius: 25,
    flexDirection: "row",
    width: '95%',
    padding: 15,
    bottom: 90,
    textDecorationColor: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',  
  },

  loginText: {
      textDecorationColor: 'white',
      fontWeight: 'bold',
      
  },

  registerText: {
      color: 'white',
      textDecorationColor: 'white',
      fontWeight: 'bold',
      
  },

  loginText: {
      color: 'black',
      textDecorationColor: 'white',
      fontWeight: 'bold',
      
  },

  logo: {
    width: "40%",
    height: "8%",
    resizeMode: 'contain',
    alignSelf: 'center'
    
  }
  
})