import {NativeEventEmitter, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import TestModule from '../../../../TestModule';
import UIButton from '~components/ui/UIButton';
import SIcon from '~components/ui/SIcon';
import {iMagnet} from '~utils/icons';
import LPF from 'lpf';

export interface IWidgetMapHeading {
    onSetAngle?: (angle: number) => void;
    onSetEnableMagnet?: (status: boolean) => void;
}

const WidgetMapHeading = (props: IWidgetMapHeading) => {
    const {onSetAngle} = props;
    const [state, setState] = useState({magnetometer: 0});
    const prevAngle = useRef(0);
    const azimutHistory = useRef<number[]>([]);

    useEffect(() => {
        // TestModule.heading();
        TestModule.setUpdateInterval(300);
        TestModule.setUpdateAlpha(1);
        const emitterTestModule = new NativeEventEmitter(TestModule);

        LPF.init([]);
        LPF.smoothing = 0.5;

        emitterTestModule.addListener('data', data => {
            const smoothDegs = data.degs;
            // console.log(data, smoothDegs);
            const azimut: number = LPF.next(smoothDegs[0] || 0);
            const azimutRound = Math.round(azimut);
            // console.log('azimut360', (smoothDegs + 360) % 360);
            const accuracy = data.accuracyAcc || 3;
            // const d = compassHeading({
            //     alpha: data.deg_orient1[0],
            //     beta: data.deg_orient1[1],
            //     gamma: data.deg_orient1[2],
            // });
            // console.log('d=', d);

            //const rotation = (-azimut * 360) / (2 * Math.PI); //toDeg(azimut);
            // if (rotation < 0) {
            //     rotation += 360;
            // }

            // if (azimutHistory.current.length > 5) {
            //     azimutHistory.current.shift();
            // }
            // azimutHistory.current.push(azimut);
            // const allValueAzimut = azimutHistory.current.reduce((ac, el) => ac + el, 0);
            // const azimutRound = Math.round(allValueAzimut / azimutHistory.current.length);

            if (Math.abs(prevAngle.current - azimutRound) > 1) {
                console.log('angle: ', smoothDegs[0], 'LPF: ', azimut, ' azimutRound=', azimutRound);
                //     // console.log(prevAngle.current, Math.round(azimut));
                //     prevAngle.current = azimutRound;
                //     if (onSetAngle) {
                //         onSetAngle(azimutRound);
                //     }
                //     setState({magnetometer: azimutRound});

                prevAngle.current = azimutRound;
                if (onSetAngle) {
                    onSetAngle(azimutRound);
                }
                setState({magnetometer: azimutRound});
            }
        });

        return () => {
            console.log('Blur home page');

            emitterTestModule.removeAllListeners('data');
            TestModule.stopUpdates();
            setEnable(false);
        };
    }, []);

    const ALPHA = 0.15;
    const applyLowPassFilter = (input: number[], output: number[]) => {
        if (output == null) {
            return input;
        }

        for (let i = 0; i < input.length; i++) {
            output[i] = output[i] + ALPHA * (input[i] - output[i]);
        }
        return output;
    };

    // const RAD_PER_DEG = Math.PI / 180;

    // function toRad(deg) {
    //     return deg * RAD_PER_DEG;
    // }

    // function toDeg(rad) {
    //     return rad / RAD_PER_DEG;
    // }

    // function compassHeading([alpha, beta, gamma]) {
    //     if (typeof alpha !== 'number' || typeof beta !== 'number' || typeof gamma !== 'number') {
    //         return;
    //     }

    //     const _x = toRad(beta);
    //     const _y = toRad(gamma);
    //     const _z = toRad(alpha);

    //     const sX = Math.sin(_x);
    //     const sY = Math.sin(_y);
    //     const sZ = Math.sin(_z);

    //     // const cX = Math.cos(_x);
    //     const cY = Math.cos(_y);
    //     const cZ = Math.cos(_z);

    //     const Vx = -cZ * sY - sZ * sX * cY;
    //     const Vy = -sZ * sY + cZ * sX * cY;

    //     // Calculate compass heading
    //     let heading = Math.atan(Vx / Vy);

    //     // Convert from half unit circle to whole unit circle
    //     if (Vy < 0) {
    //         heading += Math.PI;
    //     } else if (Vx < 0) {
    //         heading += 2 * Math.PI;
    //     }

    //     return toDeg(heading);
    // }

    const [enable, setEnable] = useState(false);
    const toogle = () => {
        if (!enable) {
            TestModule.startUpdates();
            setEnable(true);
            props.onSetEnableMagnet && props.onSetEnableMagnet(true);
        } else {
            TestModule.stopUpdates();
            setEnable(false);
            props.onSetEnableMagnet && props.onSetEnableMagnet(false);
        }
    };

    return (
        <View tw="">
            <UIButton
                type="default"
                twClass="rounded-full shadow-lg shadow-black border-transparent bg-white dark:bg-s-950"
                onPress={toogle}>
                <View
                    style={{
                        transform: [{rotate: -state.magnetometer + 'deg'}],
                    }}>
                    <SIcon
                        path={iMagnet}
                        size={32}
                        tw={`${enable ? 'text-p-500 dark:text-green-500' : 'text-black dark:text-s-200'}`}
                    />
                </View>
            </UIButton>
            {/* <UIButton
                text="start"
                type="default"
                onPress={() => {
                    TestModule.startUpdates();
                }}
            />
            <UIButton
                text="stop"
                type="default"
                onPress={() => {
                    TestModule.stopUpdates();
                }}
            />
            <Text tw="text-black">{JSON.stringify(state)}</Text> */}

            {/* <Text tw="text-black">direction: {_direction(_degree(state.magnetometer))}</Text>
            <Text tw="text-black">{_degree(state.magnetometer)}°</Text> */}
            {/* <View tw="relative flex items-center">
                <Image
                    source={require('../../../assets/compass_pointer.png')}
                    style={{
                        height: 26,
                        resizeMode: 'contain',
                    }}
                />
                <Image
                    tw="h-64 w-64"
                    source={require('../../../assets/compass_bg.png')}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        resizeMode: 'contain',
                        transform: [{rotate: -state.magnetometer - 90 + 'deg'}, {scale: 0.5}],
                    }}
                />
            </View> */}
        </View>
    );
};

export default WidgetMapHeading;
