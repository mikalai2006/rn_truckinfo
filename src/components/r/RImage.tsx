import {Image} from 'react-native';
import React from 'react';

const RImage = props => {
    const {image} = props;
    return (
        <Image
            tw={`h-24 w-24 rounded-full ${props.tw}`}
            source={{
                uri: `http://localhost:8000/images/${image.userId}/${image.service}/${image.serviceId}/320-${image.path}${image.ext}`,
            }}
        />
    );
};

export default RImage;
