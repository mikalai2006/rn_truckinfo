import React from 'react';
import {View, useWindowDimensions} from 'react-native';
import RImage from '~components/r/RImage';

import {IImage} from '~store/appSlice';
// import {hostSERVER} from '~utils/global';

export interface IWidgetNodeImagesGalleryItemProps {
    image: IImage;
}
export default function WidgetNodeImagesGalleryItem(props: IWidgetNodeImagesGalleryItemProps) {
    const {width} = useWindowDimensions();
    const {image} = props;

    // const source = {
    //     uri: `${hostSERVER}/images/${image.userId}/${image.service}/${image.serviceId}/${image.path}${image.ext}`,
    // };

    return (
        <View tw="items-stretch justify-center" style={[{width}]}>
            {image && (
                // <ImageBackground source={source} tw="flex-1">
                // </ImageBackground>
                <RImage
                    classString="w-full aspect-video"
                    uri={
                        image.createdAt ? '' : image.images[0].uri
                        // 'https://lh5.googleusercontent.com/p/AF1QipO8MMrx4AwWQxTgESA_-vCaKbovWqUcofLPn1eG=w408-h306-k-no'
                    }
                    image={image.createdAt ? image : null}
                />
            )}
        </View>
    );
}
