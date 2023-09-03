import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PointStack from './PointStack';
import MapScreen from '~components/screens/MapScreen';

const Stack = createNativeStackNavigator();

const MapStack = ({navigation}) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="MapScreen" component={MapScreen} />
            <Stack.Screen name="PointStack" component={PointStack} />
        </Stack.Navigator>
    );
};

export default MapStack;
