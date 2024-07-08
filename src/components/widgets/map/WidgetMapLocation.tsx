import {View, PermissionsAndroid, ActivityIndicator, Alert} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Geolocation, {GeolocationResponse} from '@react-native-community/geolocation';
import LocationEnabler from 'react-native-location-enabler';
// import useTrack from '~hooks/useTrack';
// import {useAppDispatch, useAppSelector} from '~store/hooks';
// import {positions, setPositions, clearPositions} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iCenterLocation, iNoCenterLocation} from '~utils/icons';
import UIButton from '~components/ui/UIButton';
import {ILatLng} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import {useQuery, useRealm} from '@realm/react';
import {PointSchema} from '~schema/PointSchema';
import {BSON} from 'realm';

const COUNT_FILTER_NUMBER = 3;

const {
    PRIORITIES: {HIGH_ACCURACY},
    addListener,
    checkSettings,
    requestResolutionSettings,
    useLocationSettings,
} = LocationEnabler;

const config = {
    priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
    alwaysShow: true, // default false
    needBle: true, // default false
};

export interface IWidgetMapLocation {
    onChangeMyPosition: (pos: GeolocationResponse) => void;
    onSetCenterAsMyPosition: () => void;
    center: ILatLng;
    onEnableLocation: (status: boolean) => void;
}

