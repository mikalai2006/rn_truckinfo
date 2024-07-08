import {View, Text} from 'react-native';
import React from 'react';

import {tokens, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RButton from '../../r/RButton';
import RImage from '../../r/RImage';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import WidgetUserStat from './WidgetUserStat';

const WidgetUserInfoDrawer = () => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const userData = useAppSelector(user);
    const tokensFromStore = useAppSelector(tokens);

    return (
        <View tw="">
            {/* <Text tw="text-black">{JSON.stringify(token)}</Text> */}
            {tokensFromStore?.access_token ? (
                // <ImageBackground source={require('../assets/images/menu-bg.jpeg')} tw="relative p-4">
                // </ImageBackground>
                <View tw="relative">
                    <View>
                        {<RImage image={userData?.images ? userData.images[0] : null} />}
                        <Text tw="text-black dark:text-white font-bold text-2xl">{userData?.login}</Text>
                        {/* <View>
                            <Text tw="text-black dark:text-white">{userData?.name || userData?.id}</Text>
                        </View> */}
                        <View>
                            <Text tw="text-black dark:text-white">{userData?.roles}</Text>
                            {/* <Text tw="text-white">{token.refresh_token}</Text> */}
                        </View>
                    </View>
                    <WidgetUserStat userData={userData} />
                </View>
            ) : (
                <View tw="relative">
                    <View tw="p-4">
                        <Text tw="text-black dark:text-white font-bold text-2xl">{t('general:guest')}</Text>
                    </View>

                    <View tw="p-4">
                        <RButton
                            disabled={false}
                            text={t('general:loginTitle')}
                            onPress={() => {
                                //setModalVisible(!modalVisible)
                                navigation.navigate('AuthScreen');
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

export default WidgetUserInfoDrawer;
