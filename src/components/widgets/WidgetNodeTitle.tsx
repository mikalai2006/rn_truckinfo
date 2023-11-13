import {View, Text} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {activeNode} from '~store/appSlice';

const WidgetNodeTitle = () => {
    const activeNodeFromStore = useAppSelector(activeNode);

    return (
        <View tw="px-4">
            <Text tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                {activeNodeFromStore?.address?.props?.title}{' '}
            </Text>
            <Text tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                {activeNodeFromStore?.address?.props?.subtitle !== ''
                    ? `${activeNodeFromStore?.address?.props?.subtitle}`
                    : ''}
            </Text>
        </View>
    );
};

export default WidgetNodeTitle;
