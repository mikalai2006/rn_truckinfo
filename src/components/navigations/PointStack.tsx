import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {StatScreen, PointScreen} from '../screens';

import colors from '../../utils/colors';
import {View} from 'react-native';
import {useColorScheme} from 'nativewind';
import WidgetNodeTitle from '~components/widgets/WidgetNodeTitle';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

export default function PointStack({navigation}) {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-800">
            <View tw="">
                <WidgetNodeTitle />
            </View>
            <Tab.Navigator
                screenOptions={{
                    // tabBarScrollEnabled: true,
                    tabBarIndicatorStyle: {
                        backgroundColor: colors.p[500],
                        margin: 0,
                        padding: 0,
                    },
                    tabBarLabelStyle: {
                        color: colorScheme === 'dark' ? colors.s[300] : colors.s[800],
                        margin: 0,
                        padding: 0,
                    },
                    tabBarStyle: {
                        backgroundColor: colorScheme === 'dark' ? colors.s[800] : colors.s[100],
                        margin: 0,
                        padding: 0,
                    },
                }}>
                <Tab.Screen
                    name="Point"
                    component={PointScreen}
                    options={{
                        tabBarLabel: t('general:information'),
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
                {/* <Tab.Screen
                    name="Review"
                    component={ReviewScreen}
                    options={{
                        tabBarLabel: t('general:reviews'),
                    }}
                /> */}
                <Tab.Screen
                    name="Photo"
                    component={StatScreen}
                    options={{
                        tabBarLabel: t('general:stat'),
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
            </Tab.Navigator>
        </View>
    );
}
