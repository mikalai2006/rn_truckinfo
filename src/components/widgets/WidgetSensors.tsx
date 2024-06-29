import {Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {SensorData, SensorTypes, gyroscope, magnetometer, setUpdateIntervalForType} from 'react-native-sensors';
import {useDeviceOrientation} from '@react-native-community/hooks';
import {compassHeading} from '~utils/utils';

export interface IWidgetSensors {
    onSetAngle: (angle: number) => void;
}

const WidgetSensors = (props: IWidgetSensors) => {
    const {onSetAngle} = props;
    const sensorSubscriptionRef = useRef(null);

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
        sensorSubscriptionRef.current = magnetometer.subscribe(data => {
            // console.log('Gyroscope:', x, y, z);
            // getCompass(data);
            console.log('angle=', compassHeading(data));
            onSetAngle && onSetAngle(compassHeading(data));
        });

        return () => {
            sensorSubscriptionRef.current.unsubscribe();
            sensorSubscriptionRef.current = null;
        };
    }, []);

    const angle = (magnetometerData: SensorData) => {
        let _angle = 0;
        if (magnetometerData) {
            const {x, y, z} = magnetometerData;

            if (Math.atan2(y, x) >= 0) {
                _angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                _angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }

        return Math.round(_angle);
    };

    const getCompass = (data: SensorData) => {
        const _angle = (magnetometerData: SensorData) => {
            let angle = 0;
            if (magnetometerData) {
                const {x, y, z} = magnetometerData;

                if (Math.atan2(y, x) >= 0) {
                    angle = Math.atan2(y, x) * (180 / Math.PI);
                } else {
                    angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
                }
            }

            return Math.round(angle);
        };

        const _direction = (degree: number) => {
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
        const _degree = (magnetometer: SensorData) => {
            return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
        };

        return {
            angle: _angle(data),
            direction: _direction(data),
            degree: _degree(data),
        };
    };

    const orientation = useDeviceOrientation();

    return (
        <View>
            <Text>'orientation is:', {orientation}</Text>
        </View>
    );
};

export default WidgetSensors;
