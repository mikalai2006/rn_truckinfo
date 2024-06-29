import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
    NodeScreen,
    ReviewScreen,
    NodedataScreen,
    NodedataCreatorScreen,
    ReviewFormScreen,
    NodedataCreatorTagScreen,
    MapLocalFilterScreen,
    ScreenKeys,
    NodeAuditScreen,
    MapFormSearchScreen,
} from '~components/screens';
import {View} from 'react-native';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';
import MapLocalScreen from '~components/map/MapLocalScreen';
import {TNodeSchema} from '~schema/NodeSchema';
import {INode, ITag} from '~store/appSlice';

export type MapLocalStackParamList = {
    MapLocalScreen: undefined;
    MapLocalFilterScreen: undefined;
    NodeScreen: {
        marker: TNodeSchema;
    };
    NodedataScreen: {
        tagId: string;
        lidNode: string;
    };
    NodedataCreatorTagScreen: {
        tag: ITag;
        lid: string;
    };
    NodedataCreatorScreen: {
        lid: string;
    };
    ReviewScreen: {
        lid: string;
        serverNode: INode;
    };
    ReviewFormScreen: {
        lid: string;
    };
    NodeAuditScreen: {
        lid: string;
        serverNode: INode;
        isServerNodeRemove: boolean;
    };
    MapFormSearchScreen: {
        queryString?: string;
    };
};

const Stack = createNativeStackNavigator<MapLocalStackParamList>();

const MapLocalStack = ({}) => {
    const {colorScheme} = useColorScheme();
    return (
        <View style={{flex: 1, paddingTop: 0}} tw="bg-s-100 dark:bg-s-900">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <Stack.Navigator screenOptions={{}}>
                <Stack.Screen
                    name="MapLocalScreen"
                    component={MapLocalScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="MapLocalFilterScreen"
                    component={MapLocalFilterScreen}
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name={ScreenKeys.NodeScreen}
                    component={NodeScreen}
                    options={{
                        // statusBarAnimation: 'none',
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="ReviewScreen"
                    component={ReviewScreen}
                    options={{
                        headerShown: false,
                        // statusBarAnimation: 'none',
                        animation: 'slide_from_right',
                        // headerShown: false,
                        // presentation: 'transparentModal',
                        // animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="ReviewFormScreen"
                    component={ReviewFormScreen}
                    options={{
                        headerShown: false,
                        // presentation: 'transparentModal',
                        animation: 'slide_from_right',

                        // headerShown: false,
                        // presentation: 'transparentModal',
                        // animation: 'none',
                    }}
                />

                <Stack.Screen
                    name="NodedataScreen"
                    component={NodedataScreen}
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />

                <Stack.Screen
                    name="NodedataCreatorScreen"
                    component={NodedataCreatorScreen}
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="NodedataCreatorTagScreen"
                    component={NodedataCreatorTagScreen}
                    options={{
                        // statusBarAnimation: 'none',
                        // animation: 'slide_from_right',
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
                <Stack.Screen
                    name="NodeAuditScreen"
                    component={NodeAuditScreen}
                    options={{
                        // statusBarAnimation: 'none',
                        // animation: 'slide_from_right',
                        headerShown: false,
                        // presentation: 'transparentModal',
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="MapFormSearchScreen"
                    component={MapFormSearchScreen}
                    options={{
                        // statusBarAnimation: 'none',
                        // animation: 'slide_from_right',
                        headerShown: false,
                        // presentation: 'transparentModal',
                        animation: 'none',
                    }}
                />
            </Stack.Navigator>
        </View>
    );
};

export default MapLocalStack;
