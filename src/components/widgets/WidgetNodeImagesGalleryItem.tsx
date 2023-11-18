import React from 'react';
import {Text, ImageBackground, View, useWindowDimensions} from 'react-native';
import RImage from '~components/r/RImage';

import {IImage} from '~store/appSlice';

export interface IWidgetNodeImagesGalleryItemProps {
    image: IImage;
}
export default function WidgetNodeImagesGalleryItem(props: IWidgetNodeImagesGalleryItemProps) {
    const {width} = useWindowDimensions();
    const {image} = props;
    const source = {
        uri: `http://localhost:3000/images/${image.userId}/${image.service}/${image.serviceId}/1024-${image.path}${image.ext}`,
    };

    return (
        <View tw="items-stretch justify-center" style={[{width}]}>
            {image && (
                <ImageBackground source={source} tw="flex-1">
                    {/* <RImage classString="absolute h-full w-full" image={props.image} /> */}
                    {/* <View tw="absolute bottom-0 justify-center items-stretch py-6 px-4">
                        <Text tw="text-center text-4xl text-s-800 dark:text-s-100">{image.createdAt.toString()}</Text>
                    </View> */}
                </ImageBackground>
            )}
        </View>
    );
}
