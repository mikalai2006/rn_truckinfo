import {hostAPI} from '~utils/global';

import {Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import RTitle from '~components/r/RTitle';
import {NavigationProp} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {setUser, tokens, user} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iCamera, iImage} from '~utils/icons';
import RImage from '~components/r/RImage';
import RImagePicker from '~components/r/RImagePicker';
import {ImagePickerResponse} from 'react-native-image-picker/lib/typescript/types';
import {SafeAreaView} from 'react-native-safe-area-context';
import UIButton from '~components/ui/UIButton';

const SettingAvatarScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const userFromStore = useAppSelector(user);
    const token = useAppSelector(tokens);
    const dispatch = useAppDispatch();

    const handleUploadPhoto = useCallback(async (response: ImagePickerResponse) => {
        if (!userFromStore) {
            return;
        }

        const images = response.assets;
        if (!images?.length) {
            return;
        }

        const data = new FormData();

        data.append('images', {
            name: images[0].fileName,
            type: images[0].type,
            uri: images[0].uri,
        });
        data.append('service', 'user');
        data.append('serviceId', userFromStore.id);

        if (!token) {
            return;
        }

        fetch(`${hostAPI}/image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                'Access-Control-Allow-Origin-Type': '*',
            },
            body: data,
        })
            .then(res => res.json())
            .then(response => {
                console.log('response', response);
                dispatch(setUser({...userFromStore, images: [...response]}));
            })
            .catch(error => {
                console.log('error', error);
            });
    }, []);

    const onResponse = useCallback(
        (response: ImagePickerResponse) => {
            console.log('response: ', response);
            handleUploadPhoto(response);
        },
        [handleUploadPhoto],
    );

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950 border-b border-s-200 dark:border-s-900">
            <View tw="px-6 pt-4">
                <RTitle text={t('general:avatar')} />
            </View>
            <View tw="mt-2 mx-auto">
                {userFromStore?.images ? <RImage image={userFromStore.images[0]} /> : <Text>No</Text>}
            </View>
            <View tw="flex-auto p-6">
                <RImagePicker
                    action={{
                        type: 'library',
                        options: {
                            selectionLimit: 1,
                            mediaType: 'photo',
                            includeBase64: false,
                            includeExtra: true,
                        },
                    }}
                    onResponse={onResponse}>
                    <View>
                        <SIcon path={iImage} size={30} tw="text-s-400" />
                    </View>
                    <View tw="flex-auto pl-4">
                        <Text tw="text-base text-s-900 dark:text-s-100">{t('general:imageSelect')}</Text>
                    </View>
                </RImagePicker>
                <RImagePicker
                    classString="mt-4"
                    action={{
                        type: 'capture',
                        options: {
                            saveToPhotos: true,
                            mediaType: 'photo',
                            includeBase64: false,
                            includeExtra: true,
                        },
                    }}
                    onResponse={onResponse}>
                    <View>
                        <SIcon path={iCamera} size={30} tw="text-s-400" />
                    </View>
                    <View tw="flex-auto pl-4">
                        <Text tw="text-base text-s-900 dark:text-s-100">{t('general:imageTakeCamera')}</Text>
                    </View>
                </RImagePicker>
            </View>
            <View tw="p-6">
                <UIButton type="default" text={t('general:back')} onPress={() => navigation.goBack()} />
            </View>
        </SafeAreaView>
    );
};

export default SettingAvatarScreen;
