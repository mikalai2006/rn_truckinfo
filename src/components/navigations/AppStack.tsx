import React from 'react';

import {DrawerContentScrollView, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer';
import {Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import {useColorScheme} from 'nativewind';

import SettingScreen from '../screens/SettingScreen';
import MapScreen from '../screens/MapScreen';
// import CameraScreen from '../screens/CameraScreen';
// import {MediaScreen} from '../screens/MediaScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
    // setDark, setDrawer,
    tokens,
    isOpenDrawer,
    isDark,
} from '../../store/appSlice';
import {
    useAppSelector,
    // useAppDispatch
} from '../../store/hooks';
import {useSelector} from 'react-redux';

import colors from '../../utils/colors';

import HomeTabStack from './HomeTabStack';
import UserInfo from '~components/UserInfo';
import AuthScreen from '~components/screens/AuthScreen';
import useAuth from '~hooks/useAuth';
import WidgetAuthorization from '~components/widgets/WidgetAuthorization';
import MapStack from './MapStack';

const Drawer = createDrawerNavigator();

export function CustomDrawerContent(props) {
    const {onExit} = useAuth();
    const {colorScheme, setColorScheme} = useColorScheme();
    const dark = useSelector(isDark);
    const token = useSelector(tokens);

    const openDrawer = useAppSelector(isOpenDrawer);

    console.log('Refresh', openDrawer);

    React.useEffect(() => {
        if (dark) {
            setColorScheme(dark ? 'dark' : 'light');
        }
    }, [dark]);

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{
                height: '100%',
                paddingTop: 0,
            }}>
            {/* <Text>{dark ? 'dark' : 'light'}</Text> */}
            {/* <Text>{token.access_token}</Text>
      <Text>{token.refresh_token}</Text> */}
            <UserInfo />
            <View className={`flex-1 flex ${colorScheme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <View className="flex-auto m-0 p-0">
                    <DrawerItemList {...props} />
                </View>
                {token.access_token !== '' ? (
                    <View tw="p-2 border-t border-s-200 dark:border-s-700">
                        {/* <View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SettingScreen')}
                            tw="flex flex-row items-center p-3 bg-s-100 dark:bg-s-700 rounded-xl">
                            <Icon name="cog" size={24} color={colorScheme === 'dark' ? colors.s[100] : colors.s[500]} />
                            <Text tw="pl-2 text-lg">Настройки приложения</Text>
                        </TouchableOpacity>
                    </View> */}
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    onExit();
                                }}
                                tw="flex flex-row justify-end items-center p-3 bg-s-100 dark:bg-s-800 rounded-xl">
                                <Text tw="pr-2 text-lg text-s-500 dark:text-s-500">Выйти из аккаунта</Text>
                                <Icon
                                    name="exit-to-app"
                                    size={24}
                                    color={colorScheme === 'dark' ? colors.s[500] : colors.s[500]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    ''
                )}
            </View>
        </DrawerContentScrollView>
    );
}

export default function AppStack() {
    const dimensions = useWindowDimensions();
    const {colorScheme} = useColorScheme();
    const [dark, setDark] = React.useState<boolean>(false);
    const token = useSelector(tokens);

    React.useEffect(() => {
        const getDark = async () => {
            try {
                const dark = await AsyncStorage.getItem('opendraw');
                setDark(dark?.toLowerCase() === 'true');
            } catch (error) {
                console.log(error);
            }
        };
        getDark();
        console.log('Open draw');

        return () => {};
    }, []);

    return (
        <>
            <WidgetAuthorization />
            <Drawer.Navigator
                drawerContent={props => <CustomDrawerContent {...props} />}
                screenOptions={{
                    // drawerHideStatusBarOnOpen: true,
                    drawerPosition: 'left',
                    header: () => {},
                    drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#0f172a' : colors.s[100],
                    },
                    headerTintColor: colorScheme !== 'dark' ? '#0f172a' : colors.s[100],
                    headerTitleStyle: {
                        color: colorScheme !== 'dark' ? '#0f172a' : colors.s[100],
                    },
                    drawerItemStyle: {},
                    drawerActiveTintColor: colorScheme !== 'dark' ? '#4338ca' : '#a5b4fc',
                    drawerInactiveTintColor: colorScheme !== 'dark' ? '#0f172a' : '#fff',
                }}
                initialRouteName={token.access_token === '' ? 'AuthScreen' : 'HomeTabStack'}>
                <Drawer.Screen name="HomeTabStack" component={HomeTabStack} />
                <Drawer.Screen name="MapStack" component={MapStack} />
                <Drawer.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                    options={
                        {
                            // drawerItemStyle: {display: 'none'},
                            // drawerIcon: ({focused, size}) => (
                            //     <Icon name="cog" size={24} color={colorScheme === 'dark' ? colors.s[100] : colors.s[500]} />
                            // ),
                        }
                    }
                />
                <Drawer.Screen
                    name="AuthScreen"
                    component={AuthScreen}
                    options={{
                        drawerItemStyle: {display: 'none'},
                    }}
                />
                {/* <Drawer.Screen name="CameraScreen" component={CameraScreen} />
                <Drawer.Screen name="MediaScreen" component={MediaScreen} /> */}
            </Drawer.Navigator>
        </>
    );
}
