import {View, ActivityIndicator, Platform, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import useAuth from '~hooks/useAuth';
// import {useTranslation} from 'react-i18next';
import {useAppSelector} from '~store/hooks';
import {activeLanguage, tokens} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import useOnMessage from '~hooks/useOnMessage';
import {useColorScheme} from 'nativewind';

const AuthScreen = () => {
    const navigation = useNavigation();
    const {onMessage} = useOnMessage();
    const {colorScheme} = useColorScheme();

    const activeLanguageFromStore = useAppSelector(activeLanguage);
    const token = useAppSelector(tokens);
    // const userFromStore = useAppSelector(user);
    // const [err, setErr] = useState<any>(null);
    // const [loading, setLoading] = useState(false);
    const {onGetIam} = useAuth();
    // const {t} = useTranslation();

    console.log('AuthScreen Render: refresh_token=', token.refresh_token);

    const useIsMount = () => {
        const isMountRef = useRef(true);
        useEffect(() => {
            isMountRef.current = false;
        }, []);
        return isMountRef.current;
    };
    const isMount = useIsMount();

    useEffect(() => {
        if (!isMount) {
            if (token.access_token && token.access_token !== '') {
                if (token.access_token.startsWith('refresh')) {
                    authWebview.current?.injectJavaScript(
                        `(function() {
                        document.dispatchEvent(new MessageEvent('message',
                        ${JSON.stringify({
                            data: {
                                event: 'refresh_token',
                            },
                        })}));
                    })();
                    `,
                    );
                } else {
                    onGetIam().then(() => {
                        navigation.navigate('AppStack');
                    });
                }
            } else {
                navigation.navigate('AuthScreen');
            }
        }
    }, [token.access_token]);

    // const goHome = () => {
    //     // onGetIam().then(() => {
    //     //     navigation.navigate('AppStack');
    //     // });
    // };

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

    useEffect(() => {
        if (!token.access_token) {
            authWebview.current?.injectJavaScript(
                `(function() {
                    document.dispatchEvent(new MessageEvent('message',
                    ${JSON.stringify({
                        data: {
                            event: 'logout',
                        },
                    })}));
      })();
      `,
            );
            navigation.navigate('AuthScreen');
        }
    }, [token.access_token]);

    return (
        <View tw="flex-1 p-0 pt-12 bg-white dark:bg-s-900 m-0">
            <View tw="flex-1 rounded-xl overflow-hidden">
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
                    userAgent={userAgent}
                    source={{
                        uri: `http://localhost:3000/${activeLanguageFromStore?.code || 'en'}/authmobileapp`,
                        // headers: {
                        //     Cookie: `jwt-handmade=${token.refresh_token}; test=test; rtoken=${token.refresh_token}; rtoken2=${token.refresh_token}`,
                        // },
                    }}
                    onMessage={event => {
                        onMessage(event);

                        // const data = JSON.parse(event.nativeEvent.data);
                        // if (data.event === 'jwt' && data.data) {
                        //     goHome();
                        // }
                    }}
                    onLoadStart={() => {
                        console.log('onLoadStart authWebview');
                    }}
                    // injectedJavaScript={jsCode}
                    // style={{flex: 1, backgroundColor: colorScheme === 'dark' ? colors.s[900] : colors.w}}
                    // containerStyle={{flex: 1, backgroundColor: colorScheme === 'dark' ? colors.s[900] : colors.w}}
                />
                {token.access_token && (
                    <View tw="flex-1 absolute top-0 left-0 bottom-0 right-0 items-center justify-center">
                        <ActivityIndicator size={30} />
                    </View>
                )}
            </View>
        </View>
    );
};

export default AuthScreen;
