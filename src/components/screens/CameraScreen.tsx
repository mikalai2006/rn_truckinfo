import {NavigationProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    Pressable,
    View,
    ActivityIndicator,
    PermissionsAndroid,
    TouchableOpacity,
    Platform,
    Text,
    StyleSheet,
    BackHandler,
} from 'react-native';
import {
    Camera,
    useCameraDevices,
    useCameraFormat,
    PhotoFile,
    TakePhotoOptions,
    TakeSnapshotOptions,
    useCameraDevice,
    CameraPermissionStatus,
} from 'react-native-vision-camera';

import {tokens, user} from '../../store/appSlice';
import {useAppSelector} from '../../store/hooks';

const CameraScreen = ({route, navigation}) => {
    const {service, serviceId} = route?.params;

    const isFocused = useIsFocused();
    // const [isActive, setActive] = useState(true);
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('beforeRemove', () => {
    //         setActive(false);
    //     });
    //     return unsubscribe;
    //     // const backAction = () => {
    //     //     console.log('Hold on!', 'Are you sure you want to go back?', [
    //     //         // {
    //     //         //   text: 'Cancel',
    //     //         //   onPress: () => null,
    //     //         //   style: 'cancel',
    //     //         // },
    //     //         // {text: 'YES', onPress: () => BackHandler.exitApp()},
    //     //     ]);
    //     //     // navigation.navigate('MapStack');
    //     //     //navigation.goBack();
    //     //     setActive(false);
    //     //     setTimeout(() => {
    //     //         navigation.goBack();
    //     //     }, 1000);
    //     //     return false;
    //     // };

    //     // const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    //     // return () => backHandler.remove();
    // }, [navigation]);

    const token = useAppSelector(tokens);
    const userData = useAppSelector(user);
    const camera = React.useRef<Camera>(null);

    // const devices = useCameraDevices();
    //const device = devices.find(x => x.name == 'back');
    const device = useCameraDevice('back');
    // const format = useCameraFormat(device);

    const [flash, setFlash] = React.useState<'off' | 'on'>('on');
    const takePhotoOptions = React.useMemo<TakePhotoOptions & TakeSnapshotOptions>(
        () => ({
            photoCodec: 'jpeg',
            qualityPrioritization: 'speed',
            flash: flash,
            quality: 90,
            skipMetadata: true,
        }),
        [flash],
    );

    const createFormData = (photo: PhotoFile, body = {}) => {
        const data = new FormData();

        data.append('images', {
            name: 'test.jpg',
            type: 'image/jpeg',
            uri: Platform.OS === 'ios' ? photo.path.replace('file://', '') : `file://${photo.path}`,
        });

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };

    const handleUploadPhoto = async photo => {
        console.log('tokenAccess', token);
        // const imageResponse = await fetch(photo.path);
        // console.log('imageResponse', imageResponse);
        // const imageBlob = await imageResponse.blob();
        // console.log('imageBlob', imageBlob);
        if (!userData) {
            return;
        }
        if (!serviceId || !service) {
            console.log('No service!');
            return;
        }

        fetch(`http://localhost:8000/api/v1/image`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                'Access-Control-Allow-Origin-Type': '*',
            },
            body: createFormData(photo, {serviceId, service, dir: 'dir'}),
        })
            .then(res => res.json())
            .then(response => {
                console.log('response', response);
            })
            .catch(error => {
                console.log('error', error);
            });
    };

    const onMediaCaptured = React.useCallback(
        (media: PhotoFile, type: 'photo') => {
            console.log(`Media captured! ${JSON.stringify(media)}`);
            navigation.navigate('MediaScreen', {
                path: media.path,
                type: type,
            });
        },
        [navigation],
    );

    const takePhoto = React.useCallback(async () => {
        try {
            if (camera.current == null) {
                throw new Error('Camera ref is null!');
            }

            console.log('Taking photo...', token);
            const photo = await camera.current.takePhoto(takePhotoOptions);
            handleUploadPhoto(photo);
            onMediaCaptured(photo, 'photo');
            // fetch(`file://${photo.path}`)
            //   .then(res => {
            //     console.log(res._bodyBlob, 'test.jpg');
            //   })
            //   .catch(err => {
            //     console.log('err', err);
            //   });
        } catch (e) {
            console.error('Failed to take photo!', e);
        }
    }, [camera, onMediaCaptured, takePhotoOptions]);

    // const requestCameraPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
    //             title: 'Cool Photo App Camera Permission',
    //             message: 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.',
    //             buttonNeutral: 'Ask Me Later',
    //             buttonNegative: 'Cancel',
    //             buttonPositive: 'OK',
    //         });
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('You can use the camera');
    //         } else {
    //             console.log('Camera permission denied');
    //         }
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // };

    // const getPermission = async () => {
    //     await requestCameraPermission();
    //     const cameraPermission = await Camera.getCameraPermissionStatus();
    //     return cameraPermission === 'authorized';
    // };

    // if (!getPermission()) {
    //     return <Text>Not access permission...</Text>;
    // }
    // if (device == null) {
    //     return <ActivityIndicator />;
    // }
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();
    useEffect(() => {
        Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, []);

    console.log(`Re-rendering Navigator. Camera: ${cameraPermission}`);

    useEffect(() => {
        async function getPermission() {
            const permission = await Camera.requestCameraPermission();
            console.log(`Camera permission status: ${permission}`);
            // if (permission === 'denied') await Linking.openSettings();
        }
        getPermission();
    }, []);

    if (cameraPermission == null) {
        // still loading
        return null;
    }

    const showPermissionsPage = cameraPermission === 'granted';

    if (device == null) {
        return null;
    }

    return (
        showPermissionsPage && (
            <View tw="flex-1">
                <View tw="absolute bottom-0 w-full z-10 p-4 flex flex-col items-center">
                    <TouchableOpacity>
                        <Pressable
                            tw="p-6 bg-black/20 rounded-full flex flex-col items-center justify-center"
                            onPress={takePhoto}>
                            <Icon name="photo-camera" size={70} color="white" />
                            <Text>{token.access_token}</Text>
                        </Pressable>
                    </TouchableOpacity>
                </View>
                <Camera
                    ref={camera}
                    device={device}
                    isActive={isFocused}
                    video={false}
                    // format={format}
                    photo={true}
                    enableZoomGesture={true}
                    // orientation="landscapeLeft"
                    style={StyleSheet.absoluteFill}
                    tw="absolute h-full w-full z-0"
                />
            </View>
        )
    );
};

export default CameraScreen;
