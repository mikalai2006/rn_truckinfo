import {View, Dimensions, StyleSheet, Text} from 'react-native';
import React, {useCallback, useEffect, useImperativeHandle} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {useColorScheme} from 'nativewind';
import {snapPoint} from '~utils/redash';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT;
let snapPointsY = [0, -300, MAX_TRANSLATE_Y];

type BottomSheetProps = {
    children?: React.ReactNode;
    topheader?: React.ReactNode | null;
    onClose?: () => void;
    snapPoints: number[];
};
export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
    getActiveIndex: () => number;
};

const SBottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
    ({snapPoints, children, topheader, onClose}, ref) => {
        const colorSheme = useColorScheme();
        const translateY = useSharedValue(35);
        const active = useSharedValue(false);
        const activeIndex = useSharedValue(0);

        // const onCloseCallback = useCallback(() => {
        //     'worklet';
        //     onClose && onClose();
        // }, []);

        useEffect(() => {
            if (snapPoints && snapPoints.length > 0) {
                snapPointsY = snapPoints;
                snapPointsY.push(MAX_TRANSLATE_Y);
            }
        }, []);

        const scrollTo = useCallback((destination: number) => {
            'worklet';

            active.value = destination !== 0;
            // console.log('destination: ', destination);

            translateY.value = withSpring(destination, {damping: 50});

            if (destination === 0 && onClose) {
                onClose && runOnJS(onClose)();
            }
        }, []);

        const isActive = useCallback(() => {
            return active.value;
        }, []);

        const getActiveIndex = useCallback(() => {
            return activeIndex.value;
        }, []);

        useImperativeHandle(ref, () => ({scrollTo, isActive, getActiveIndex}), [scrollTo, isActive, getActiveIndex]);

        const ctx = useSharedValue({y: 0});
        const gesture = Gesture.Pan()
            .onStart(() => {
                ctx.value = {y: translateY.value};
            })
            .onUpdate(event => {
                // console.log(event.translationY);

                translateY.value = event.translationY + ctx.value.y;
                translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
            })
            .onEnd(({translationY, translationX, velocityX, velocityY}) => {
                const snapPointY = snapPoint(translateY.value, velocityY, snapPointsY);
                activeIndex.value = snapPointsY.findIndex(x => x === snapPointY);
                // console.log('; snapPointY=', snapPointY, activeIndex.value);
                // if (translateY.value > -SCREEN_HEIGHT / 3) {
                //     scrollTo(0);
                // } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
                //     scrollTo(MAX_TRANSLATE_Y);
                // }
                scrollTo(snapPointY);
            });

        const rBottomSheetStyle = useAnimatedStyle(() => {
            const borderRadius = interpolate(
                translateY.value,
                [MAX_TRANSLATE_Y + 100, MAX_TRANSLATE_Y],
                [15, 0],
                Extrapolate.CLAMP,
            );
            return {
                transform: [{translateY: translateY.value + (translateY.value >= 0 ? 35 : 0)}],
                borderRadius,
            };
        });

        const rTopHeader = useAnimatedStyle(() => {
            const height = interpolate(
                translateY.value,
                [0, 300, MAX_TRANSLATE_Y / 2, MAX_TRANSLATE_Y - 35],
                [0, 150, 170, 200],
                Extrapolate.CLAMP,
            );
            return {
                height,
            };
        });

        const rTopMargin = useAnimatedStyle(() => {
            const marginTop = interpolate(
                translateY.value,
                [0, MAX_TRANSLATE_Y / 2, MAX_TRANSLATE_Y - 35],
                [-100, -60, 6],
                Extrapolate.CLAMP,
            );
            return {
                marginTop,
            };
        });
        const rTouchElement = useAnimatedStyle(() => {
            const top = interpolate(
                translateY.value,
                [0, MAX_TRANSLATE_Y + 100, MAX_TRANSLATE_Y - 35],
                [0, 10, 30],
                Extrapolate.CLAMP,
            );
            return {
                top,
            };
        });

        const rBackdropStyle = useAnimatedStyle(() => {
            return {
                opacity: withTiming(active.value ? 1 : 0),
            };
        }, []);

        const rBackdropProps = useAnimatedProps(() => {
            return {
                pointerEvents: active.value ? 'auto' : 'none',
            };
        }, []);

        return (
            <>
                <Animated.View
                    animatedProps={rBackdropProps}
                    onTouchStart={() => {
                        scrollTo(0);
                    }}
                    style={[
                        {
                            ...StyleSheet.absoluteFillObject,
                            // backgroundColor: colorSheme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,.8)',
                        },
                        rBackdropStyle,
                    ]}
                    tw="bg-black/20 dark:bg-black/40"
                />
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        tw="absolute top-0 bg-white dark:bg-s-800 w-full h-screen overflow-hidden"
                        style={[styles.widgetBottomSheetContainer, rBottomSheetStyle]}>
                        <View style={{flex: 1}} tw="relative">
                            <Animated.View tw="absolute left-0 right-0 z-10 w-full" style={[rTouchElement]}>
                                <View tw="w-16 h-1.5 bg-black/20 dark:bg-white/20 rounded-md my-2 mx-auto" />
                            </Animated.View>
                            {topheader && (
                                <Animated.View tw="bg-s-200 dark:bg-s-700" style={[rTopHeader]}>
                                    {topheader}
                                </Animated.View>
                            )}
                            <Animated.View
                                tw="flex-1 mx-2 bg-white dark:bg-s-800 rounded-xl"
                                style={[topheader ? rTopMargin : {}]}>
                                {children}
                            </Animated.View>
                        </View>
                    </Animated.View>
                </GestureDetector>
            </>
        );
    },
);

const styles = StyleSheet.create({
    widgetBottomSheetContainer: {
        height: SCREEN_HEIGHT + 35,
        top: SCREEN_HEIGHT,
        borderRadius: 15,
    },
    line: {},
});

export default SBottomSheet;
