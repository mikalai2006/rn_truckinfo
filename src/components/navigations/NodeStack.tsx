import React from 'react';

import {ReviewScreen, StatScreen, PointScreen} from '../screens';

import colors from '../../utils/colors';
import {View} from 'react-native';
import {useColorScheme} from 'nativewind';
import WidgetNodeTitle from '~components/widgets/WidgetNodeTitle';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const NodeStacks = createNativeStackNavigator();

export default function NodeStack({navigation}) {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-800">
            <View tw="border-b border-s-300">
                <WidgetNodeTitle />
            </View>
            <NodeStacks.Navigator
                screenOptions={{
                    // tabBarScrollEnabled: true,
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
                <NodeStacks.Screen
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
                <NodeStacks.Screen
                    name="Review"
                    component={ReviewScreen}
                    options={{
                        tabBarLabel: t('general:reviews'),
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
                <NodeStacks.Screen
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
            </NodeStacks.Navigator>
        </View>
    );
}
