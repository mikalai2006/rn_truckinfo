import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '~store/hooks';
import {amenities, IAmenity} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import dayjs from '~utils/dayjs';
import {useTranslation} from 'react-i18next';
import RCountry from '~components/r/RCountry';
import {NodeSchema} from '~schema/NodeSchema';
import {useObject} from '@realm/react';
import {BSON} from 'realm';

const WidgetNodeHeader = ({lid}: {lid: string | undefined}) => {
    // console.log('Render WidgetNodeHeader');

    const {t} = useTranslation();
    const amenityStore = useAppSelector(amenities);
    const [amenityConfig, setAmenityConfig] = useState<IAmenity | null>(null);

    const node = useObject(NodeSchema, new BSON.ObjectId(lid));

    useEffect(() => {
        node?.type && setAmenityConfig(amenityStore[node.type]);
    }, [amenityStore, node]);

    return (
        <View tw="">
            <View tw="pt-4 flex flex-row flex-nowrap items-center gap-x-4 relative">
                {/* {node?.ccode && (
                    <View tw="absolute right-0 top-2 p-1 ">
                        <RCountry code={node?.ccode} />
                    </View>
                )} */}
                <View tw="w-12 relative">
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
                    <View tw="self-center pt-2">
                        <RCountry code={node?.ccode} />
                    </View>
                </View>
                <View tw="flex-auto">
                    {node?.name && (
                        <Text tw="text-base leading-4 text-s-700 dark:text-s-400">
                            {amenityStore[node.type]?.title}
                        </Text>
                    )}
                    <>
                        <Text numberOfLines={1} tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                            {node?.name || amenityStore[node.type]?.title}
                        </Text>
                        {/* <Text numberOfLines={1} tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                            {node?.lat}, {node?.lon}
                        </Text> */}
                        <Text tw="text-base leading-5 text-s-700 dark:text-s-300">
                            {node?.lat}, {node?.lon}
                        </Text>
                        <Text numberOfLines={1} tw="text-xs leading-4 text-s-400 dark:text-s-400">
                            {t('general:added')} {dayjs(node?.createdAt).fromNow()}
                        </Text>
                    </>
                </View>
            </View>
        </View>
    );
};

export default WidgetNodeHeader;
