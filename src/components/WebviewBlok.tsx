import React from 'react';
import WebView from 'react-native-webview';
import {useColorScheme} from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDrawerStatus} from '@react-navigation/drawer';
import {DrawerActions, useNavigation} from '@react-navigation/native';

import {setDark, setDrawer, isOpenDrawer, isDark, tokens} from '../store/appSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {useSelector} from 'react-redux';

const WebviewBlok = props => {
    const navigation = useNavigation();
    const token = useSelector(tokens);

    const {uri, onLoadStart, ...restProps} = props;
    const webviewRef = React.useRef();
    const {colorScheme, toggleColorScheme} = useColorScheme();

    const dispatch = useAppDispatch();

    const [currentURI, setURI] = React.useState(props.source.uri);
    const newSource = {...props.source, uri: currentURI};

    React.useEffect(() => {
        webviewRef.current?.injectJavaScript(
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
        return () => {};
    }, [colorScheme]);

    // const initAuth = () => {
    //     if (token.refresh_token) {
    //         // console.log('initAuth');

    //         webviewRef.current?.injectJavaScript(
    //             `(function() {
    //       document.dispatchEvent(new MessageEvent('message',
    //       ${JSON.stringify({
    //           data: {
    //               event: 'jwt',
    //               token,
    //           },
    //       })}));
    //     })();
    //     `,
    //         );
    //     }
    // };
    // setTimeout(initAuth, 1000);

    const setDarkTheme = async (value: string) => {
        try {
            await AsyncStorage.setItem('dark', value);
        } catch (error) {
            console.log(error);
        }
    };
    const getDark = async () => {
        try {
            const dark = await AsyncStorage.getItem('dark');
            setDark(dark?.toLowerCase() === 'true');
        } catch (error) {
            console.log(error);
        }
    };

    const toggleDark = () => {
        toggleColorScheme();
        setDarkTheme((colorScheme === 'dark').toString());
        getDark();
    };
    const [dark, setDark] = React.useState<boolean>(false);

    const statusOpenDrawer = useDrawerStatus() === 'open';

    return (
        <WebView
            ref={webviewRef}
            {...restProps}
            originWhitelist={['*']}
            source={newSource}
            onShouldStartLoadWithRequest={request => {
                // If we're loading the current URI, allow it to load
                if (request.url === currentURI) return true;
                // We're loading a new URL -- change state first
                setURI(request.url);
                return false;
            }}
            sharedCookiesEnabled
            pullToRefreshEnabled
            javaScriptEnabled
            domStorageEnabled
            style={{height: '100%'}}
            onMessage={event => {
                const data = JSON.parse(event.nativeEvent.data);

                if (data.event === 'dark') {
                    toggleDark();
                    console.log('Event::: Change theme');
                } else if (data.event === 'opendraw') {
                    console.log('Event::: Open draw');
                    // setStatusOpenDraw('true');
                    // dispatch(setDrawer(statusOpenDrawer));
                    if (!statusOpenDrawer) {
                        navigation.openDrawer();
                    }
                }
                // else if (data.event === 'jwt') {
                //     dispatch(setTokens(data.data));
                // }
            }}
        />
    );
};

export default WebviewBlok;
