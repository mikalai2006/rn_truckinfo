import {View, Text} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {feature} from '~store/appSlice';

const PointScreen = () => {
    const featureData = useAppSelector(feature);
    return (
        <View>
            <Text>{JSON.stringify(featureData)}</Text>
        </View>
    );
};

export default PointScreen;
