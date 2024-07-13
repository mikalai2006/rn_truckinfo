import {NativeEventEmitter, NativeModules, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Orientation, {OrientationType} from 'react-native-orientation-locker';

// import TestModule from '../../../../TestModule';
const {TestModule} = NativeModules;
const emitterTestModule = new NativeEventEmitter(TestModule);

import UIButton from '~components/ui/UIButton';
import SIcon from '~components/ui/SIcon';
import {iMagnet} from '~utils/icons';
// import LPF from 'lpf';

export interface IWidgetMapHeading {
    onSetAngle: (angle: number) => void;
    onSetEnable: (status: boolean) => void;
    enable: boolean;
    angle: number;
}

const WidgetMapHeading = (props: IWidgetMapHeading) => {
    const {onSetAngle, onSetEnable, enable, angle} = props;
    const prevAngle = useRef(0);
    // const historyAngles = useRef<number[]>([]);
    // console.log('Render WidgetMapHeading: ', state, prevAngle.current);

    // const azimutHistory = useRef<number[]>([]);
    // const [orientation, setOrientation] = useState('LANDSCAPE');
    // const onGetDeviceOrientation = deviceOrientation => {
    //     console.log('Current Device Orientation: ', deviceOrientation);
    //     setOrientation(deviceOrientation);
    // };
    // useEffect(() => {
    //     Orientation.addOrientationListener(onGetDeviceOrientation);

    //     return () => {
    //         Orientation.removeOrientationListener(onGetDeviceOrientation);
    //     };
    // }, []);

    // const determineAndSetOrientation = () => {
    //     let width = Dimensions.get('window').width;
    //     let height = Dimensions.get('window').height;

    //     if (width < height) {
    //         setOrientation('PORTRAIT');
    //     } else {
    //         setOrientation('LANDSCAPE');
    //     }
    // };

    // useEffect(() => {
    //     determineAndSetOrientation();
    //     const subscription = Dimensions.addEventListener('change', determineAndSetOrientation);

    //     return () => {
    //         subscription?.remove();
    //     };
    // }, []);

    // const debounceSetAngle = useCallback(azimut => {
    //     // debounce(angle => {
    //     onSetAngle && onSetAngle(azimut);
    //     console.log('debounceSetAngle: ', azimut);
    //     // }, 300),
    // }, []);

    // // const azimutHistory = useRef<number[]>([]);
    // const onHandleAzimut = data => {
    //     const _data = {...data};
    //     const fixAngle = +_data.angle.toFixed(1);
    //     if (Math.abs(prevAngle.current - fixAngle) > 1) {
    //         prevAngle.current = fixAngle;
    //         Orientation.getDeviceOrientation(deviceOrientation => {
    //             let diffAngle = 0;
    //             switch (deviceOrientation) {
    //                 case OrientationType['LANDSCAPE-RIGHT']:
    //                     diffAngle = -90;
    //                     break;
    //                 case OrientationType['PORTRAIT-UPSIDEDOWN']:
    //                     diffAngle = -180;
    //                     break;
    //                 case OrientationType['LANDSCAPE-LEFT']:
    //                     diffAngle = 90;
    //                     break;

    //                 case OrientationType.UNKNOWN:
    //                     diffAngle = -90;
    //                     break;
    //                 default:
    //                     break;
    //             }

    //             // setState({magnetometer: fixAngle + diffAngle});
    //             // if (onSetAngle) {
    //             //     onSetAngle(fixAngle + diffAngle);
    //             // }

    //             // console.log(fixAngle + diffAngle);
    //             // setState({magnetometer: fixAngle + diffAngle});
    //             debounceSetAngle && debounceSetAngle(fixAngle + diffAngle);
    //         });
    //     }
    //     // const azimut = data.angle || 0;
    //     // const azimutRound = Math.round(azimut);
    //     // if (Math.abs(prevAngle.current - azimutRound) > 2) {
    //     //     prevAngle.current = azimutRound;
    //     //     Orientation.getDeviceOrientation(deviceOrientation => {
    //     //         let diffAngle = 0;
    //     //         switch (deviceOrientation) {
    //     //             case OrientationType['LANDSCAPE-RIGHT']:
    //     //                 diffAngle = -90;
    //     //                 break;
    //     //             case OrientationType['PORTRAIT-UPSIDEDOWN']:
    //     //                 diffAngle = -180;
    //     //                 break;
    //     //             case OrientationType['LANDSCAPE-LEFT']:
    //     //                 diffAngle = 90;
    //     //                 break;

    //     //             case OrientationType.UNKNOWN:
    //     //                 diffAngle = -90;
    //     //                 break;
    //     //             default:
    //     //                 break;
    //     //         }

    //     //         setState({magnetometer: azimut + diffAngle});
    //     //         if (onSetAngle) {
    //     //             azimutHistory.current.length > 2 && azimutHistory.current.shift();
    //     //             azimutHistory.current.push(azimutRound);
    //     //             const middleValue = Math.round(
    //     //                 azimutHistory.current.reduce((ac, el) => ac + el, 0) / azimutHistory.current.length,
    //     //             );
    //     //             // if (Math.abs(middleValue - azimutRound) > 1) {
    //     //             onSetAngle(azimutRound + diffAngle);
    //     //             // }
    //     //             console.log(
    //     //                 'orientation =',
    //     //                 azimutRound,
    //     //                 azimutHistory.current,
    //     //                 middleValue,
    //     //                 Math.abs(middleValue - azimutRound),
    //     //             );
    //     //         }
    //     //     });
    //     // }
    // };

    useEffect(() => {
        // console.log('WidgetMapHeading Render');
        // // // TestModule.heading();
        // // TestModule.setUpdateInterval(300);
        // // TestModule.setUpdateAlpha(0.0);
        // if (enable) {
        //     TestModule.startAzimut();
        //     setEnable(true);
        //     props.onSetEnableMagnet && props.onSetEnableMagnet(true);
        // }

        // LPF.init([]);
        // LPF.smoothing = 0.8;
        const emitterTestModuleListener = emitterTestModule.addListener('azimut_data', function (data) {
            const _data = {...data};
            const fixAngle = +_data.angle.toFixed(1);
            const diff = Math.abs(prevAngle.current - fixAngle);
            // console.log('prevAngle.current=', prevAngle.current, ' fixAngle=', fixAngle);
            if (diff > 1) {
                //  && !historyAngles.current.includes(Math.round(fixAngle))
                prevAngle.current = fixAngle;
                Orientation.getDeviceOrientation(deviceOrientation => {
                    let diffAngle = 0;
                    switch (deviceOrientation) {
                        case OrientationType['LANDSCAPE-RIGHT']:
                            diffAngle = -90;
                            break;
                        case OrientationType['PORTRAIT-UPSIDEDOWN']:
                            diffAngle = -180;
                            break;
                        case OrientationType['LANDSCAPE-LEFT']:
                            diffAngle = 90;
                            break;

                        case OrientationType.UNKNOWN:
                            diffAngle = -90;
                            break;
                        default:
                            break;
                    }

                    // setState({magnetometer: fixAngle + diffAngle});
                    // if (onSetAngle) {
                    //     onSetAngle(fixAngle + diffAngle);
                    // }

                    const azimut = fixAngle + diffAngle;
                    // setState({magnetometer: fixAngle + diffAngle});
                    // historyAngles.current.length > 10 && historyAngles.current.shift();
                    // historyAngles.current.push(Math.round(fixAngle));

                    // console.log('azimut=', azimut);
                    onSetAngle && onSetAngle(azimut);
                });
                // const azimut = fixAngle;
                // // setState({magnetometer: fixAngle + diffAngle});
                // // historyAngles.current.length > 10 && historyAngles.current.shift();
                // // historyAngles.current.push(Math.round(fixAngle));

                // console.log('azimut=', azimut);
                // onSetAngle && onSetAngle(azimut);
            }
        });

        // emitterTestModule.addListener('data', data => {
        //     const smoothDegs = data.degs;
        //     const smoothRads = data.rads;
        //     // console.log(data, smoothDegs);
        //     const azimut: number = LPF.next(smoothDegs[0] || 0);
        //     const azimutRound = Math.round(azimut);
        //     // console.log('azimut360', (smoothDegs + 360) % 360);
        //     const accuracy = data.accuracyAcc || 3;

        //     // //ramp-speed - play with this value until satisfied
        //     // const kFilteringFactor = 0.5;

        //     // //last result storage - keep definition outside of this function, eg. in wrapping object
        //     // const accel = [0, 0, 0];

        //     // //acceleration.x,.y,.z is the input from the sensor

        //     // //result.x,.y,.z is the filtered result

        //     // //high-pass filter to eliminate gravity
        //     // const [x, y, z] = smoothDegs;
        //     // accel[0] = x * kFilteringFactor + accel[0] * (1.0 - kFilteringFactor);
        //     // accel[1] = y * kFilteringFactor + accel[1] * (1.0 - kFilteringFactor);
        //     // accel[2] = z * kFilteringFactor + accel[2] * (1.0 - kFilteringFactor);
        //     // const result = {
        //     //     x: Math.round(x - accel[0]),
        //     //     y: y - accel[1],
        //     //     z: z - accel[2],
        //     // };
        //     // console.log(azimutRound, azimut, Math.round(smoothDegs[0]), result.x, smoothRads[0].toFixed(2));

        //     // const d = compassHeading({
        //     //     alpha: data.deg_orient1[0],
        //     //     beta: data.deg_orient1[1],
        //     //     gamma: data.deg_orient1[2],
        //     // });
        //     // console.log('d=', d);

        //     //const rotation = (-azimut * 360) / (2 * Math.PI); //toDeg(azimut);
        //     // if (rotation < 0) {
        //     //     rotation += 360;
        //     // }

        //     // if (azimutHistory.current.length > 5) {
        //     //     azimutHistory.current.shift();
        //     // }
        //     // azimutHistory.current.push(azimut);
        //     // const allValueAzimut = azimutHistory.current.reduce((ac, el) => ac + el, 0);
        //     // const azimutRound = Math.round(allValueAzimut / azimutHistory.current.length);

        //     if (Math.abs(prevAngle.current - azimutRound) > accuracy) {
        //         // console.log('angle: ', smoothDegs[0], 'LPF: ', azimut, ' azimutRound=', azimutRound);
        //         //     // console.log(prevAngle.current, Math.round(azimut));
        //         //     prevAngle.current = azimutRound;
        //         //     if (onSetAngle) {
        //         //         onSetAngle(azimutRound);
        //         //     }
        //         //     setState({magnetometer: azimutRound});

        //         prevAngle.current = azimutRound;
        //         if (onSetAngle) {
        //             onSetAngle(azimutRound);
        //         }
        //         setState({magnetometer: azimutRound});
        //     }
        // });
        // let anglex = 0;
        // setInterval(() => {
        //     anglex = anglex + 5;
        //     onSetAngle && onSetAngle(anglex);
        // }, 1000);
        return () => {
            console.log('emitterTestModule remove');
            // emitterTestModule.removeAllListeners('data');
            // TestModule.stopUpdates();
            // emitterTestModule.removeAllListeners('azimut');
            emitterTestModuleListener.remove();
            TestModule.stopAzimut();
            onSetEnable && onSetEnable(false);
        };
    }, []);

    // const [enable, setEnable] = useState(false);
    const toogle = () => {
        if (!enable) {
            // TestModule.startUpdates();
            TestModule.startAzimut();
            onSetEnable && onSetEnable(true);
        } else {
            // TestModule.stopUpdates();
            TestModule.stopAzimut();
            onSetEnable && onSetEnable(false);
        }
    };

    return (
        <View tw="">
            <UIButton
                type="default"
                twClass="rounded-full shadow-lg shadow-black border-transparent bg-white dark:bg-s-950"
                onPress={toogle}>
                <View
                    tw="transform-gpu"
                    style={{
                        transform: [{rotate: -angle + 'deg'}],
                    }}>
                    <SIcon
                        path={iMagnet}
                        size={32}
                        tw={`${enable ? 'text-p-500 dark:text-green-500' : 'text-black dark:text-s-200'}`}
                    />
                </View>
            </UIButton>
        </View>
    );
};

export default WidgetMapHeading;
