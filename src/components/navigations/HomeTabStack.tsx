import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {HomeScreen, ProfileScreen} from '../screens';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import colors from '../../utils/colors';
import {Text} from 'react-native';
import {useColorScheme} from 'nativewind';

const Tab = createBottomTabNavigator();

export default function HomeTabStack() {
    const {colorScheme} = useColorScheme();

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 50,
                    backgroundColor: colorScheme === 'dark' ? colors.s[800] : colors.s[100],
                    borderTopColor: colorScheme === 'dark' ? colors.s[700] : colors.s[200],
                },
                tabBarActiveTintColor: colorScheme === 'dark' ? colors.p[500] : colors.p[500],
                tabBarInactiveTintColor: colorScheme === 'dark' ? colors.s[500] : colors.s[500],
                tabBarActiveBackgroundColor: colorScheme === 'dark' ? colors.s[800] : colors.s[50],
            }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <>
                                <Icon name={focused ? 'home' : 'home-outline'} size={32} color={color} />
                                <Text>home</Text>
                            </>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({focused, color}) => {
                        return (
                            <>
                                <MIcon name={focused ? 'person' : 'person-outline'} size={32} color={color} />
                                <Text>profile</Text>
                            </>
                        );
                    },
                    tabBarBadge: 3,
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
    );
}
