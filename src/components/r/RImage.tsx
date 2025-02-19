import {Image} from 'react-native';
import React from 'react';
import {hostSERVER} from '~utils/global';

export interface IImageProps {
    image?: any;
    uri?: string;
    tw?: string;
    style?: any;
    classString?: string;
}

const placeholder = require('../../assets/placeholder.png');

const RImage = (props: IImageProps) => {
    const {image, uri} = props;
    // const source = useMemo(() => {
    //     return {
    //         uri: image
    //             ? `http://localhost:8000/images/${image.userId}/${image.service}/${image.serviceId}/${image.path}${image.ext}`
    //             : props.uri,
    //     };
    // }, []);

    return (
        <Image
            tw={props?.classString ? props.classString : 'h-24 w-24 rounded-full'}
            source={
                image || uri
                    ? {
                          uri: image
                              ? `${hostSERVER}/images/${image.userId}/${image.service}/${image.serviceId}/${image.path}${image.ext}`
                              : props.uri,
                      }
                    : placeholder
            }
            style={props?.style}
        />
    );
};

export default RImage;

// {
//     // uri: `http://localhost:8000/images/${image.userId}/${image.service}/${image.serviceId}/320-${image.path}${image.ext}`,
//     uri: image
//         ? `http://localhost:3000/images/${image.userId}/${image.service}/${image.serviceId}/${image.path}${image.ext}`
//         : props.uri,
//     //'https://lh5.googleusercontent.com/p/AF1QipNT1OecPHR30Vqqjo9_gB7zJc2AQkFAcfGRHOPP=w408-h306-k-no',
// }
