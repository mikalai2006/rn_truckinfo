import React, {useRef, useEffect} from 'react';
import {styled, useColorScheme} from 'nativewind';
import {View, Animated, TouchableOpacity} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import colors from '../utils/colors';
import SIcon from './ui/SIcon';
import {iChevronLeft} from '~utils/icons';
const StyledWrapper = styled(View);

export default function OnboardingNextButton({percentage, scrollTo}) {
    const {colorScheme} = useColorScheme();

    const size = 100;
    const strokeWidth = 4;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animation = toValue => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener(
            value => {
                const strokeDashoffset = circumference - (circumference * value.value) / 100;

                if (progressRef?.current) {
                    progressRef.current.setNativeProps({
                        strokeDashoffset,
                    });
                }
            },
            [percentage],
        );

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, []);

    return (
        <StyledWrapper tw="flex items-center justify-center">
            <Svg width={size} height={size} fill="transparent">
                <G rotation={-90} origin={center}>
                    <Circle
                        stroke={colorScheme === 'dark' ? colors.s[800] : colors.s[200]}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        ref={progressRef}
                        stroke={colors.p[500]}
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                    />
                </G>
            </Svg>
            <TouchableOpacity activeOpacity={0.6} tw="absolute p-4 bg-p-500 rounded-full" onPress={scrollTo}>
                <SIcon path={iChevronLeft} size={32} />
            </TouchableOpacity>
        </StyledWrapper>
    );
}
