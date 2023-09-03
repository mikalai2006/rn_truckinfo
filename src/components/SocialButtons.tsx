import {View, TouchableOpacity, Modal, Alert} from 'react-native';
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
        const userAgentText = r.replace('; wv', '');
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
                                userAgent={userAgent}
                                source={{
                                    uri: 'https://storydata.ru/api/v1/oauth/google',
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
