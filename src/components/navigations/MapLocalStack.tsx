import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
    NodeShortScreen,
    ReviewScreen,
    NodedataScreen,
    NodedataCreatorScreen,
    ReviewFormScreen,
    NodedataCreatorTagScreen,
    MapFilterScreen,
    NodeAuditScreen,
    MapFormSearchScreen,
    NodeMoreScreen,
    UserScreen,
    NodedataVoteScreen,
} from '~components/screens';
import {Easing, View} from 'react-native';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';
import MapLocalScreen from '~components/map/MapLocalScreen';
import {NodeSchema, TNodeSchema} from '~schema/NodeSchema';
import {ILatLng, INode, ITag} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import colors from '~utils/colors';

export type MapLocalStackParamList = {
    MapLocalScreen: {
        marker?: NodeSchema;
        initialCenter?: ILatLng;
    };
    MapFilterScreen: undefined;
    NodeShortScreen: {
        marker: TNodeSchema;
    };
    NodeMoreScreen: {
        lidNode: string;
        serverNode: INode;
        isServerNodeRemove: boolean;
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
    UserScreen: {
        userId?: string;
    };
    NodedataVoteScreen: {
        nodedataId?: string;
    };
};

const Stack = createStackNavigator<MapLocalStackParamList>();

const MapLocalStack = ({}) => {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colorScheme !== 'dark' ? colors.s[100] : colors.s[950],
                },
                headerTitleStyle: {
                    color: colorScheme !== 'dark' ? colors.s[900] : colors.s[200],
                },
                headerTintColor: colorScheme !== 'dark' ? colors.s[900] : colors.s[200],
            }}
            initialRouteName="MapLocalScreen">
            <Stack.Screen
                name="MapLocalScreen"
                component={MapLocalScreen}
                options={{
                    headerShown: false,
                    // animation: 'none',
                }}
            />
            <Stack.Screen
                name="MapFilterScreen"
                component={MapFilterScreen}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    // animation: 'slide_from_right',
                    // freezeOnBlur: true,
                }}
            />
            <Stack.Screen
                name="NodeShortScreen"
                component={NodeShortScreen}
                options={{
                    // statusBarAnimation: 'none',
                    headerShown: false,
                    presentation: 'transparentModal',
                    // animation: 'none',
                    // transitionSpec: {
                    //     open: {
                    //         animation: 'spring',
                    //         config: {
                    //             stiffness: 1000,
                    //             damping: 100,
                    //             mass: 3,
                    //             overshootClamping: true,
                    //             restDisplacementThreshold: 0.01,
                    //             restSpeedThreshold: 0.01,
                    //         },
                    //     },
                    //     close: {
                    //         animation: 'timing',
                    //         config: {
                    //             easing: Easing.linear,
                    //             duration: 300,
                    //         },
                    //     },
                    // },
                }}
            />
            <Stack.Screen
                name="ReviewScreen"
                component={ReviewScreen}
                options={{
                    headerShown: false,
                    // // statusBarAnimation: 'none',
                    // animation: 'slide_from_right',
                    // // headerShown: false,
                    // // presentation: 'transparentModal',
                    // // animation: 'none',
                    presentation: 'transparentModal',
                }}
            />
            <Stack.Screen
                name="ReviewFormScreen"
                component={ReviewFormScreen}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    // // presentation: 'transparentModal',
                    // animation: 'slide_from_right',

                    // // headerShown: false,
                    // // presentation: 'transparentModal',
                    // // animation: 'none',
                }}
            />
            <Stack.Screen
                name="NodedataVoteScreen"
                component={NodedataVoteScreen}
                options={{
                    headerShown: false,
                    // animation: 'slide_from_right',
                    presentation: 'transparentModal',
                }}
            />

            <Stack.Screen
                name="NodedataScreen"
                component={NodedataScreen}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    // animation: 'slide_from_right',
                    // freezeOnBlur: true,
                    title: t('general:screenNodedataTitle'),
                }}
            />

            <Stack.Screen
                name="NodedataCreatorScreen"
                component={NodedataCreatorScreen}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    // animation: 'none',
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
                    // animation: 'none',
                }}
            />
            <Stack.Screen
                name="NodeAuditScreen"
                component={NodeAuditScreen}
                options={{
                    // statusBarAnimation: 'none',
                    // animation: 'slide_from_right',
                    headerShown: false,
                    presentation: 'transparentModal',
                    // presentation: 'transparentModal',
                    // animation: 'slide_from_right',
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
                    // animation: 'none',
                }}
            />
            <Stack.Screen
                name="NodeMoreScreen"
                component={NodeMoreScreen}
                options={{
                    // statusBarAnimation: 'none',
                    // animation: 'slide_from_right',
                    headerShown: false,
                    // presentation: 'transparentModal',
                    // animation: 'slide_from_right',
                }}
            />
            <Stack.Screen
                name="UserScreen"
                component={UserScreen}
                options={{
                    // statusBarAnimation: 'none',
                    // animation: 'slide_from_right',
                    headerShown: false,
                    presentation: 'transparentModal',
                    // animation: 'slide_from_right',
                }}
            />
        </Stack.Navigator>
    );
};

export default MapLocalStack;
