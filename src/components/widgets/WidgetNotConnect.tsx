import React from 'react';
import {Text, View, TouchableOpacity, Modal} from 'react-native';

import SIcon from '~components/ui/SIcon';
import {iClose, iQuestion, iWifiOff} from '~utils/icons';

import {useTranslation} from 'react-i18next';
import {useNetInfo} from '@react-native-community/netinfo';
import UIButton from '~components/ui/UIButton';

const WidgetNotConnect = () => {
    const {t} = useTranslation();
    const {isConnected} = useNetInfo();

    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <>
            {!isConnected ? (
                <>
                    <View tw="absolute top-24 left-3">
                        <TouchableOpacity
                            tw="p-2 rounded-lg bg-red-500 flex flex-row"
                            onPress={() => {
                                setModalVisible(true);
                            }}>
                            <SIcon path={iWifiOff} size={20} tw="text-white p-2 mr-2" />
                            <Text tw="text-white">{t('general:notConnectMap')}</Text>
                            <SIcon path={iQuestion} size={20} tw="text-white p-2 ml-2" />
                        </TouchableOpacity>
                    </View>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        statusBarTranslucent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View tw="flex-1 bg-black/50 p-3 pt-32">
                            <View tw="rounded-lg overflow-hidden bg-s-50 dark:bg-s-800 p-6">
                                <Text tw="text-s-800 dark:text-white text-base leading-5">
                                    {t('general:notConnectMapDescr')}
                                </Text>

                                <UIButton
                                    type="default"
                                    disabled={false}
                                    twClass="p-4 mt-6 mx-auto flex flex-row items-center"
                                    onPress={() => setModalVisible(false)}>
                                    <SIcon path={iClose} size={28} tw="text-s-800 dark:text-white" />
                                    <Text tw="text-s-800 dark:text-white text-lg">{t('general:close')}</Text>
                                </UIButton>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                ''
            )}
        </>
    );
};

export default WidgetNotConnect;
