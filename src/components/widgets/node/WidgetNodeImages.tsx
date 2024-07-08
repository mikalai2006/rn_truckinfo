import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {HOST_API} from '@env';

import {useAppSelector} from '~store/hooks';
import {IImage, INode, activeNode, tokens} from '~store/appSlice';
import RImage from '~components/r/RImage';
import SIcon from '~components/ui/SIcon';
import {iCamera, iChevronDown, iEye, iImage} from '~utils/icons';
import RImagePicker from '~components/r/RImagePicker';

import RButton from '~components/r/RButton';
import {ImagePickerResponse} from 'react-native-image-picker';
import {useTranslation} from 'react-i18next';
// import WidgetNodeImagesGallery from './WidgetNodeImagesGallery';
import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {NodeSchema} from '~schema/NodeSchema';
import {ImageSchema} from '~schema/ImageSchema';
import UIButton from '~components/ui/UIButton';
import {FlatList} from 'react-native-gesture-handler';

export interface IWidgetNodeImagesProps {
    localNode: NodeSchema | null;
    serverNode: INode | null;
    isRemovedNode: boolean;
}

const WidgetNodeImages = (props: IWidgetNodeImagesProps) => {
    const {serverNode, localNode, isRemovedNode} = props;
    const {t} = useTranslation();

    const realm = useRealm();
    const allLocaleImages = useQuery(ImageSchema, i => i);

    const [isModalVisible, setisModalVisible] = useState(false);

    const changeModalVisiblity = (status: boolean) => {
        setisModalVisible(status);
    };

    // const activeNodeFromStore = useAppSelector(activeNode);

    // const token = useAppSelector(tokens);

    const handleUploadPhoto = useCallback(
        async (response: ImagePickerResponse) => {
            if (!localNode) {
                return;
            }

            const images = response.assets;
            if (!images?.length) {
                return;
            }

            const imagesObj = images.map(x => {
                return {
                    name: x.fileName,
                    type: x.type,
                    uri: x.uri,
                };
            });

            // const data = new FormData();

            // for (let i = 0; i < images.length; i++) {
            //     data.append('images', {
            //         name: images[i].fileName,
            //         type: images[i].type,
            //         uri: images[i].uri,
            //     });
            // }
            // data.append('service', 'node');
            // data.append('serviceId', serverNode?.id); //localNode._id.toHexString()

            realm.write(() => {
                realm.create('ImageSchema', {
                    _id: new BSON.ObjectId(),
                    nlid: localNode?._id.toHexString(),
                    service: 'node',
                    serviceId: localNode.sid,
                    images: imagesObj,
                });
            });

            // fetch(HOST_API + '/image', {
            //     method: 'POST',
            //     headers: {
            //         Authorization: `Bearer ${token.access_token}`,
            //         'Access-Control-Allow-Origin-Type': '*',
            //     },
            //     body: data,
            // })
            //     .then(res => res.json())
            //     .then(response => {
            //         console.log('response', response);
            //     })
            //     .catch(error => {
            //         console.log('error', error);
            //     });
        },
        [localNode, realm],
    );

    const onResponse = useCallback(
        (response: ImagePickerResponse) => {
            //console.log('response: ', response);
            handleUploadPhoto(response);
        },
        [handleUploadPhoto],
    );

    const images = useMemo(() => {
        const localImagesForActiveNode = allLocaleImages.filter(x => x.nlid === localNode?._id.toHexString());
        // .map(x => {
        //     return {
        //         service: 'node',
        //         serviceId:
        //     }
        // });
        return localImagesForActiveNode.length ? localImagesForActiveNode : serverNode ? serverNode.images : [];
    }, [serverNode, allLocaleImages, localNode?._id]);

    return (
        <View tw="relative">
            {images.length ? (
                <FlatList
                    horizontal
                    data={images}
                    renderItem={({item}) => {
                        return (
                            <View tw="w-48 h-32 ml-3 rounded-lg overflow-hidden">
                                <RImage
                                    classString="w-full h-full"
                                    uri={
                                        item.createdAt ? '' : item.images[0].uri
                                        // 'https://lh5.googleusercontent.com/p/AF1QipO8MMrx4AwWQxTgESA_-vCaKbovWqUcofLPn1eG=w408-h306-k-no'
                                    }
                                    image={item.createdAt ? item : null}
                                />
                            </View>
                        );
                    }}
                    tw="w-full flex flex-row mb-2"
                />
            ) : null}
            <View tw="px-3">
                {!isRemovedNode && (
                    <UIButton type="default" twClass="w-full" onPress={() => changeModalVisiblity(true)}>
                        <View tw="flex flex-row items-center justify-center">
                            <SIcon path={iCamera} size={30} tw="text-s-300 dark:text-s-500" />
                            <View tw="ml-2">
                                <Text ellipsizeMode="tail" tw="text-lg text-center text-s-800 dark:text-s-300">
                                    {t('general:addPhoto')}
                                </Text>
                            </View>
                        </View>
                    </UIButton>
                )}
                {/* <RButton
                        customClass="bg-white dark:bg-s-800 p-4 rounded-lg"
                        onPress={() => changeModalVisiblity(true)}>
                        <SIcon path={iCamera} size={30} tw="text-black dark:text-white" />
                    </RButton> */}
            </View>
            <View tw="p-2 px-4 bottom-0 flex flex-row gap-x-2">
                <View>
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={isModalVisible}
                        statusBarTranslucent={true}
                        onRequestClose={() => changeModalVisiblity(false)}>
                        <TouchableOpacity
                            tw="flex-1 justify-end bg-black/70"
                            onPress={() => changeModalVisiblity(false)}>
                            <View tw="p-6 bg-s-100 dark:bg-s-950">
                                {/* <Text tw="text-black dark:text-white py-4">
                                    {localNode?.name}-{localNode?._id.toHexString()}
                                </Text> */}
                                <RImagePicker
                                    onResponse={onResponse}
                                    onPress={() => changeModalVisiblity(false)}
                                    action={{
                                        type: 'library',
                                        options: {
                                            selectionLimit: 1,
                                            mediaType: 'photo',
                                            includeBase64: false,
                                            includeExtra: true,
                                        },
                                    }}
                                    classString="">
                                    <View tw="flex flex-row items-center justify-center">
                                        <View>
                                            <SIcon path={iImage} size={30} tw="text-s-300 dark:text-s-500" />
                                        </View>
                                        <View tw="pl-4">
                                            <Text tw="text-lg text-black dark:text-s-200">
                                                {t('general:imageSelect')}
                                            </Text>
                                        </View>
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
                                    classString="mt-3">
                                    <View tw="flex flex-row items-center justify-center">
                                        <View>
                                            <SIcon path={iCamera} size={30} tw="text-s-300 dark:text-s-500" />
                                        </View>
                                        <View tw="pl-4">
                                            <Text tw="text-lg text-black dark:text-s-200">
                                                {t('general:imageTakeCamera')}
                                            </Text>
                                        </View>
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
                {/* {localNode?.images?.length && (
                    <View>
                        <WidgetNodeImagesGallery node={props.localNode} />
                    </View>
                )} */}
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
