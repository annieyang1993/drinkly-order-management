import React, { useContext, useState, useMemo, useEffect} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import Summary from '../screens/Summary';
import OrderPage from '../screens/OrderPage';
import {createStackNavigator} from '@react-navigation/stack'

export default function SummaryNavigation(){
    const authContext = useContext(AuthContext);
    const Stack = createStackNavigator();

    return(
        <View style={{height: Dimensions.get("screen").height, width: '100%'}}>
        <Stack.Navigator  screenOptions={{headerShown: false}}>
            <Stack.Screen  cardStyle='white' name="Summary" options={{title: ""}} component={Summary}
            options={{headerShown: false}}/>
            {/* <Stack.Screen style={{backgroundColor: 'white'}} name="Order Page" component={OrderPage} options={{ title: "", headerTintColor: '#545555', headerStyle: {backgroundColor: '#f0f0f0'}, backgroundColor: 'white'}}/> */}

        </Stack.Navigator>
        </View> 
    )
}