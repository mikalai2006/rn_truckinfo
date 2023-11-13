import {View, Text} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {activeNode, markerConfig} from '~store/appSlice';

import SIcon from '~components/ui/SIcon';

const WidgetNodeAddress = () => {
    const markerConfigFromStore = useAppSelector(markerConfig);
    const activeNodeFromStore = useAppSelector(activeNode);

    return (
        <View tw="px-4">
            <View tw="pt-1 flex flex-row flex-nowrap items-center gap-x-4">
                <View tw="w-14 h-12">
                    <View
                        tw="p-2 rounded-lg"
                        style={{
                            backgroundColor: markerConfigFromStore?.bgColor,
                        }}>
                        <SIcon
                            style={{
                                color: markerConfigFromStore?.iconColor,
                            }}
                            size={40}
                            path={markerConfigFromStore?.icon}
                        />
                    </View>
                </View>
                <View tw="flex-auto">
                    <Text tw="text-lg leading-6 text-s-600 dark:text-s-400">
                        {activeNodeFromStore?.address?.dAddress}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default WidgetNodeAddress;
