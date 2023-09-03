import {View, Text, PermissionsAndroid, Button} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import LocationEnabler from 'react-native-location-enabler';
import useTrack from '~hooks/useTrack';
import RButton from '~components/r/RButton';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {positions, setPositions} from '~store/appSlice';

const {
    PRIORITIES: {HIGH_ACCURACY},
    useLocationSettings,
    checkSettings,
    addListener,
} = LocationEnabler;

const config = {
    // priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
    alwaysShow: true, // default false
    needBle: true, // default false
};

const WidgetLocation = () => {
    const {onAddListPointToTrack} = useTrack();
    const dispatch = useAppDispatch();
    const positionsAll = useAppSelector(positions);

    const [enabled, requestResolution] = useLocationSettings(config, false /* optional: default undefined */);
    const [enabledX, setEnabledX] = useState(enabled);
    const listener = addListener(({locationEnabled}) => {
        // console.log(`Location are ${locationEnabled ? 'enabled' : 'disabled'}`);
        setEnabledX(locationEnabled);
    });

    Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: 'auto',
        locationProvider: 'auto',
    });

    const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
    const [positionx, setPositionx] = useState<string | null>(null);

    const watchPosition = async () => {
        try {
            // if (!enabled) {
            //     console.log('celarWatch');

            //     clearWatch();
            //     return;
            // }

            console.log('Check permission');

            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'App Location Permission',
                message: 'App Location Permission ' + ' are needed to help you',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });

            // const grantedBackground = await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            //     {
            //         title: 'App Location Permission',
            //         message: 'App Location Permission ' + ' are needed to help you',
            //         buttonNeutral: 'Ask Me Later',
            //         buttonNegative: 'Cancel',
            //         buttonPositive: 'OK',
            //     },
            // );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
                const watchID = Geolocation.watchPosition(
                    position => {
                        console.log('Change position', position.coords.latitude, ',', position.coords.longitude);
                        setPositionx(JSON.stringify(position));
                        console.log('positions=', positionx);
                        dispatch(setPositions(position.coords));
                        // onAddPointToTrack({lat: position.coords.latitude, lon: position.coords.longitude});
                        // if (positionsAll.length > 10) {
                        //     onAddListPointToTrack({list: positionsAll});
                        // }
                    },
                    error => console.log('WatchPosition Error', JSON.stringify(error)),
                    {
                        enableHighAccuracy: true,
                        interval: 10,
                        distanceFilter: 1,
                        // distanceFilter: 250, // 100 meters
                        // maximumAge: 20000,
                        // timeout: 120000,
                        // useSignificantChanges: true
                    },
                );
                setSubscriptionId(watchID);
            } else {
                console.log('Location permission denied');
            }
        } catch (error) {
            console.log('WatchPosition Error', JSON.stringify(error));
        }
    };

    const clearWatch = () => {
        subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
        setSubscriptionId(null);
        setPositionx(null);
    };

    // useEffect(() => {
    //     return () => {
    //         clearWatch();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // useEffect(() => {
    //     return () => {
    //         listener.remove();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            pos => {
                console.log('getCurrentPosition', pos);
                setPositionx(JSON.stringify(pos));
            },
            error => console.log('GetCurrentPosition Error', JSON.stringify(error)),
            {
                enableHighAccuracy: false,
                interval: 10,
                distanceFilter: 1,
                // distanceFilter: 250, // 100 meters
                maximumAge: 20000,
                timeout: 120000,
            },
        );
    };

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

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        });

        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }, [delay]);
    }
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
            {!enabledX ? (
                <View tw="bg-s-100 dark:bg-s-800 m-4 rounded-lg p-4">
                    <Text tw="text-s-800 dark:text-slate-100 pb-4 text-base">
                        Для лучшей отдачи приложения при поиске объектов на карте, включите GPS
                    </Text>
                    <RButton onPress={requestResolution} label="Включить GPS" />
                </View>
            ) : (
                <View tw="bg-s-100 dark:bg-s-800 m-4 rounded-lg p-4">
                    <Text>{subscriptionId}</Text>
                    <Text tw="text-s-800 dark:text-slate-100 pb-4 text-base">Приложение работает в режиме радара</Text>
                    {subscriptionId !== null ? (
                        <Button title="Clear Watch" onPress={clearWatch} />
                    ) : (
                        <Button title="Watch Position" onPress={watchPosition} />
                    )}
                    {positionsAll.map((x, index) => (
                        <Text key={index}>
                            {x.latitude},{x.longitude}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

export default WidgetLocation;
