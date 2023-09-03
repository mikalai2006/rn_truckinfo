import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {ReviewScreen, PhotoScreen, PointScreen} from '../screens';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import colors from '../../utils/colors';
import {Text, TouchableOpacity, View} from 'react-native';
import {useColorScheme} from 'nativewind';

const Tab = createMaterialTopTabNavigator();

export default function PointStack({navigation}) {
    const {colorScheme} = useColorScheme();

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: colors.p[500],
                    },
                    tabBarLabelStyle: {
                        color: colorScheme === 'dark' ? colors.s[300] : colors.s[800],
                    },
                    tabBarStyle: {
                        backgroundColor: colorScheme === 'dark' ? colors.s[900] : colors.s[100],
                    },
                }}>
                <Tab.Screen
                    name="Point"
                    component={PointScreen}
                    options={{
                        tabBarLabel: 'general',
                        // tabBarIcon: ({focused, color}) => {
                        //     return (
                        //         <>
                        //             <Icon name={focused ? 'home' : 'home-outline'} size={32} color={color} />
                        //             {/* <Text>point</Text> */}
                        //         </>
                        //     );
                        // },
                    }}
                />
                <Tab.Screen
                    name="Review"
                    component={ReviewScreen}
                    options={{
                        tabBarLabel: 'review',
                        // tabBarIcon: ({focused, color}) => {
                        //     return (
                        //         <>
                        //             <MIcon name={focused ? 'person' : 'person-outline'} size={32} color={color} />
                        //             {/* <Text>review</Text> */}
                        //         </>
                        //     );
                        // },
                    }}
                />
                <Tab.Screen
                    name="Photo"
                    component={PhotoScreen}
                    options={{
                        tabBarLabel: 'gallery',
                        // tabBarIcon: ({focused, color}) => {
                        //     return (
                        //         <>
                        //             <MIcon name={focused ? 'person' : 'person-outline'} size={32} color={color} />
                        //             {/* <Text>photo</Text> */}
                        //         </>
                        //     );
                        // },
                    }}
                />
                {/* <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: focused => {
                        return (
                            <>
                                <Icon
                                    name={focused ? 'map-marker-multiple-outline' : 'map-marker-multiple'}
                                    size={32}
                                    color={colors.p[500]}
                                />
                                <Text>maps</Text>
                            </>
                        );
                    },
                }}
            /> */}
            </Tab.Navigator>
            <View tw="flex flex-row items-center bg-s-100 dark:bg-s-800 border-t border-s-200 dark:border-s-700">
                <TouchableOpacity activeOpacity={0.7} tw="p-4 " onPress={() => navigation.goBack()}>
                    <Icon
                        name="keyboard-backspace"
                        color={colorScheme === 'dark' ? colors.s[300] : colors.s[800]}
                        size={32}
                    />
                </TouchableOpacity>
                <View tw="p-2 flex-auto">
                    <Text tw="text-s-800 dark:text-s-300">
                        Szkoła Podstawowa w Dzierzgówku, Autostrada Wolności, Filipówka, Dzierzgówek, gmina Nieborów,
                        powiat łowicki, województwo łódzkie, 99-416, Polska
                    </Text>
                </View>
                <View tw="p-2">
                    <TouchableOpacity activeOpacity={0.7} tw="p-2 rounded-lg bg-p-500 text-white" onPress={() => {}}>
                        <Icon
                            name="map-marker-radius-outline"
                            color={colorScheme === 'dark' ? colors.s[300] : colors.s[100]}
                            size={32}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
