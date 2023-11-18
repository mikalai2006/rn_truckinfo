import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '~store/hooks';
import {amenities, INode, IAmenity} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import dayjs from '~utils/dayjs';
import {useTranslation} from 'react-i18next';

const WidgetFeature = ({node}: {node: INode | null}) => {
    const {t} = useTranslation();
    const amenityStore = useAppSelector(amenities);
    const [amenityConfig, setAmenityConfig] = useState<IAmenity | null>(null);

    useEffect(() => {
        node && setAmenityConfig(amenityStore[node.type]);
    }, [amenityStore, node]);

    return (
        <View tw="px-4">
            <View tw="pt-4 flex flex-row flex-nowrap items-center gap-x-4">
                <View tw="w-12 h-12">
                    <View
                        tw="p-2 rounded-lg"
                        style={{
                            backgroundColor: amenityConfig?.props.bgColor,
                        }}>
                        <SIcon
                            style={{
                                color: amenityConfig?.props.iconColor,
                            }}
                            size={30}
                            path={amenityConfig?.props.icon}
                        />
                    </View>
                </View>
                <View tw="flex-auto">
                    {node && (
                        <Text tw="text-sm leading-4 text-s-600 dark:text-s-400">{amenityStore[node.type]?.title}</Text>
                    )}
                    <>
                        <Text numberOfLines={1} tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                            {node?.name || node?.address?.props?.title}
                        </Text>
                        <Text numberOfLines={1} tw="text-xs leading-4 text-s-900 dark:text-s-100">
                            {t('general:added')} {dayjs(node?.updatedAt).fromNow()}
                        </Text>
                        {/* <Text tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                                        {activeNodeFromStore?.address?.props?.subtitle !== ''
                                            ? `${activeNodeFromStore?.address?.props?.subtitle}`
                                            : ''}
                                    </Text> */}
                    </>
                </View>
            </View>
        </View>
    );
};

export default WidgetFeature;
