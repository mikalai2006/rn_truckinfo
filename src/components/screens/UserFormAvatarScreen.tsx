import {Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import RTitle from '~components/r/RTitle';
import RButton from '~components/r/RButton';
import {NavigationProp} from '@react-navigation/native';
import {useAppSelector} from '~store/hooks';
import {tokens, user} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iCamera, iImage} from '~utils/icons';
import RImage from '~components/r/RImage';
import RImagePicker from '~components/r/RImagePicker';
import {ImagePickerResponse} from 'react-native-image-picker/lib/typescript/types';

const UserFormAvatarScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const userFromStore = useAppSelector(user);
    const token = useAppSelector(tokens);

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

        fetch(`http://localhost:8000/api/v1/image`, {
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
        <View tw="flex-1 bg-s-100 dark:bg-s-900">
            <View tw="px-6 pt-12 pb-0">
                <RTitle text={t('form:formAvatarTitle')} />
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
                        <Text tw="text-lg text-black dark:text-white">{t('form:imageSelect')}</Text>
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
                        <Text tw="text-lg text-black dark:text-white">{t('form:imageTakeCamera')}</Text>
                    </View>
                </RImagePicker>
            </View>
            <View tw="p-6">
                <RButton text={t('general:back')} onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
};

export default UserFormAvatarScreen;
