import React, {useContext, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {useNavigation, StackActions} from '@react-navigation/native'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { Modal, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CachedImage from 'react-native-expo-cached-image'
import {Picker} from '@react-native-picker/picker';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const Stack = createStackNavigator();

export default function Analytics({navigation}) {
  const authContext = useContext(AuthContext)

  return (

    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: '#d9f0f2', paddingVertical: 50}}>
            {console.log(authContext.beginningDate.getMonth())}
            <View style={{width: '100%', alignSelf: 'center', marginTop: 80}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Analytics</Text>
            </View>
            <ScrollView style={{height: '100%', width: '95%', alignSelf: 'center', alignSelf: 'center'}} showsVerticalScrollIndicator={false}>
                <Text style={{width: '95%', alignSelf: 'center', fontWeight: 'bold', marginTop: 10}}>Weekly Summary Stats</Text>
                <View style={{width: Dimensions.get('window').width - 40, alignSelf: 'center', borderRadius: 15, backgroundColor: 'white', marginVertical: 5, padding: 10, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>

                    <View style={{flexDirection: 'row', width: '100%', marginVertical: 5}}>
                    <Text style={{fontWeight: 'bold'}}>Best sellers:</Text>
                    <Text style={{position: 'absolute', right: 0, fontSize: 12, color: 'gray'}}>Taro Smoothie, Thai Milk Tea</Text>
                    </View>

                    <View style={{flexDirection: 'row', width: '100%', marginVertical: 5}}>
                    <Text style={{fontWeight: 'bold'}}>Best toppings:</Text>
                    <Text style={{position: 'absolute', right: 0, fontSize: 12, color: 'gray'}}>Tapioca, pudding</Text>
                    </View>

                    <View style={{flexDirection: 'row', width: '100%', marginVertical: 5}}>
                    <Text style={{fontWeight: 'bold'}}>Worst sellers:</Text>
                    <Text style={{position: 'absolute', right: 0, fontSize: 12, color: 'gray'}}>Winter Melon Ice Tea, QQ Passion Fruit</Text>
                    </View>

                    <View style={{flexDirection: 'row', width: '100%', marginVertical: 5}}>
                    <Text style={{fontWeight: 'bold'}}>Busiest hours:</Text>
                    <Text style={{position: 'absolute', right: 0, fontSize: 12, color: 'gray'}}>Mondays 9:00 am, Fridays 6:00 pm</Text>
                    </View>

                    <View style={{flexDirection: 'row', width: '100%', marginVertical: 5}}>
                    <Text style={{fontWeight: 'bold'}}>Slowest hours:</Text>
                    <Text style={{position: 'absolute', right: 0, fontSize: 12, color: 'gray'}}>Tuesday 3:00 pm</Text>
                 </View>

                </View>

                <Text style={{width: '95%', alignSelf: 'center', fontWeight: 'bold', marginTop: 10}}>Average Daily Sales By Hour</Text>
                <View style={{shadowColor: 'gray', alignSelf: 'center', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
              
                <BarChart
                    data={{
                    labels: ['9:00', '11:00', '1:00', '3:00', '5:00', '7:00'],
                    datasets: [
                        {
                        data: [
                            45,
                            35,
                            40,
                            47,
                            48,
                            40,
                            30,
                            33,
                            35,
                            45

                        ],
                        legendFontSize: 10
                        },
                ],
                }}
                width={Dimensions.get('window').width - 40} // from react-native
                height={220}
                yAxisLabel={''}
                chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                    fontSize: 10,
                    shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,
                },
                }}
                style={{
                marginVertical: 8,
                borderRadius: 16,
                }}
                /> 
                </View>

                <Text style={{width: '95%', alignSelf: 'center', fontWeight: 'bold', marginTop: 10}}>Weekly breakdown of items sold</Text>
                <View style={{shadowColor: 'gray', alignSelf: 'center', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <PieChart
                    data={[
                    {
                        name: 'Taro',
                        population: 2426,
                        color: 'rgba(131, 167, 234, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Matcha',
                        population: 1825,
                        color: 'rgba(170, 204, 230, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Classic',
                        population: 926,
                        color: 'rgba(120, 132, 159, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Honeydew',
                        population: 867,
                        color: 'rgba(169, 172, 180, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    ]}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    }}
                    style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    backgroundColor: 'white'
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute //for the absolute number remove if you want percentage
                />
                </View>

                <Text style={{width: '95%', alignSelf: 'center', fontWeight: 'bold', marginTop: 10}}>Weekly breakdown of toppings</Text>

                <PieChart
                    data={[
                    {
                        name: 'Tapioca',
                        population: 3241,
                        color: 'rgba(170, 204, 230, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Jelly',
                        population: 1242,
                        color: 'rgba(131, 167, 234, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Clear Pearls',
                        population: 1546,
                        color: 'rgba(120, 132, 159, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    {
                        name: 'Pudding',
                        population: 2255,
                        color: 'rgba(169, 172, 180, 1)',
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 15,
                    },
                    ]}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    }}
                    style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    backgroundColor: 'white'
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute //for the absolute number remove if you want percentage
                /> 
            </ScrollView>
            </View>
 
    </View>
    
  );
}