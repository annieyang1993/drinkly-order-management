import React, { useContext, useState, useMemo, useEffect} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
//import CachedImage from 'react-native-expo-cached-image'

export default function OrderPage({route}){
    const authContext = useContext(AuthContext);
    const navigation = useNavigation();
    const [loadingPicture, setLoadingPicture] = useState(false);
    const [addons, setAddons] = useState(route.params.itemsArr);
    const [loading, setLoading] = useState(false);

    // else if (order["filled"]===undefined || order["filled"]===false){
    //                 const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
    //                 return(<TouchableOpacity key={i} onPress={()=>navigation.navigate("Order Page", {order: order})}>
    //                     <View style={{backgroundColor: '#f7f6cc', padding: 10, height: 90, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 1,}}>
    //                         <View style={{flexDirection: 'row', width: '100%'}}>
    //                             <Text style={{fontWeight: 'bold', width: '65%'}} numberOfLines={1}>{order["user_first_name"]}</Text>
    //                             <Text style = {{alignSelf: 'flex-end', fontWeight: 'bold', position: 'absolute', right: 10, color: 'gray'}}>Waiting to be filled</Text>
    //                         </View>
    //                         <View style={{flexDirection: 'row'}}>
    //                             <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
    //                         </View>
    //                         <View style={{flexDirection: 'row', marginTop: 1}}>
    //                             <Text>Ready by - {monthList[new Date(order["ready_by"]["seconds"]*1000).getMonth()]} {new Date(order["ready_by"]["seconds"]*1000).getDate()}, {dateArray[0]+':'+dateArray[1]+' '+dateArray[2].split(' ')[1]}</Text>
    //                         </View>

    //                         <View style={{flexDirection: 'row', marginTop: 1}}>
    //                             <Text>Accepted - Waiting to be filled</Text>
    //                         </View>
    //                         <View onPress={()=>acceptOrder(order, i)} style={{position: 'absolute', right: 20, top: 40, backgroundColor: '#e1e6e6', padding: 5, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row'}}>
    //                           <Text style={{color: 'gray'}}>Fill order</Text>
    //                           <MaterialCommunityIcons name="chevron-right" size={17} color='gray'/>
    //                         </View>
    //                     </View>
    //                 </TouchableOpacity>) 
    //             } else if (order["completed"]===undefined || order["completed"]===false){
    //                 const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
    //                 return(<TouchableOpacity key={i} onPress={()=>navigation.navigate("Order Page", {order: order})}>
    //                     <View style={{backgroundColor: '#dff8dd', padding: 10, height: 90, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 1,}}>
    //                         <View style={{flexDirection: 'row', width: '100%'}}>
    //                             <Text style={{fontWeight: 'bold'}}>{order["user_first_name"]}</Text>
    //                             <Text style = {{alignSelf: 'flex-end', fontWeight: 'bold', position: 'absolute', right: 10, color: 'gray'}}>Active</Text>
    //                         </View>
    //                         <View style={{flexDirection: 'row'}}>
    //                             <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
    //                         </View>
    //                         <View style={{flexDirection: 'row', marginTop: 15}}>
    //                             {/* <Text>{monthList[new Date(order["created_at"]["seconds"]*1000).getMonth()]} {new Date(order["created_at"]["seconds"]*1000).getDate()}</Text> */}
    //                             <Text> Filled - Waiting to be picked up</Text>
    //                         </View>
    //                     </View>
    //                 </TouchableOpacity>) 
 
    //             } else{
    //                 const dateArray = new Date(order["ready_by"]["seconds"]*1000).toLocaleTimeString().split(':')
    //                 return(<TouchableOpacity key={i} onPress={()=>navigation.navigate("Order Page", {order: order})}>
    //                     <View style={{backgroundColor: 'white', padding: 10, height: 90, marginVertical: 5, width: Dimensions.get("screen").width*0.93, alignSelf: 'center', borderRadius: 10, shadowColor: 'gray', shadowOffset: {width: 2, height: 2}, shadowRadius: 5, shadowOpacity: 1,}}>
    //                         <Text style={{fontWeight: 'bold'}}>{order["user_first_name"]} </Text>
    //                         <View style={{flexDirection: 'row'}}>
    //                             <Text>${authContext.rounded(order["subtotal"]).toFixed(2)}</Text>
    //                         </View>
    //                         <View style={{flexDirection: 'row', marginTop: 15}}>
    //                             {/* <Text>{monthList[new Date(order["created_at"]["seconds"]*1000).getMonth()]} {new Date(order["created_at"]["seconds"]*1000).getDate()}</Text> */}
    //                             <Text> Completed</Text>
    //                         </View>
    //                     </View>
    //                 </TouchableOpacity>) 

    //             }
    var time = (new Date(route.params.order["ready_by"]["seconds"]*1000)).toLocaleTimeString().split(":")
    var displayTime = time[0]+":"+time[1]+" "+time[2].split(" ")[1]
    var dueIn = ((route.params.order["ready_by"]["seconds"]*1000 - (new Date().getTime()))/60000).toFixed(0)
    

    const fillOrder = async () => {
        var set = true;
        var filledDate = new Date();
        try{
        await Firebase.firestore().collection('restaurants').doc(route.params.order["restaurant_id"]).collection('orders').doc(route.params.order["order_id"]).update({
        filled: true,
        filled_at: filledDate
        }, {merge: true})
        } catch (error) {
        set = false;
        } 

        try{
            await Firebase.firestore().collection('users').doc(route.params.order["user_uid"]).collection('orders').doc(route.params.order["order_id"]).update({
            filled: true,
            filled_at: filledDate
            }, {merge: true})
            } catch (error) {
            set = false;
        } 

        if (set===true){
            const orderTemp = authContext.orders.map((x)=>x);
            orderTemp.map((order, i)=>{
                if (order["order_id"]===route.params.order.order_id){
                    order["filled"]=true;
                    order["filled_at"] = {};
                    order["filled_at"]["seconds"]=filledDate.getTime()/1000;
                }
            })
            navigation.pop(1)
        authContext.setOrders(orderTemp);

        }
        
    }

    const completeOrder = async () => {
        var set = true;
        var completedDate = new Date();
        try{
        await Firebase.firestore().collection('restaurants').doc(route.params.order["restaurant_id"]).collection('orders').doc(route.params.order["order_id"]).update({
        completed: true,
        completed_at: completedDate
        }, {merge: true})
        } catch (error) {
        set = false;
        } 

        try{
        await Firebase.firestore().collection('users').doc(route.params.order["user_uid"]).collection('orders').doc(route.params.order["order_id"]).update({
        completed: true,
        completed_at: completedDate
        }, {merge: true})
        } catch (error) {
        set = false;
        } 

        if (set===true){
            const orderTemp = authContext.orders.map((x)=>x);
            orderTemp.map((order, i)=>{
                if (order["order_id"]===route.params.order.order_id){
                    order["completed"]=true;
                    order["completed_at"] = {};
                    order["completed_at"]["seconds"]=completedDate.getTime()/1000;
                }
            })
            navigation.pop(1)
        authContext.setOrders(orderTemp);

        }
        
    }

    useEffect(async ()=>{
        if (authContext.addons[route.params.order["order_id"]]!==undefined){
            setAddons(authContext.addons[route.params.order["order_id"]])
        } else{
            var addonsOuterTemp = []
            var allAddons = authContext.addons;
            setLoading(true);
            var count = 0;
            await authContext.items.map(async (item, i)=>{
                addonsOuterTemp.push([])
                //addonsOuterTemp.push(addonsTemp);
                const addonsFirebase = await Firebase.firestore().collection('restaurants').doc(route.params.order["restaurant_id"]).collection('orders').doc(String(route.params.order["order_id"])).collection('items').doc(String(item.item_id)).collection('add-ons').get().then(async (addonsFirebase)=>{
                    count+=1;
                    await addonsFirebase.docs.map((addon, j)=>{
                        addonsOuterTemp[i].push(addon.data());
                        
                    })
                    setAddons(addonsOuterTemp);
                    if (count === authContext.items.length){
                        allAddons[route.params.order["order_id"]] = addonsOuterTemp;
                        authContext.setAddons(allAddons);
                        setLoading(false);
                    }
                    
                });
                
            })
        }
    }, [])

    return(
        <View style={{height: Dimensions.get("screen").height, width: '100%', paddingTop: 50, backgroundColor: 'white'}}>
            <Text style={{alignSelf: 'center', fontSize: 15, fontWeight: '500'}}>ORDER #{route.params.order.order_id.split('.')[1].toUpperCase()}</Text>
            <ScrollView>
            {route.params.order["filled"] ? 
            <View style={{width: '90%', alignSelf: 'center', backgroundColor: '#e8ebeb', alignItems: 'center', paddingTop: 20, marginTop: 10, borderRadius: 10, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4,}}>
            <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Have order ready by {displayTime}</Text>
            <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Order filled at {new Date(route.params.order["filled_at"]["seconds"]*1000).toLocaleTimeString().split(":")[0]
            + ":"+new Date(route.params.order["filled_at"]["seconds"]*1000).toLocaleTimeString().split(":")[1]+" "+new Date(route.params.order["filled_at"]["seconds"]*1000).toLocaleTimeString().split(":")[2].split(" ")[1]}</Text>
            </View>: 

            <View>

            {dueIn <= 5 ? 
            
            <View style={{width: '90%', alignSelf: 'center', backgroundColor: dueIn <=1 ? '#f2c9d1': '#f7f6cc', alignItems: 'center', paddingTop: 20, marginTop: 10, borderRadius: 10, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4,}}>
            <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Have order ready by {displayTime}</Text>

            {dueIn < 1 ? 
            <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'red', paddingBottom: 20}}>
            Order due {dueIn*(-1)} mins ago</Text> : <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Due in {dueIn} mins </Text>}

            </View> : <View style={{width: '90%', alignSelf: 'center', backgroundColor: '#dff8dd', alignItems: 'center', paddingTop: 20, marginTop: 10, borderRadius: 10, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4,}}>
            <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Have order ready by {displayTime}</Text>

            {dueIn < 1 ? 
            <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Order due {dueIn*(-1)} mins ago</Text> : <Text numberOfLines={1} style={{fontSize: 20, textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', color: 'gray', paddingBottom: 20}}>
            Due in {dueIn} mins</Text>}

            </View>

        }</View>}

            <View style={{width: '90%', alignSelf: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#e2e6e6', paddingHorizontal: 15,  marginTop: 30, paddingBottom: 30, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4,}}>
            {authContext.items.map((ele, i)=>{
                return(
                <View key={i} style={{width: '100%'}}>
                    <View style={{flexDirection: 'row', width: '100%', paddingTop: 30}}>
                        <Text style={{width: '10%', fontSize: 16, fontWeight:'bold',alignSelf: 'center', textAlign: 'center'}}>{ele["quantity"]}x</Text>
                        <Text style={{width: '70%', fontSize: 16, fontWeight:'bold',}}>{ele["name"]}</Text>
                        {/* <Text style={{width: '20%', fontSize: 16, fontWeight:'bold',textAlign: 'right', marginRight: 20, paddingRight: 10}}>${Number(ele["price"]).toFixed(2)}</Text> */}
                    </View>
                    
                    <View style={{marginLeft: 50, paddingTop: 5}}>
                    

                        {Object.values(addons[i]).map((addon, j)=>{
                        if (addon["name"]==="special_instructions"){
                            return(
                                <View key = {j} style={{flexDirection: 'horizontal', marginRight: 10, marginTop: 10,marginLeft: 10}}>
                                <Text style={{marginVertical: 1, fontStyle: 'italic'}}>Special instructions: {addon["instructions"]}</Text>
                                </View>
                            )
                        } else{
                            if (addon["required"]===true){
                                return(
                                    <View key = {j} style={{flexDirection: 'horizontal', marginRight: 10}}>
                                    <Text style={{marginVertical: 1}}>{addon["choice"]}</Text>
                                    </View>
                                )
                            } else{
                                return(
                                <View key = {j} >
                                    <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10}}>
                                        <Text style={{marginVertical: 1}}>+ </Text>
                                        <Text style={{marginVertical: 1}}>{addon["choice"]}</Text>
                                        <Text style={{marginVertical: 1, fontWeight: 'bold'}}> (x{addon["quantity"]})</Text>
                                    </View>
                                </View>
                            )
                            }
                            
                        }
                        
                    })}
                    
                    </View>
                </View>   )
            })}

            <View style={{width: '100%', height: 10, marginTop: 10, borderBottomColor: 'black', borderBottomWidth: 3}}></View>

 
            </View>

            {route.params.order["completed"]===true ?  <TouchableOpacity 
                style={{width: '90%', alignSelf: 'center', backgroundColor: '#e8ebeb', alignItems: 'center', margin: 30, padding: 20, borderRadius: 10, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4, elevation: 5,}}
                ><Text style={{textAlign: 'center', width: '100%', fontWeight: 'bold', color: '#636363', fontSize: 20}}>You completed this order at {new Date(route.params.order["completed_at"]["seconds"]).toLocaleTimeString()}</Text></TouchableOpacity> : <View>
            {route.params.order["accepted"]===false ? <TouchableOpacity 
                style={{width: '70%', alignSelf: 'center', backgroundColor: '#e2e6e6', alignItems: 'center', margin: 30, padding: 20, borderRadius: 10}}
                onPress={()=>{
                const date = new Date();
                acceptOrder(route.params.order["id"], date)
                navigation.navigate("Orders")
            }}><Text style={{textAlign: 'center', width: '100%', fontWeight: 'bold', color: '#636363', fontSize: 20}}>Accept Order</Text></TouchableOpacity> : <View>
                {route.params.order["filled"]===false ? 
                <TouchableOpacity 
                style={{width: '90%', alignSelf: 'center', backgroundColor: '#d0eff1', alignItems: 'center', margin: 30, padding: 20, borderRadius: 10, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4, elevation: 5,}}
                onPress={()=>{
                const date = new Date();
                fillOrder()
                //navigation.navigate("Orders")
            }}><Text style={{textAlign: 'center', width: '100%', fontWeight: 'bold', color: '#636363', fontSize: 19}}>Mark Filled (Ready for pick-up)</Text></TouchableOpacity> : 
            <TouchableOpacity 
                style={{width: '90%', alignSelf: 'center', backgroundColor: '#e8ebeb', alignItems: 'center', margin: 30, padding: 20, borderRadius: 10, shadowOffset: { width: 1, height: 1 }, shadowColor: '#000', shadowOpacity: 0.4, elevation: 5,}}
                onPress={()=>{
                completeOrder()
            }}><Text style={{textAlign: 'center', width: '100%', fontWeight: 'bold', color: '#636363', fontSize: 20}}>Mark Complete</Text></TouchableOpacity>}</View>}
            
            </View>}
            </ScrollView>
            <TouchableOpacity
            style={{backgroundColor: 'white',
            borderRadius: 10,
            width: 20,
            height: 20,
            position: 'absolute',
            marginTop: 50,
            marginHorizontal: 20,
            color: 'gray',
            zIndex: 50,
            }}
            onPress={()=>{navigation.navigate("Order List")}}>
            <MaterialCommunityIcons name="arrow-left" size={22}/>
        </TouchableOpacity> 
        </View>
        )

}