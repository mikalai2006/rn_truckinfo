import {View, TouchableOpacity, Modal, Alert, ActivityIndicator, Platform} from 'react-native';
import React, {useState} from 'react';

import GoogleSVG from '../assets/misc/google.svg';
import FacebookSVG from '../assets/misc/facebook.svg';
import TwitterSVG from '../assets/misc/twitter.svg';

import WebView from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import RButtonBorder from './r/RButtonBorder';

const SocialButtons = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [userAgent, setUserAgent] = useState('');
    DeviceInfo.getUserAgent().then(r => {
        const userAgentText =
            Platform.OS === 'android'
                ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
                : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75';
        //r.replace('; wv', '');
        setUserAgent(userAgentText);
    });

    return (
        <>
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
                                    uri: 'http://localhost:3000/auth',
                                }}
                                onLoadStart={n => {
                                    // const ur = new URLSearchParams(window.location.href);
                                    console.log(n.nativeEvent.url);
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
            <View tw="flex flex-row justify-between pb-4">
                <RButtonBorder disabled={false} twClass="p-6" onPress={() => setModalVisible(true)}>
                    <GoogleSVG height={24} width={24} />
                </RButtonBorder>
                <RButtonBorder disabled={false} twClass="p-6" onPress={() => setModalVisible(true)}>
                    <FacebookSVG height={24} width={24} />
                </RButtonBorder>
                <RButtonBorder disabled={true} twClass="p-6" onPress={() => setModalVisible(true)}>
                    <TwitterSVG height={24} width={24} />
                </RButtonBorder>
            </View>
        </>
    );
};

export default SocialButtons;
