import React from 'react';
import {Svg, Path} from 'react-native-svg';

export interface SIconProps {
    path: string | undefined;
    size: number;
    tw?: string;
    style?: any;
}

const SIcon = (props: SIconProps) => {
    const {size, path} = props;
    return (
        <Svg height={size} width={size} viewBox="0 0 16 16" {...props} tw="fill-current" fill="currentColor">
            {path ? <Path d={path} /> : ''}
        </Svg>
    );
};

export default SIcon;
