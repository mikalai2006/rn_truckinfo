import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useAppSelector} from '~store/hooks';
import {INode, tokens} from '~store/appSlice';
import RImage from '~components/r/RImage';
import SIcon from '~components/ui/SIcon';
import {iCamera, iChevronDown, iEye, iImage} from '~utils/icons';
import RImagePicker from '~components/r/RImagePicker';

import RButton from '~components/r/RButton';
import {ImagePickerResponse} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
import WidgetNodeImagesGallery from './WidgetNodeImagesGallery';

export interface IWidgetNodeImagesProps {
    node: INode | null;
}

const WidgetNodeImages = (props: IWidgetNodeImagesProps) => {
    const {t} = useTranslation();
    const [isModalVisible, setisModalVisible] = useState(false);

    const changeModalVisiblity = (status: boolean) => {
        setisModalVisible(status);
    };

    const token = useAppSelector(tokens);

    const handleUploadPhoto = useCallback(
        async (response: ImagePickerResponse) => {
            if (!props.node) {
                return;
            }

            const images = response.assets;
            if (!images?.length) {
                return;
            }

            const data = new FormData();

            for (let i = 0; i < images.length; i++) {
                data.append('images', {
                    name: images[i].fileName,
                    type: images[i].type,
                    uri: images[i].uri,
                });
            }
            data.append('service', 'node');
            data.append('serviceId', props.node.id);

            fetch('http://localhost:8000/api/v1/image', {
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
        },
        [props.node, token.access_token],
    );

    const onResponse = useCallback(
        (response: ImagePickerResponse) => {
            console.log('response: ', response);
            handleUploadPhoto(response);
        },
        [handleUploadPhoto],
    );

    return (
        <View tw="relative flex-1">
            <RImage
                classString="absolute h-full w-full"
                uri={
                    props.node?.images?.length
                        ? ''
                        : 'https://lh5.googleusercontent.com/p/AF1QipO8MMrx4AwWQxTgESA_-vCaKbovWqUcofLPn1eG=w408-h306-k-no'
                }
                image={props.node?.images.length ? props.node.images[0] : null}
            />
            <View tw="p-2 px-4 absolute bottom-0 flex flex-row gap-x-2">
                <View>
                    <RButton
                        customClass="bg-white dark:bg-black/60 p-3 rounded-full"
                        onPress={() => changeModalVisiblity(true)}>
                        <SIcon path={iCamera} size={20} tw="text-black dark:text-white" />
                    </RButton>
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={isModalVisible}
                        statusBarTranslucent={true}
                        onRequestClose={() => changeModalVisiblity(false)}>
                        <TouchableOpacity
                            tw="flex-1 justify-end bg-black/70"
                            onPress={() => changeModalVisiblity(false)}>
                            <View tw="p-6 bg-white dark:bg-s-800 rounded-t-3xl">
                                <Text tw="text-black dark:text-white py-4">
                                    {props.node?.name}-{props.node?.id}
                                </Text>
                                <RImagePicker
                                    onResponse={onResponse}
                                    onPress={() => changeModalVisiblity(false)}
                                    action={{
                                        type: 'library',
                                        options: {
                                            selectionLimit: 0,
                                            mediaType: 'photo',
                                            includeBase64: false,
                                            includeExtra: true,
                                        },
                                    }}
                                    classString="bg-white dark:bg-s-700 border-s-200 dark:border-s-700 p-4 rounded-lg">
                                    <View>
                                        <SIcon path={iImage} size={30} tw="text-s-400" />
                                    </View>
                                    <View tw="flex-auto pl-4">
                                        <Text tw="text-lg text-black dark:text-white">{t('form:imageSelect')}</Text>
                                    </View>
                                </RImagePicker>
                                <RImagePicker
                                    onResponse={onResponse}
                                    onPress={() => changeModalVisiblity(false)}
                                    action={{
                                        type: 'capture',
                                        options: {
                                            saveToPhotos: true,
                                            mediaType: 'photo',
                                            includeBase64: false,
                                            includeExtra: true,
                                        },
                                    }}
                                    classString="bg-white dark:bg-s-700 border-s-200 dark:border-s-700 mt-4 p-4 rounded-lg">
                                    <View>
                                        <SIcon path={iCamera} size={30} tw="text-s-400" />
                                    </View>
                                    <View tw="flex-auto pl-4">
                                        <Text tw="text-lg text-black dark:text-white">{t('form:imageTakeCamera')}</Text>
                                    </View>
                                </RImagePicker>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
                <View tw="flex-auto self-start" />
                {/* <View>
                    <RButton customClass="bg-white dark:bg-black/60 p-3 rounded-full rotate-90">
                        <SIcon path={iChevronDown} size={20} tw="text-black dark:text-white" />
                    </RButton>
                </View> */}
                {props.node?.images?.length && (
                    <View>
                        <WidgetNodeImagesGallery node={props.node} />
                    </View>
                )}
                {/* <View>
                    <RButton customClass="bg-white dark:bg-black/60 p-3 rounded-full -rotate-90">
                        <SIcon path={iChevronDown} size={20} tw="text-black dark:text-white" />
                    </RButton>
                </View> */}
            </View>
        </View>
    );
};

export default WidgetNodeImages;
