import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useWindowDimensions} from 'react-native';
import {useColorScheme} from 'nativewind';

import {tokens} from '../../store/appSlice';
import colors from '../../utils/colors';
import SettingStack from './SettingStack';
import {useAppSelector} from '~store/hooks';
import {CustomDrawer} from './CustomDrawer';
import MapLocalStack from './MapLocalStack';
import {useTranslation} from 'react-i18next';
import {HomeScreen, SyncScreen} from '~components/screens';

const Drawer = createDrawerNavigator();

export default function AppStack() {
    const dimensions = useWindowDimensions();
    const {colorScheme} = useColorScheme();

    const {t} = useTranslation();
    const tokensFromStore = useAppSelector(tokens);

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
                initialRouteName={'HomeScreen'}>
                {/* <Drawer.Screen name="MapStack" component={MapStack} /> */}
                <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{title: t('general:homeScreen')}} />
                <Drawer.Screen
                    name="MapLocalStack"
                    component={MapLocalStack}
                    options={{title: t('general:mapScreen')}}
                />
                <Drawer.Screen name="SyncScreen" component={SyncScreen} />
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
                                title: t('general:settingsScreen'),
                            }}
                        />
                    </>
                ) : null}
            </Drawer.Navigator>
        </>
    );
}