const WidgetMapLocation = (props: IWidgetMapLocation) => {
    const {center, onSetCenterAsMyPosition, onEnableLocation} = props;

    const localPoints = useQuery(PointSchema);
    const realm = useRealm();

    const {t} = useTranslation();

    const [myPosition, setMyPosition] = useState<GeolocationResponse | null>(null);
    const iAmInCenter = useMemo(() => {
        let result = false;

        const myCoords = myPosition?.coords;
        if (myCoords && center) {
            // console.log(
            //     parseFloat(center.lat.toFixed(5)) - parseFloat(myCoords.latitude.toFixed(5)),
            //     parseFloat(center.lng.toFixed(5)) - parseFloat(myCoords.longitude.toFixed(5)),
            // );

            if (
                Math.abs(parseFloat(center.lat.toFixed(5)) - parseFloat(myCoords.latitude.toFixed(5))) <= 0.000005 &&
                Math.abs(parseFloat(center.lng.toFixed(5)) - parseFloat(myCoords.longitude.toFixed(5))) <= 0.000005
            ) {
                result = true;
            }
        }

        return result;
    }, [center, myPosition]);
    // const {onAddListPointToTrack} = useTrack();
    // const dispatch = useAppDispatch();
    // const positionsAll = useAppSelector(positions);

    // const [enabled, requestResolution] = useLocationSettings({
    //     priority: HIGH_ACCURACY, // optional: default BALANCED_POWER_ACCURACY
    //     alwaysShow: true, // optional: default false
    //     needBle: true, // optional: default false
    // });
    const [enabledX, setEnabledX] = useState(false);
    const listener = addListener(({locationEnabled}) => {
        console.log(`Location are ${locationEnabled ? 'enabled' : 'disabled'}`);
        setEnabledX(locationEnabled);

        onEnableLocation && onEnableLocation(locationEnabled);
    });
    useEffect(() => {
        return () => {
            listener.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: 'auto',
        locationProvider: 'auto',
    });

    const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
    // const [positionx, setPositionx] = useState<string | null>(null);

    // useEffect(() => {
    //     realm.write(() => {
    //         realm.create('PointSchema', {
    //             _id: new BSON.ObjectId(),
    //             lat: 53.172802,
    //             lon: 29.181038,
    //             accuracy: 11,
    //             createdAt: new Date().toISOString(),
    //         });
    //     });
    // }, []);

    const onSetMyPosition = (position: GeolocationResponse) => {
        const {latitude, longitude} = position.coords;
        if (latitude && longitude) {
            props.onChangeMyPosition && props.onChangeMyPosition({...position});
            setMyPosition({...position});

            const parseLat = parseFloat(latitude.toFixed(COUNT_FILTER_NUMBER));
            const parseLon = parseFloat(longitude.toFixed(COUNT_FILTER_NUMBER));
            const existAlsoPoints = localPoints.filtered('lat == $0 AND lon == $1', parseLat, parseLon);
            if (existAlsoPoints.length === 0) {
                realm.write(() => {
                    realm.create('PointSchema', {
                        _id: new BSON.ObjectId(),
                        lat: parseLat,
                        lon: parseLon,
                        accuracy: Math.round(position.coords.accuracy),
                        createdAt: new Date().toISOString(),
                        isLocal: true,
                    });
                });
            }
            // console.log('PointSchema: ', JSON.stringify(localPoints));
        }
    };

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                // console.log('getCurrentPosition', position);
                onSetMyPosition(position);
            },
            error => {
                Alert.alert(t('general:alertErrorPermission'), JSON.stringify(error));
                // console.log('GetCurrentPosition Error', JSON.stringify(error))
            },
            {
                // // enableHighAccuracy: false,
                // // // interval: 10,
                // // distanceFilter: 1,
                // // // distanceFilter: 250, // 100 meters
                // // maximumAge: 5000,
                // timeout: 5000,
                // enableHighAccuracy: true,

                enableHighAccuracy: false,
                // interval: 5000,
                distanceFilter: 1,
                // // distanceFilter: 250, // 100 meters
                // maximumAge: 2000, // 1000,
                timeout: 50000,
                useSignificantChanges: true,
            },
        );
    };

    const watchPosition = async () => {
        try {
            checkSettings(config);
            if (!enabledX) {
                await requestResolutionSettings(config);
            }

            // const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            //     title: 'App Location Permission',
            //     message: 'App Location Permission ' + ' are needed to help you',
            //     buttonNeutral: 'Ask Me Later',
            //     buttonNegative: 'Cancel',
            //     buttonPositive: 'OK',
            // });

            const fn = () => {
                console.log('You can use the location');
                const watchID = Geolocation.watchPosition(
                    position => {
                        // console.log('Change position', position);
                        // // setPositionx(JSON.stringify(position));
                        // // const newPos = {
                        // //     position: {lat: position.coords.latitude, lng: position.coords.longitude},
                        // //     accuracy: position,
                        // // };
                        // props.onChangeMyPosition && props.onChangeMyPosition({...position});
                        // setMyPosition({...position});
                        // // console.log('positions=', positionx);
                        // // dispatch(setPositions(position));
                        // // onAddPointToTrack({lat: position.coords.latitude, lon: position.coords.longitude});
                        // // if (positionsAll.length > 10) {
                        // //     onAddListPointToTrack({list: positionsAll});
                        // // }
                        onSetMyPosition(position);
                    },
                    error => {
                        Alert.alert(t('general:alertErrorPermission'), JSON.stringify(error));
                        // console.log('WatchPosition Error', JSON.stringify(error)),
                    },
                    {
                        enableHighAccuracy: false,
                        // interval: 5000,
                        distanceFilter: 1,
                        // // distanceFilter: 250, // 100 meters
                        // maximumAge: 2000, // 1000,
                        timeout: 50000,
                        useSignificantChanges: true,
                    },
                );
                setSubscriptionId(watchID);
            };

            const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            console.log('result', typeof result);
            console.log('ACCESS_FINE_LOCATION: ', result);
            // const result2 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            // console.log('ACCESS_COARSE_LOCATION: ', result2);

            if (result === true) {
                // you code
                console.log('Check permission: ', result);

                getCurrentPosition();
                fn();
            } else if (result === false) {
                const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

                if (status === 'never_ask_again') {
                    // Your code
                } else if (status === 'denied') {
                    watchPosition();
                } else if (status === 'granted') {
                    // Your code
                    getCurrentPosition();
                    fn();
                }
            }

            // // const grantedBackground = await PermissionsAndroid.request(
            // //     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            // //     {
            // //         title: 'App Location Permission',
            // //         message: 'App Location Permission ' + ' are needed to help you',
            // //         buttonNeutral: 'Ask Me Later',
            // //         buttonNegative: 'Cancel',
            // //         buttonPositive: 'OK',
            // //     },
            // // );
            // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //     console.log('You can use the location');
            //     const watchID = Geolocation.watchPosition(
            //         position => {
            //             console.log('Change position', position);
            //             setPositionx(JSON.stringify(position));
            //             console.log('positions=', positionx);
            //             dispatch(setPositions(position));
            //             // onAddPointToTrack({lat: position.coords.latitude, lon: position.coords.longitude});
            //             // if (positionsAll.length > 10) {
            //             //     onAddListPointToTrack({list: positionsAll});
            //             // }
            //         },
            //         error => console.log('WatchPosition Error', JSON.stringify(error)),
            //         {
            //             enableHighAccuracy: false,
            //             // interval: 5000,
            //             // distanceFilter: 10,
            //             // // distanceFilter: 250, // 100 meters
            //             // maximumAge: 2000, // 1000,
            //             timeout: 5000, // 20000,
            //             // useSignificantChanges: true
            //         },
            //     );
            //     setSubscriptionId(watchID);
            // } else {
            //     console.log('Location permission denied');
            // }
        } catch (error) {
            console.log('WatchPosition Error', JSON.stringify(error));
        }
    };

    // const clearWatch = () => {
    //     subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    //     setSubscriptionId(null);
    //     // setPositionx(null);
    // };
    // useEffect(() => {
    //     watchPosition();

    //     return () => {
    //         clearWatch();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // console.log('enabledX=', enabledX, ' myPos=', myPosition, ' subscription=', subscriptionId);

    // const savePositions = () => {
    //     onAddListPointToTrack({list: positionsAll});
    //     // clearPositionsx();
    // };
    // const clearPositionsx = () => {
    //     dispatch(clearPositions());
    // };

    // const getCurrentPosition = async () => {
    //     checkSettings(config);
    //     if (!enabledX) {
    //         await requestResolutionSettings(config);
    //     }

    //     const fn = () => {
    //         Geolocation.getCurrentPosition(
    //             pos => {
    //                 console.log('getCurrentPosition', pos);
    //                 // dispatch(setPositions(pos));
    //                 // setPositionx(JSON.stringify(pos));
    //                 props.onChangeMyPosition &&
    //                     props.onChangeMyPosition({lat: pos.coords.latitude, lng: pos.coords.longitude});
    //             },
    //             error => console.log('GetCurrentPosition Error', JSON.stringify(error)),
    //             {
    //                 // // enableHighAccuracy: false,
    //                 // // // interval: 10,
    //                 // // distanceFilter: 1,
    //                 // // // distanceFilter: 250, // 100 meters
    //                 // // maximumAge: 5000,
    //                 // timeout: 5000,
    //                 // enableHighAccuracy: true,

    //                 enableHighAccuracy: false,
    //                 // interval: 5000,
    //                 distanceFilter: 1,
    //                 // // distanceFilter: 250, // 100 meters
    //                 // maximumAge: 2000, // 1000,
    //                 timeout: 50000,
    //                 useSignificantChanges: true,
    //             },
    //         );
    //     };

    //     const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    //     console.log('result', typeof result);
    //     console.log('result', result);

    //     if (result === true) {
    //         // you code
    //         console.log('Check permission');
    //         fn();
    //     } else if (result === false) {
    //         const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    //         if (status === 'never_ask_again') {
    //             // Your code
    //         } else if (status === 'denied') {
    //             watchPosition();
    //         } else if (status === 'granted') {
    //             // Your code
    //             fn();
    //         }
    //     }
    // };

    // const subscriptionIdRef = useRef(subscriptionId);
    // const enabledRef = useRef(enabled);
    // // useEffect(() => {
    // //     subscriptionIdRef.current = subscriptionId;
    // // }, [subscriptionId]);

    // useEffect(() => {
    //     console.log('Enabled=', enabled);
    // }, [enabled]);
    // useInterval(() => {
    //     checkSettings(config);
    //     console.log('useInterval enabled=', enabledX);
    // }, 5000);

    // function useInterval(callback, delay) {
    //     const savedCallback = useRef();

    //     useEffect(() => {
    //         savedCallback.current = callback;
    //     });

    //     useEffect(() => {
    //         function tick() {
    //             savedCallback.current();
    //         }

    //         let id = setInterval(tick, delay);
    //         return () => clearInterval(id);
    //     }, [delay]);
    // }
    // useEffect(() => {
    //     const timeout = setInterval(() => {
    //         requestResolution();
    //     });

    //     return () => clearInterval(timeout);
    // }, []);

    // useEffect(() => {
    //     if (enabledRef.current) {
    //         if (subscriptionIdRef.current === null) {
    //             watchPosition();
    //         }
    //     } else {
    //         clearWatch();
    //     }
    // }, [subscriptionId, subscriptionIdRef]);

    // useEffect(() => {
    //     console.log('Refresh enabled2', enabled);
    //     requestResolution();

    //     if (enabled) {
    //         watchPosition();
    //     } else {
    //         clearWatch();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [enabled]);

    return (
        <View>
            <UIButton
                type="default"
                // disabled={!!subscriptionId && !myPosition}
                twClass="rounded-full shadow-lg shadow-black border-transparent bg-white dark:bg-s-950"
                onPress={() => {
                    if (!subscriptionId || !enabledX) {
                        watchPosition();
                    } else {
                        onSetCenterAsMyPosition && onSetCenterAsMyPosition();
                    }
                }}>
                <SIcon
                    path={iAmInCenter ? iCenterLocation : iNoCenterLocation}
                    size={32}
                    tw={`${
                        iAmInCenter
                            ? 'text-p-500 dark:text-green-500'
                            : myPosition
                            ? 'text-black dark:text-s-200'
                            : 'text-s-300 dark:text-s-600'
                    }`}
                />
                {!enabledX || subscriptionId === null ? (
                    <View tw="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500" />
                ) : !myPosition ? (
                    <View tw="absolute top-2 right-2">
                        <ActivityIndicator size={10} />
                    </View>
                ) : (
                    <View tw="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500" />
                )}
            </UIButton>

            {/* <TouchableOpacity tw="relative bg-white dark:bg-s-800 p-3 rounded-full shadow-md" onPress={watchPosition}>
                <SIcon
                    path={iCenterLocation}
                    size={32}
                    tw={`${enabledX ? 'text-green-500' : 'text-black dark:text-s-200'}`}
                />
            </TouchableOpacity> */}
            {/* {!enabledX ? (
                <View tw="bg-p-500 dark:bg-s-800 m-4 rounded-lg p-4">
                    <Text tw="text-s-800 dark:text-slate-100 pb-4 text-base">
                        Для лучшей отдачи приложения при поиске объектов на карте, включите GPS
                    </Text>
                    <RButton onPress={requestResolution} text="Включить GPS" />
                </View>
            ) : (
                <View tw="bg-s-100 dark:bg-s-800 m-4 rounded-lg p-4">
                    <Text tw="text-black">{subscriptionId}</Text>
                    <Text tw="text-s-800 dark:text-slate-100 pb-4 text-base">Приложение работает в режиме радара</Text>
                    <Button title="Clear All positions" onPress={clearPositionsx} />
                    <View tw="my-4">
                        {subscriptionId !== null ? (
                            <Button title="Stop Watch" onPress={clearWatch} />
                        ) : (
                            <Button title="Watch Position" onPress={watchPosition} />
                        )}
                    </View>
                    <View tw="my-4">
                        <Button title="Get One Position" onPress={getCurrentPosition} />
                    </View>
                    <View tw="">
                        <Text tw="text-black">{positionx}</Text>
                    </View>
                    <Button title="Save positions" onPress={savePositions} />
                    <Text tw="font-bold text-black">Total: {positionsAll.length} items</Text>
                    {positionsAll.map((x, index) => (
                        <Text key={index} tw="text-black">
                            {index + 1}. {x.coords?.latitude},{x.coords?.longitude} - {x.coords.accuracy}
                        </Text>
                    ))}
                </View>
            )} */}
        </View>
    );
};

export default WidgetMapLocation;
