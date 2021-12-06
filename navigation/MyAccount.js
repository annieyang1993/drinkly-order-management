import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { ScrollView, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Dimensions, TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Stack = createStackNavigator();

export default function AuthStack() {
  const authContext = useContext(AuthContext)
  const auth = Firebase.auth();
  const { user, setUser, loggedIn, setLoggedIn } = useContext(AuthenticatedUserContext);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
    }
  };

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
            <View style={{width: '100%', alignSelf: 'center', marginTop: 80}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Account</Text>
            </View>
            <ScrollView style={{height: '100%', width: '90%', alignSelf: 'center'}} showsVerticalScrollIndicator={false}>
                <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray', flexDirection: 'row'}}>
                    <MaterialCommunityIcons name="storefront" size={20}/>
                    <Text style={{marginHorizontal: 10, fontSize: 15}}>{authContext.storeData.name}</Text>
                </View>

                <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray', flexDirection: 'row'}}>
                    <MaterialCommunityIcons name="phone" size={20}/>
                    <Text style={{marginHorizontal: 10, fontSize: 15}}>{authContext.storeData.phone.slice(0, 3)} - {authContext.storeData.phone.slice(3, 6)} - {authContext.storeData.phone.slice(6)}</Text>
                </View>

                <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray', flexDirection: 'row'}}>
                    <MaterialCommunityIcons name="store-outline" size={20}/>
                    <Text style={{marginHorizontal: 10, fontSize: 15}}>{authContext.storeData.street[0]}</Text>
                </View>

                <View style={{padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray', flexDirection: 'row'}}>
                    <MaterialCommunityIcons name="email-outline" size={20}/>
                    <Text style={{marginHorizontal: 10, fontSize: 15}}>{authContext.storeData.email}</Text>

                </View>

                <TouchableOpacity style={{padding: 10, flexDirection: 'row', marginTop: 200, alignSelf: 'center'}} onPress={()=>handleSignOut()}>
                    <MaterialCommunityIcons name="logout" size={20}/>
                    <Text style={{marginHorizontal: 10, fontSize: 15}}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
            </View>
 
    </View>
    // <Stack.Navigator >

    //   <Stack.Screen name='Splash' options={{title:"", headerShown: false}} component={SplashScreen}/>
    //   <Stack.Screen name='Login' options={{title:"", headerShown: false}} component={LoginScreen} />
    //   <Stack.Screen name='Signup' options={{title:"", headerShown: false}} component={SignupScreen} />
    // </Stack.Navigator>
    
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