import {View, Text, Modal, Alert, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';

import {tokens, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RButton from './r/RButton';
import SwitchMode from './SwitchMode';
import RImage from './r/RImage';
// import DeviceInfo from 'react-native-device-info';
// import WebView from 'react-native-webview';
// import useOnMessage from '~hooks/useOnMessage';
import {useNavigation} from '@react-navigation/native';
import {ScreenKeys} from './screens';
import {useTranslation} from 'react-i18next';

const UserInfo = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const userData = useAppSelector(user);
    const tokensFromStore = useAppSelector(tokens);
    // const {onMessage} = useOnMessage();

    // const [modalVisible, setModalVisible] = useState(false);
    // const [userAgent, setUserAgent] = useState('');

    // useEffect(() => {
    //     const setAgent = () => {
    //         console.log('setAgent');
    //         DeviceInfo.getUserAgent().then(r => {
    //             const userAgentText =
    //                 Platform.OS === 'android'
    //                     ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
    //                     : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75';
    //             //r.replace('; wv', '');
    //             setUserAgent(userAgentText);
    //         });
    //     };
    //     setAgent();
    // }, []);

    // useEffect(() => {
    //     if (token.access_token) {
    //         setModalVisible(false);
    //     }
    // }, [token.access_token]);

    return (
        <View tw="relative">
            <View tw="absolute right-4 top-6 z-10">
                <SwitchMode />
            </View>
            {/* <Text tw="text-black">{JSON.stringify(token)}</Text> */}
            {tokensFromStore?.access_token ? (
                // <ImageBackground source={require('../assets/images/menu-bg.jpeg')} tw="relative p-4">
                // </ImageBackground>
                <View tw="relative p-4 pt-8 bg-s-200 dark:bg-s-900">
                    <View>
                        {userData?.images ? <RImage image={userData.images[0]} /> : <Text>No</Text>}
                        <Text tw="text-black dark:text-white font-bold text-2xl">{userData?.login}</Text>
                        {/* <View>
                            <Text tw="text-black dark:text-white">{userData?.name || userData?.id}</Text>
                        </View> */}
                        <View>
                            <Text tw="text-black dark:text-white">{userData?.roles}</Text>
                            {/* <Text tw="text-white">{token.refresh_token}</Text> */}
                        </View>
                    </View>
                </View>
            ) : (
                <View tw="relative pt-8 bg-s-200 dark:bg-s-900">
                    <View tw="p-4">
                        <Text tw="text-black dark:text-white font-bold text-2xl">{t('general:guest')}</Text>
                    </View>

                    <View tw="p-4">
                        <RButton
                            disabled={false}
                            text={t('form:loginTitle')}
                            onPress={() => {
                                //setModalVisible(!modalVisible)
                                navigation.navigate(ScreenKeys.AuthScreen);
                            }}
                        />
                        {/* <View tw="mt-4">
                            <Text tw="text-s-800 dark:text-s-200 text-base leading-5">{t('general:authInvite')}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Onboarding');
                                }}>
                                <Text tw="underline text-base text-black dark:text-white">
                                    {t('general:authBonuses')}
                                </Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            )}

            {/* <Modal
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
                    </View>
                </View>
            </Modal> */}
        </View>
    );
};

export default UserInfo;
