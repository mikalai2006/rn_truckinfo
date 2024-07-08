import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {SettingLangScreen, SettingScreen, SettingAvatarScreen, SettingFormScreen} from '~components/screens';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';
import {View} from 'react-native';

const Stack = createNativeStackNavigator();

const SettingStack = () => {
    const {colorScheme} = useColorScheme();

    return (
        <View style={{flex: 1, paddingTop: 0}} tw="bg-s-100 dark:bg-s-900">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animationTypeForReplace: 'push',
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
                    name="SettingLangScreen"
                    component={SettingLangScreen}
                    options={{
                        statusBarAnimation: 'none',
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="SettingFormScreen"
                    component={SettingFormScreen}
                    options={{
                        statusBarAnimation: 'none',
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="SettingAvatarScreen"
                    component={SettingAvatarScreen}
                    options={{
                        statusBarAnimation: 'none',
                        animation: 'slide_from_right',
                    }}
                />
            </Stack.Navigator>
        </View>
    );
};

export default SettingStack;
