import React, {useEffect} from 'react';
import {DrawerContentScrollView, DrawerItemList, createDrawerNavigator} from '@react-navigation/drawer';
import {Text, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import {useColorScheme} from 'nativewind';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {tokens, isDark, langCode} from '../../store/appSlice';
import colors from '../../utils/colors';
import UserInfo from '~components/UserInfo';
import useAuth from '~hooks/useAuth';
import MapStack from './MapStack';
import {HomeScreen} from '~components/screens';
import SettingStack from './SettingStack';
import {useAppSelector} from '~store/hooks';
import useLanguage from '~hooks/useLanguage';

const Drawer = createDrawerNavigator();

export function CustomDrawerContent(props) {
    const {onExit} = useAuth();
    const {colorScheme} = useColorScheme();
    const token = useAppSelector(tokens);

    // console.log('Render drawer');

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
            <View className={`flex-1 flex ${colorScheme === 'dark' ? 'bg-s-800' : 'bg-s-100'}`}>
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
    const {colorScheme, setColorScheme} = useColorScheme();
    // const [dark, setDark] = useState<boolean>(false);
    const token = useAppSelector(tokens);
    // console.log('Render AppStack');

    const isDarkFromStore = useAppSelector(isDark);

    useEffect(() => {
        setColorScheme(isDarkFromStore ? 'dark' : 'light');
    }, [isDarkFromStore, setColorScheme]);

    const activeLangCode = useAppSelector(langCode);
    const {chooseLanguage} = useLanguage();
    useEffect(() => {
        chooseLanguage(activeLangCode);
    }, []);

    // React.useEffect(() => {
    //     const getDark = async () => {
    //         try {
    //             const dark = await AsyncStorage.getItem('opendraw');
    //             setDark(dark?.toLowerCase() === 'true');
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     getDark();
    //     console.log('Open draw');

    //     return () => {};
    // }, []);

    return (
        <>
            <Drawer.Navigator
                drawerContent={props => <CustomDrawerContent {...props} />}
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
                <Drawer.Screen name="HomeScreen" component={HomeScreen} />
                <Drawer.Screen name="MapStack" component={MapStack} />
                <Drawer.Screen
                    name="SettingStack"
                    component={SettingStack}
                    options={
                        {
                            // drawerItemStyle: {display: 'none'},
                            // drawerIcon: ({focused, size}) => (
                            //     <Icon name="cog" size={24} color={colorScheme === 'dark' ? colors.s[100] : colors.s[500]} />
                            // ),
                        }
                    }
                />
            </Drawer.Navigator>
        </>
    );
}
