import {View, Text, ImageBackground, Modal, Alert, Platform, ActivityIndicator, Image} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {tokens, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RButton from './r/RButton';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '~utils/colors';
import SwitchMode from './SwitchMode';
import RImage from './r/RImage';
import useOnMessage from '~hooks/useOnMessage';

const HeaderUserInfo = () => {
    const navigation = useNavigation();
    const userData = useAppSelector(user);
    const token = useAppSelector(tokens);
    const {onMessage} = useOnMessage();

    return (
        <>
            {userData ? (
                <View tw="bg-s-300 rounded-full">
                    {userData?.images ? (
                        <Image
                            tw="h-10 w-10 rounded-full"
                            source={{
                                uri: `http://localhost:3000/images/${userData.images[0].userId}/${userData.images[0].service}/${userData.images[0].serviceId}/320-${userData.images[0].path}${userData.images[0].ext}`,
                            }}
                        />
                    ) : (
                        <Text>No</Text>
                    )}
                    {/* <Text tw="text-black dark:text-white font-bold text-2xl">{userData?.login}</Text>
                        <View>
                            <Text tw="text-black dark:text-white">{userData?.name || userData?.id}</Text>
                        </View>
                        <View>
                            <Text tw="text-black dark:text-white">{userData?.roles}</Text>
                        </View> */}
                </View>
            ) : (
                <View tw="bg-p-600 dark:bg-p-600 p-4">
                    <RButton disabled={false} text="Войти" onPress={() => setModalVisible(!modalVisible)} />
                    <View tw="mt-4">
                        <Text tw="text-white">Войдите в аккаунт, чтобы открыть все возможности приложения</Text>
                    </View>
                </View>
            )}
        </>
    );
};

export default HeaderUserInfo;
