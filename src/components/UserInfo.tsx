import {View, Text, Modal, Alert, Platform, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';

import {tokens, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RButton from './r/RButton';
import SwitchMode from './SwitchMode';
import RImage from './r/RImage';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';
import useOnMessage from '~hooks/useOnMessage';

const UserInfo = () => {
    const userData = useAppSelector(user);
    const token = useAppSelector(tokens);
    const {onMessage} = useOnMessage();

    const [modalVisible, setModalVisible] = useState(false);
    const [userAgent, setUserAgent] = useState('');

    useEffect(() => {
        const setAgent = () => {
            console.log('setAgent');
            DeviceInfo.getUserAgent().then(r => {
                const userAgentText =
                    Platform.OS === 'android'
                        ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
                        : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75';
                //r.replace('; wv', '');
                setUserAgent(userAgentText);
            });
        };
        setAgent();
    }, []);

    // useEffect(() => {
    //     if (token.access_token) {
    //         setModalVisible(false);
    //     }
    // }, [token.access_token]);

    return (
        <>
            {/* <Text tw="text-black">{JSON.stringify(token)}</Text> */}
            {token.access_token ? (
                // <ImageBackground source={require('../assets/images/menu-bg.jpeg')} tw="relative p-4">
                // </ImageBackground>
                <View tw="relative p-4 pt-8 bg-s-200 dark:bg-s-900">
                    <View tw="absolute right-2 top-6 z-10">
                        <SwitchMode />
                    </View>
                    <View>
                        {userData?.images ? <RImage image={userData.images[0]} /> : <Text>No</Text>}
                        <Text tw="text-black dark:text-white font-bold text-2xl">{userData?.login}</Text>
                        <View>
                            <Text tw="text-black dark:text-white">{userData?.name || userData?.id}</Text>
                        </View>
                        <View>
                            <Text tw="text-black dark:text-white">{userData?.roles}</Text>
                            {/* <Text tw="text-white">{token.refresh_token}</Text> */}
                        </View>
                    </View>
                </View>
            ) : (
                <View tw="bg-p-600 dark:bg-p-600 p-4">
                    <RButton disabled={false} text="Войти" onPress={() => setModalVisible(!modalVisible)} />
                    <View tw="mt-4">
                        <Text tw="text-white">Войдите в аккаунт, чтобы открыть все возможности приложения</Text>
                    </View>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View tw="flex-1 bg-s-950/20 p-2 pt-6">
                    <View tw="flex-1 rounded-lg overflow-hidden bg-s-50 dark:bg-s-800 p-0 m-0">
                        {userAgent && (
                            <WebView
                                sharedCookiesEnabled={true}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                allowFileAccess={true}
                                allowUniversalAccessFromFileURLs={true}
                                allowFileAccessFromFileURLs={true}
                                originWhitelist={['*']}
                                onLoadProgress={() => <ActivityIndicator size={50} />}
                                setDomStorageEnabled={true}
                                userAgent={userAgent}
                                source={{
                                    uri: 'http://localhost:3000/en/auth',
                                }}
                                onLoadEnd={() => {
                                    // const ur = new URLSearchParams(window.location.href);
                                    //console.log('hello'); // n.nativeEvent.url
                                }}
                                onMessage={event => {
                                    onMessage(event);
                                }}
                            />
                        )}
                        {/* <Text tw="">Hello World!</Text>
                        <Pressable tw="bg-s-500" onPress={() => setModalVisible(!modalVisible)}>
                            <Text tw="">Hide Modal</Text>
                        </Pressable> */}
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default UserInfo;
