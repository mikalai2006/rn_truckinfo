import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PointStack from './PointStack';
import MapScreen from '~components/screens/MapScreen';
import NodeStack from './NodeStack';
import {ReviewScreen} from '~components/screens';
import WidgetMapBottomSheet from '~components/widgets/WidgetMapBottomSheet';
import {View} from 'react-native';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';

const Stack = createNativeStackNavigator();

const MapStack = ({navigation}) => {
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
                }}>
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen
                    name="MarkerScreen"
                    component={WidgetMapBottomSheet}
                    options={{
                        // statusBarAnimation: 'none',
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="PointStack"
                    component={PointStack}
                    options={{
                        statusBarAnimation: 'none',
                        animation: 'fade',
                    }}
                />
                <Stack.Screen name="NodeStack" component={NodeStack} />
                <Stack.Screen
                    name="ReviewScreen"
                    component={ReviewScreen}
                    options={{
                        statusBarAnimation: 'none',
                        animation: 'slide_from_right',
                    }}
                />
            </Stack.Navigator>
        </View>
    );
};

export default MapStack;
