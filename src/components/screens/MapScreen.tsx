import React, {useCallback, useRef} from 'react';
import {View} from 'react-native';
import WidgetMapFromSite, {MapBottomSheetRefProps} from '~components/widgets/WidgetMapFromSite';

const MapScreen = ({navigation}) => {
    console.log('MapScreen');

    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         console.log('focus map');
    //         webviewRef.current && webviewRef.current.reload();
    //     });

    //     // Return the function to unsubscribe from the event so it gets removed on unmount
    //     return unsubscribe;
    // }, [navigation]);

    // let webviewRef = useRef();

    // const setJWT = async value => {
    //     try {
    //         await AsyncStorage.setItem('jwt', value);

    //         console.log('jwt=', value);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // const getJWT = async () => {
    //     try {
    //         // const userData = JSON.parse(await AsyncStorage.getItem('jwt'));
    //         const jwt = await AsyncStorage.getItem('jwt');
    //         setJwt(jwt);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    // getJWT();

    // const watchPosition = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    //             title: 'App Location Permission',
    //             message: 'App Location Permission ' + ' are needed to help you',
    //             buttonNeutral: 'Ask Me Later',
    //             buttonNegative: 'Cancel',
    //             buttonPositive: 'OK',
    //         });
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('You can use the location');
    //             const watchID = Geolocation.watchPosition(
    //                 position => {
    //                     // webview.current.postMessage(
    //                     //   JSON.stringify({event: 'currentPosition', data: position}),
    //                     // );
    //                     webviewRef.current?.injectJavaScript(
    //                         `(function() {
    //             document.dispatchEvent(new MessageEvent('message',
    //               ${JSON.stringify({
    //                   data: {
    //                       event: 'position',
    //                       position: position,
    //                   },
    //               })}));
    //           })();
    //           `,
    //                     );
    //                     console.log('Change position', position.coords.latitude, ',', position.coords.longitude);
    //                     setPosition(JSON.stringify(position));
    //                 },
    //                 error => Alert.alert('WatchPosition Error', JSON.stringify(error)),
    //                 {
    //                     // enableHighAccuracy: false,
    //                     interval: 10,
    //                     distanceFilter: 1,
    //                     // distanceFilter: 250, // 100 meters
    //                     // maximumAge: 20000,
    //                     // timeout: 120000,
    //                 },
    //             );
    //             setSubscriptionId(watchID);
    //         } else {
    //             console.log('Location permission denied');
    //         }
    //     } catch (error) {
    //         Alert.alert('WatchPosition Error', JSON.stringify(error));
    //     }
    // };

    // const clearWatch = () => {
    //     subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    //     setSubscriptionId(null);
    //     setPosition(null);
    // };

    // const requestGeoPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    //             title: 'App Location Permission',
    //             message: 'App Location Permission ' + ' are needed to help you',
    //             buttonNeutral: 'Ask Me Later',
    //             buttonNegative: 'Cancel',
    //             buttonPositive: 'OK',
    //         });
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('You can use the location');
    //             getCurrentPosition();
    //         } else {
    //             console.log('Location permission denied');
    //         }
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // };

    // const getCurrentPosition = () => {
    //     Geolocation.getCurrentPosition(
    //         pos => {
    //             console.log('getCurrentPosition', pos);
    //             setPosition(JSON.stringify(pos));
    //         },
    //         error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
    //         {
    //             enableHighAccuracy: false,
    //             // distanceFilter: 250, // 100 meters
    //             // maximumAge: 20000,
    //             // timeout: 120000,
    //         },
    //     );
    // };

    // const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
    // const [position, setPosition] = useState<string | null>(null);
    // const [jwt, setJwt] = useState<string | null>(null);

    // useEffect(() => {
    //     return () => {
    //         clearWatch();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const mapRef = useRef<MapBottomSheetRefProps>(null);
    const onCloseSheet = useCallback(() => {
        mapRef.current?.onCloseBottomSheet();
    }, []);

    return (
        <View style={{paddingTop: 0}} tw="flex-1 bg-white dark:bg-s-900">
            {/* <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            /> */}
            {/* {featureData?.id && <WidgetFeature />} */}
            {/* <Text>
                <Text>Current position: </Text>
                {position || 'unknown'}
                {jwt}
            </Text> */}
            {/* {subscriptionId !== null ? (
                <Button title="Clear Watch" onPress={clearWatch} />
            ) : (
                <Button title="Watch Position" onPress={watchPosition} />
            )} */}
            {/* <Button title="Get Current Positions" onPress={requestGeoPermission} /> */}
            {/* <WidgetMapLeaflet /> */}
            <WidgetMapFromSite ref={mapRef} />

            {/* <MarkerStack onClose={onCloseSheet} /> */}
            {/* <WidgetMapBottomSheet onClose={onCloseSheet} /> */}

            {/* <WidgetShortInfoMarker navigation={navigation} /> */}
            {/* <View tw="absolute bottom-0">
                <Text>Feature</Text>
            </View> */}
        </View>
    );
};

export default MapScreen;
