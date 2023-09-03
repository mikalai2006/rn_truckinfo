import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CardStyleInterpolators} from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {Animated, KeyboardAvoidingView, Platform} from 'react-native';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <Stack.Navigator
                screenOptions={{
                    // presentation: 'card',
                    // gestureEnabled: true,
                    // gestureDirection: 'horizontal',
                    headerShown: false,
                    animation: 'slide_from_right',
                }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </KeyboardAvoidingView>
    );
};

export default AuthStack;
