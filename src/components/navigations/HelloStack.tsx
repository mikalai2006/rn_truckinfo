import React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthScreen} from '~components/screens';
import AppStack from './AppStack';
import TestScreen from '~components/screens/TestScreen';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';

const Stack = createNativeStackNavigator();

const HelloStack = () => {
    const {colorScheme} = useColorScheme();

    return (
        <View style={{flex: 1, paddingTop: 0}} tw="bg-white dark:bg-s-900">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                // initialRouteName={token.access_token ? 'AppStack' : 'AuthScreen'}
            >
                <Stack.Screen
                    name="AuthScreen"
                    component={AuthScreen}
                    options={{
                        // statusBarAnimation: 'none',
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
                <Stack.Screen name="AppStack" component={AppStack} />
                <Stack.Screen name="TestScreen" component={TestScreen} />
            </Stack.Navigator>
        </View>
    );
};

export default HelloStack;
