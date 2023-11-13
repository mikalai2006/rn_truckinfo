import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthScreen, LanguageScreen} from '~components/screens';

const Stack = createNativeStackNavigator();

const HelloStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            {/* <Stack.Screen name="LanguageScreen" component={LanguageScreen} /> */}
            <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
    );
};

export default HelloStack;
