import {Animated, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';

interface SkeletonProps {
    width?: string | number | null | undefined;
    classString?: string;
    text?: string;
    textClassString?: string;
}

export const SSkeleton: React.FC<SkeletonProps> = ({width, classString, text, textClassString}) => {
    const opacity = useRef(new Animated.Value(0.3));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 500,
                }),
                Animated.timing(opacity.current, {
                    toValue: 0.3,
                    useNativeDriver: true,
                    duration: 800,
                }),
            ]),
        ).start();
    }, [opacity]);

    const styleTw = `flex items-center justify-center bg-s-200 dark:bg-s-800 rounded-lg ${classString}`;
    const styleText = `text-s-400 dark:text-s-500 ${textClassString}`;

    return (
        <Animated.View style={{opacity: opacity.current, width}} tw={styleTw}>
            {text && <Text tw={styleText}>{text} ...</Text>}
        </Animated.View>
    );
};
