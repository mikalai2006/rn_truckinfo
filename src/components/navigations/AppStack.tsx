import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useWindowDimensions} from 'react-native';
import {useColorScheme} from 'nativewind';

import {tokens, user} from '../../store/appSlice';
import colors from '../../utils/colors';
import SettingStack from './SettingStack';
import {useAppSelector} from '~store/hooks';
import {CustomDrawer} from './CustomDrawer';
import MapLocalStack from './MapLocalStack';
import {useTranslation} from 'react-i18next';
import {HelpScreen, HomeScreen, SyncScreen} from '~components/screens';
import AdminScreen from '~components/screens/AdminScreen';

const Drawer = createDrawerNavigator();

export default function AppStack() {
    const dimensions = useWindowDimensions();
    const {colorScheme} = useColorScheme();

    const {t} = useTranslation();
    const tokensFromStore = useAppSelector(tokens);
    const userFromStore = useAppSelector(user);

    // console.log('Render AppStack');

    return (
        <>
            <Drawer.Navigator
                drawerContent={props => <CustomDrawer {...props} />}
                screenOptions={{
                    // drawerHideStatusBarOnOpen: true,
                    drawerPosition: 'left',
                    // header: () => {},
                    headerShown: false,
                    // overlayColor: 'transparent',
                    headerShadowVisible: false,
                    drawerStyle: {
                        borderColor: colorScheme === 'dark' ? colors.s[900] : colors.s[200],
                        shadowColor: colorScheme === 'dark' ? colors.s[900] : colors.s[200],
                        backgroundColor: colorScheme === 'dark' ? colors.s[900] : colors.s[200],
                    },
                    drawerType: dimensions.width >= 1024 ? 'permanent' : 'front',
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#0f172a' : colors.p[500],
                    },
                    headerTintColor: colorScheme !== 'dark' ? colors.p[100] : colors.p[500],
                    headerTitleStyle: {
                        color: colorScheme !== 'dark' ? '#0f172a' : colors.p[500],
                    },
                    drawerItemStyle: {},
                    drawerActiveTintColor: colorScheme !== 'dark' ? colors.p[500] : colors.p[100],
                    drawerInactiveTintColor: colorScheme !== 'dark' ? colors.s[900] : colors.s[100],
                }}
                initialRouteName={'MapLocalStack'}>
                {/* <Drawer.Screen name="MapStack" component={MapStack} /> */}
                {/* <Drawer.Screen
                    name="HomeScreen"
                    component={HelpScreen}
                    options={{title: t('general:screenHomeTitle')}}
                /> */}
                <Drawer.Screen
                    name="MapLocalStack"
                    component={MapLocalStack}
                    options={{title: t('general:screenMapTitle')}}
                />
                <Drawer.Screen
                    name="SyncScreen"
                    component={SyncScreen}
                    options={{title: t('general:screenSyncTitle')}}
                />
                {tokensFromStore?.access_token ? (
                    <>
                        <Drawer.Screen
                            name="SettingStack"
                            component={SettingStack}
                            options={{
                                // drawerItemStyle: {display: 'none'},
                                // drawerIcon: ({focused, size}) => (
                                //     <Icon name="cog" size={24} color={colorScheme === 'dark' ? colors.s[100] : colors.s[500]} />
                                // ),
                                title: t('general:screenSettingTitle'),
                                // drawerItemStyle: {
                                //     display: 'none',
                                // },
                            }}
                        />
                    </>
                ) : null}
                {/* <Drawer.Screen
                    name="HelpScreen"
                    component={HelpScreen}
                    options={{title: t('general:screenHelpTitle')}}
                /> */}
                {userFromStore?.roles.includes('admin') && (
                    <Drawer.Screen
                        name="AdminScreen"
                        component={AdminScreen}
                        options={{title: t('general:screenAdminTitle')}}
                    />
                )}
            </Drawer.Navigator>
        </>
    );
}
