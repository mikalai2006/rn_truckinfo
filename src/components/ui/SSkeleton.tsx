import {Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';

interface SkeletonProps {
    width?: string | number | null | undefined;
    classString: string;
}

export const SSkeleton: React.FC<SkeletonProps> = ({width, classString}) => {
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

    const styleTw = `bg-s-300 dark:bg-s-700 rounded-lg ${classString}`;

    return <Animated.View style={{opacity: opacity.current, width}} tw={styleTw} />;
};
