import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import SIcon from '~components/ui/SIcon';
import {iChat, iHandThumbsDown, iHandThumbsUp, iCamera} from '~utils/icons';
import RButton from '~components/r/RButton';
import {useNavigation} from '@react-navigation/native';

const WidgetNodeButtons = () => {
    const navigation = useNavigation();

    const onPressAddReview = () => {
        // navigation.navigate('CameraScreen');
        navigation.navigate('CameraScreen');
        // const pushAction = StackActions.push('CameraScreen');
        // // console.log(navigation.getParent()?.getId());
        // console.log(navigation.getParent()?.getState());

        // navigation.getParent()?.dispatch(pushAction);
    };

    const onPressMore = () => {
        navigation.navigate('PointStack');
    };

    return (
        <View tw="p-2 flex flex-row justify-center gap-x-2">
            <View>
                <RButton onPress={onPressMore}>
                    <View tw="flex flex-row gap items-center justify-center">
                        <View tw="pr-2">
                            <SIcon path={iChat} size={25} tw="text-white" />
                        </View>
                        <View>
                            <Text tw="text-xl text-white">Add review</Text>
                        </View>
                    </View>
                </RButton>
            </View>

            <TouchableOpacity onPress={onPressAddReview} activeOpacity={0.8} tw="p-4 rounded-lg bg-s-200 dark:bg-s-700">
                <SIcon path={iCamera} size={25} tw="text-s-700 dark:text-s-200" />
            </TouchableOpacity>
        </View>
    );
};

export default WidgetNodeButtons;
