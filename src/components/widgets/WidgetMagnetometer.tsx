import {Image, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {SensorTypes, magnetometer, setUpdateIntervalForType} from 'react-native-sensors';

export interface IWidgetMagnetometer {
    onSetAngle: (angle: number) => void;
}

const WidgetMagnetometer = (props: IWidgetMagnetometer) => {
    const {onSetAngle} = props;
    const sensorSubscriptionRef = useRef(null);
    const [state, setState] = useState({magnetometer: 0});
    // useEffect(() => {
    //     setUpdateIntervalForType(SensorTypes.gyroscope, 300);
    //     sensorSubscriptionRef.current = gyroscope.subscribe(({x, y, z}) => {
    //         // console.log('Gyroscope:', x, y, z);
    //         onSetGyroscope && onSetGyroscope({x, y, z});
    //     });

    //     return () => {
    //         sensorSubscriptionRef.current.unsubscribe();
    //         sensorSubscriptionRef.current = null;
    //     };
    // }, []);
    // React.useEffect(() => {
    //     const degree_update_rate = 3;

    //     CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
    //         console.log('CompassHeading: ', heading, accuracy);
    //         onSetAngle && onSetAngle(heading);
    //     });

    //     return () => {
    //         CompassHeading.stop();
    //     };
    // }, []);

    useEffect(() => {
        setUpdateIntervalForType(SensorTypes.magnetometer, 16);
        sensorSubscriptionRef.current = magnetometer.subscribe(data => {
            // console.log('Gyroscope:', x, y, z);
            // getCompass(data);
            // console.log('angle=', compassHeading(data));
            const angle = _angle(data);
            setState({magnetometer: angle});
            onSetAngle && onSetAngle(_degree(angle));
        });

        return () => {
            sensorSubscriptionRef.current.unsubscribe();
            sensorSubscriptionRef.current = null;
        };
    }, []);

    const _angle = magnetometer => {
        let angle = 0;
        if (magnetometer) {
            let {x, y} = magnetometer;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }
        return Math.round(angle);
    };

    const _direction = degree => {
        if (degree >= 22.5 && degree < 67.5) {
            return 'NE';
        } else if (degree >= 67.5 && degree < 112.5) {
            return 'E';
        } else if (degree >= 112.5 && degree < 157.5) {
            return 'SE';
        } else if (degree >= 157.5 && degree < 202.5) {
            return 'S';
        } else if (degree >= 202.5 && degree < 247.5) {
            return 'SW';
        } else if (degree >= 247.5 && degree < 292.5) {
            return 'W';
        } else if (degree >= 292.5 && degree < 337.5) {
            return 'NW';
        } else {
            return 'N';
        }
    };

    // Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
    const _degree = magnetometer => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    return (
        <View tw="bg-black absolute top-24 left-0 right-0 h-32 z-[99999]">
            <Text tw="text-black">direction: {_direction(_degree(state.magnetometer))}</Text>
            <Text tw="text-black">{_degree(state.magnetometer)}°</Text>
            <View tw="relative flex items-center">
                <Image
                    source={require('../../assets/compass_pointer.png')}
                    style={{
                        height: 26,
                        resizeMode: 'contain',
                    }}
                />
                <Image
                    tw="h-64 w-64"
                    source={require('../../assets/compass_bg.png')}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        resizeMode: 'contain',
                        transform: [{rotate: 360 - state.magnetometer + 'deg'}],
                    }}
                />
            </View>
        </View>
    );
};

export default WidgetMagnetometer;
