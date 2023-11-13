import {Image, Text, View} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {activeNode} from '~store/appSlice';

import {ScrollView} from 'react-native-gesture-handler';
import RImage from '~components/r/RImage';

const WidgetNodeImagesLine = () => {
    const activeMarkerData = useAppSelector(activeNode);

    return (
        <View tw="px-4 ">
            <Text tw="text-xl pb-2">Amenity</Text>
            <ScrollView horizontal tw="flex flex-row flex-nowrap gap-1">
                {activeMarkerData?.tagsData.map((el, i) => (
                    <View key={i.toString()} tw="bg-s-600/10 rounded-lg flex flex-col items-center">
                        <Image
                            tw="h-24 w-24"
                            source={{
                                uri: 'https://lh5.googleusercontent.com/p/AF1QipPZbOotfRrGSsq8ADDgOyM9im5ZM3gbf5S6Qcj4=w408-h544-k-no',
                            }}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default WidgetNodeImagesLine;
