import {Image} from 'react-native';
import React from 'react';

export interface IImageProps {
    image?: any;
    uri?: string;
    tw?: string;
    classString?: string;
}

const RImage = (props: IImageProps) => {
    const {image} = props;
    return (
        <Image
            tw={props?.classString ? props.classString : 'h-24 w-24 rounded-full'}
            source={{
                // uri: `http://localhost:8000/images/${image.userId}/${image.service}/${image.serviceId}/320-${image.path}${image.ext}`,
                uri: image
                    ? `http://localhost:3000/images/${image.userId}/${image.service}/${image.serviceId}/320-${image.path}${image.ext}`
                    : props.uri,
                //'https://lh5.googleusercontent.com/p/AF1QipNT1OecPHR30Vqqjo9_gB7zJc2AQkFAcfGRHOPP=w408-h306-k-no',
            }}
        />
    );
};

export default RImage;
