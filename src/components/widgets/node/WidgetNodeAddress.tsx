import {View, Text} from 'react-native';
import React from 'react';
import {INode} from '~store/appSlice';

type Props = {
    serverNode: INode;
};
const WidgetNodeAddress = (props: Props) => {
    const {serverNode} = props;
    // const markerConfigFromStore = useAppSelector(markerConfig);
    // const activeNodeFromStore = useAppSelector(activeNode);

    return (
        <View tw="px-4">
            <View tw="pt-3 flex flex-row flex-nowrap items-center gap-x-4">
                {/* <View tw="w-14 h-12">
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
                </View> */}
                <View tw="flex-auto">
                    <Text tw="text-base leading-5 text-s-500 dark:text-s-500">{serverNode?.address?.dAddress}</Text>
                </View>
            </View>
        </View>
    );
};

export default WidgetNodeAddress;
