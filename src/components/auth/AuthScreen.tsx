import {View, ActivityIndicator, Platform, Image, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import useAuth from '~hooks/useAuth';
import {HOST_API} from '@env';

import {useAppDispatch, useAppSelector} from '~store/hooks';
import {setTokens, tokens} from '~store/appSlice';
import WebView from 'react-native-webview';
import {useColorScheme} from 'nativewind';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import BottomSheet from '@gorhom/bottom-sheet';
import colors from '~utils/colors';
import UIBottomSheet from '~components/ui/UIBottomSheet';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';

const source = require('./auth.html');
const webviewSource = Image.resolveAssetSource(source);

const AuthScreen = () => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {colorScheme} = useColorScheme();
    const navigation = useNavigation();
    // const {onMessage} = useOnMessage();

    const refBottomSheet = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['96%'], []);
    const closeSheet = () => {
        navigation?.canGoBack() && navigation.goBack();
    };
    const activeIndex = React.useRef(0);

    // const activeLanguageFromStore = useAppSelector(activeLanguage);
    const tokensFromStore = useAppSelector(tokens);
    const {onGetIam, isTokenExpired} = useAuth();

    console.log('Render AuthScreen: ');

    // const ref = useRef<BottomSheet>(null);
    // const snapPoints = [-300, -600];
    // const onPress = useCallback(() => {
    //     const isActive = ref?.current?.isActive();
    //     if (!isActive) {
    //         ref?.current?.scrollTo(snapPoints[0]);
    //     } else {
    //         ref?.current?.scrollTo(snapPoints[1]);
    //     }
    // }, []);

    // const closeSheet = () => {
    //     navigation.canGoBack() && navigation.goBack();
    // };

    useEffect(() => {
        console.log('useEffect AuthScreen: token.access_token=', tokensFromStore);

        if (!tokensFromStore) {
            //navigation.navigate('AuthScreen');
            console.log('expand', refBottomSheet?.current);

            refBottomSheet?.current?.expand();
        } else if (tokensFromStore.access_token && tokensFromStore.refresh_token && !isTokenExpired()) {
            console.log('Get user');
            onGetIam();
            // ref?.current?.forceClose();
            closeSheet();
            // navigation.goBack();
        } else {
            console.log('Her');
        }
    }, [tokensFromStore]);

    let authWebview = useRef<WebView>();
    const initDark = useCallback(() => {
        authWebview.current?.injectJavaScript(
            `(function() {
        document.dispatchEvent(new MessageEvent('message',
          ${JSON.stringify({
              data: {
                  event: 'dark',
                  dark: colorScheme === 'dark',
              },
          })}));
      })();
      `,
        );
    }, [colorScheme]);

    useEffect(() => {
        initDark();
        return () => {};
    }, [initDark]);

    const userAgent = useMemo(
        () =>
            Platform.OS === 'android'
                ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
                : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75',
        [],
    );

    // useEffect(() => {
    //     if (!tokensFromStore?.access_token) {
    //         authWebview.current?.injectJavaScript(
    //             `(function() {
    //                 document.dispatchEvent(new MessageEvent('message',
    //                 ${JSON.stringify({
    //                     data: {
    //                         event: 'logout',
    //                     },
    //                 })}));
    //   })();
    //   `,
    //         );
    //         // navigation.navigate('AuthScreen');
    //     }
    // }, [tokensFromStore.access_token]);

    const sendMessage = (newNavState: any) => {
        // console.log('newNavState: ', newNavState);

        const {url} = newNavState;
        let access_token = '';
        let refresh_token = '';
        let expires_in = 0;
        let error = '';
        if (url) {
            const URLData = url.split('?');
            const URLParams = URLData && URLData[1] && URLData[1].length ? URLData[1].split('&') : [];
            URLParams.forEach((element: any) => {
                const [name, value] = element.split('=');
                if (name === 'token') {
                    // console.log('Find token: ', value);
                    access_token = value;
                } else if (name === 'rt') {
                    // console.log('Find rtoken: ', value);
                    refresh_token = value;
                } else if (name === 'exp') {
                    // console.log('Find rtoken: ', value);
                    expires_in = +value;
                } else if (name === 'error') {
                    // console.log('Find rtoken: ', value);
                    error = value;
                }
            });

            if (error) {
                dispatch(setTokens(null));
                refBottomSheet?.current?.forceClose();
            }

            if (access_token && refresh_token) {
                // console.log('Dispatch tokens: ', {access_token, refresh_token});
                dispatch(setTokens({access_token, refresh_token, expires_in}));
            }
        }

        authWebview.current?.injectJavaScript(
            `(function() {
                        document.onselectstart = event => {
                            event.preventDefault();
                        };
                    })();
                    `,
        );
    };

    const {isConnected} = useNetInfo();
    const runFirst = useMemo(
        () =>
            !isConnected
                ? `
        window.hapi = "${HOST_API}"
        document.getElementById('title').textContent = "${t('general:oauthTitleDisconnect')}";
        document.getElementById('description').textContent = "${t('general:oauthTitleDisconnectDescription')}";
        document.getElementById('buttons').style.display = 'none'
        true;
        
        `
                : `
        window.hapi = "${HOST_API}"
        document.getElementById('title').textContent = "${t('general:oauthTitle')}";
        document.getElementById('description').textContent = "${t('general:oauthDescription')}";
        true; // note: this is required, or you'll sometimes get silent failures
    `,
        [isConnected],
    );

    return (
        <View tw="flex-1 pt-8 pb-3 px-0 bg-white dark:bg-s-900">
            {/* <UIBottomSheet
                ref={refBottomSheet}
                onClose={() => {
                    closeSheet();
                }}
                snapPoints={snapPoints}
                onAnimate={(from, to) => {
                    activeIndex.current = to;
                }}
                index={activeIndex.current}
                enablePanDownToClose={true}
                enableContentPanningGesture={false}
                backgroundStyle={{backgroundColor: colors.w}}> */}
            {/* <NativeViewGestureHandler disallowInterruption={true}> */}
            <View tw="flex-1 rounded-xl overflow-hidden">
                {isConnected ? (
                    <WebView
                        ref={authWebview}
                        mixedContentMode={'always'}
                        sharedCookiesEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        originWhitelist={['*']}
                        renderLoading={() => (
                            <View tw="flex-1 absolute top-0 left-0 bottom-0 right-0 items-center justify-center">
                                <ActivityIndicator size={30} />
                            </View>
                        )}
                        onNavigationStateChange={newNavState => {
                            sendMessage(newNavState);
                        }}
                        userAgent={userAgent}
                        // source={{uri: 'file:///android_asset/auth.html'}}
                        source={webviewSource}
                        // source={{
                        //     uri: `${HOST}/${activeLanguageFromStore?.code || 'en'}/authmobileapp`,
                        // }}
                        setSupportMultipleWindows={false}
                        onMessage={event => {
                            //onMessage(event);
                            // console.log('onMessage: ');
                        }}
                        injectedJavaScript={runFirst}
                    />
                ) : !isConnected ? (
                    <View tw="p-4 px-8">
                        <Text tw="text-xl mb-2 font-bold text-red-500 dark:text-red-300">
                            {t('general:oauthTitleDisconnect')}
                        </Text>
                        <Text tw="text-base leading-5 text-s-900 dark:text-s-200">
                            {t('general:oauthTitleDisconnectDescription')}
                        </Text>
                    </View>
                ) : null}
                {/* {token.access_token && !err ? (
                                <View tw="flex-1 absolute top-0 left-0 bottom-0 right-0 items-center justify-center">
                                    <ActivityIndicator size={30} />
                                </View>
                            ) : null} */}
                {/* </NativeViewGestureHandler> */}
                {/* </UIBottomSheet> */}
            </View>
        </View>
    );
};

export default AuthScreen;
