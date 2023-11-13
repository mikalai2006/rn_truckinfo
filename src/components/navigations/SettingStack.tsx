import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {LanguageScreen, SettingScreen} from '~components/screens';

const Stack = createNativeStackNavigator();

const SettingStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{
                    statusBarAnimation: 'none',
                    animation: 'slide_from_right',
                }}
            />
            <Stack.Screen
                name="LanguageScreen"
                component={LanguageScreen}
                options={{
                    statusBarAnimation: 'none',
                    animation: 'slide_from_right',
                }}
            />
        </Stack.Navigator>
    );
};

export default SettingStack;
