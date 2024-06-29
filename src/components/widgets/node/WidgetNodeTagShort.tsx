import React, {useMemo} from 'react';
import {Text, View} from 'react-native';

import {useAppSelector} from '~store/hooks';
import {INodedata, tags} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import RImage from '~components/r/RImage';
import {iCheck} from '~utils/icons';

export interface IWidgetNodeTagShortProps {
    tagId: string;
    nodedatas: INodedata[];
}

const WidgetNodeTagShort = (props: IWidgetNodeTagShortProps) => {
    const {tagId, nodedatas} = props;

    const navigation = useNavigation<MapLocalStackParamList>();
    const {t} = useTranslation();

    const tagsFromStore = useAppSelector(tags);

    const image = useMemo(() => {
        const result = [];

        for (const nodedata of nodedatas) {
            const tag = tagsFromStore[nodedata.tagId];
            const tagOpt = tag.options.find(x => x.id === nodedata.tagoptId);
            if (tagOpt?.props?.image) {
                result.push(tagOpt.props.image);
            }
        }

        return result[0];
    }, [nodedatas, tagsFromStore]);

    console.log('nodedatas:', nodedatas);

    return (
        <View tw="flex justify-center items-center relative p-2 mr-1.5 mb-1.5 bg-white dark:bg-s-900 rounded-full">
            {nodedatas[0].tag.props?.icon ? (
                <SIcon path={nodedatas[0].tag.props.icon} tw="text-s-800 dark:text-s-300" size={25} />
            ) : image ? (
                <RImage
                    uri={image}
                    classString="h-6"
                    style={{
                        width: undefined,
                        aspectRatio: 1,
                        resizeMode: 'contain',
                    }}
                />
            ) : null}
            {/* {nodedatas[0].value !== 'yes' ? (
                <View tw="absolute -top-2 right-2 px-1 bg-green-500 dark:bg-green-500/50 rounded-lg">
                    <Text tw="text-sm text-white dark:text-s-100">
                        {nodedatas[0].value || nodedatas[0]?.tagopt?.value}
                    </Text>
                </View>
            ) : (
                <View tw="absolute -top-2 right-2 px-1  h-5 w-5 rounded-full flex items-center">
                    <SIcon path={iCheck} size={30} tw="text-green-500 dark:text-green-700" />
                </View>
            )} */}
            {/* <View tw="flex-auto">
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    textBreakStrategy="simple"
                    tw="mt-2 px-1 text-center text-base text-s-800 dark:text-s-100 leading-4">
                    {nodedatas[0].tag.title}
                </Text>
            </View> */}
        </View>
    );
};

export default WidgetNodeTagShort;
