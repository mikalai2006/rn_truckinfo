import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import i18n from 'i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AuthScreen} from '~components/screens';
import AppStack from './AppStack';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';
import Onboarding from '~components/Onboarding';
// import {WidgetSync} from '~components/widgets/sync/WidgetSync';
import {useAppSelector} from '~store/hooks';
import {isDark, languages, tokens} from '~store/appSlice';
// import {WidgetInitApp} from '~components/widgets/init/WidgetInitApp';
import WidgetInitAuth from '~components/widgets/init/WidgetInitAuth';
import useAuth from '~hooks/useAuth';
import {WidgetInitAppWithAuth} from '~components/widgets/init/WidgetInitAppWithAuth';
import {WidgetInitApp} from '~components/widgets/init/WidgetInitApp';
import {WidgetSyncLocal} from '~components/widgets/sync/WidgetSyncLocal';
import {setMode} from '~utils/mode';

const Stack = createNativeStackNavigator();

const HelloStack = () => {
    // console.log('Render HelloStack');

    const {colorScheme} = useColorScheme();

    const {setColorScheme} = useColorScheme();
    const isDarkFromStore = useAppSelector(isDark);
    const tokenFromStore = useAppSelector(tokens);
    const {isTokenExpired} = useAuth();

    const [showApp, setShowApp] = useState(false);

    // useEffect(() => {
    //     setTimeout(() => {
    //         setShowApp(true);
    //     }, 1000);
    // }, []);

    useEffect(() => {
        setColorScheme(isDarkFromStore ? 'dark' : 'light');
        setMode(isDarkFromStore ? 'dark' : 'light');
        setShowApp(true);
    }, [isDarkFromStore, setColorScheme]);

    const [showInitBlok, setShowInitBlock] = useState(false);
    useEffect(() => {
        if (tokenFromStore && !isTokenExpired()) {
            setShowInitBlock(true);
        }
    }, [tokenFromStore]);

    const languagesFromStore = useAppSelector(languages);

    useEffect(() => {
        if (languagesFromStore.length > 0) {
            for (const lang of languagesFromStore) {
                i18n.addResourceBundle(lang.code, 'general', lang.localization, true);
            }
        }
    }, [languagesFromStore]);

    return (
        <View tw="flex-1 pt-0">
            <WidgetInitApp />
            {showApp && languagesFromStore.length > 0 ? (
                <View tw="flex-1 bg-white dark:bg-s-900">
                    <FocusStatusBar
                        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                        translucent
                        backgroundColor="transparent"
                    />
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                        }}
                        initialRouteName={'AppStack'}>
                        <Stack.Screen name="AppStack" component={AppStack} />
                        <Stack.Screen name="Onboarding" component={Onboarding} />
                        <Stack.Screen
                            name="AuthScreen"
                            component={AuthScreen}
                            options={{
                                headerShown: false,
                                // presentation: 'transparentModal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                    </Stack.Navigator>
                    <WidgetInitAuth />
                    {showInitBlok ? (
                        <>
                            <WidgetInitAppWithAuth />
                            <WidgetSyncLocal />
                        </>
                    ) : (
                        ''
                    )}
                </View>
            ) : (
                <View tw="flex-1 items-center justify-center">
                    <ActivityIndicator size={50} />
                </View>
            )}
        </View>
    );
};

// const styles = {
//     root: {flex: 1, paddingTop: 0},
// };

export default HelloStack;
