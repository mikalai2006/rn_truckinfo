import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ChooseLanguageScreen from '~components/screens/ChooseLanguageScreen';
import AuthScreen from '~components/screens/AuthScreen';

const Stack = createNativeStackNavigator();

const HelloStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="ChooseLanguage" component={ChooseLanguageScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
    );
};

export default HelloStack;
