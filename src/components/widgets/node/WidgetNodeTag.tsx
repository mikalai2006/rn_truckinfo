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

export interface IWidgetNodeTagProps {
    tagId: string;
    nodedatas: INodedata[];
}

const WidgetNodeTag = (props: IWidgetNodeTagProps) => {
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

    const tagopt = useMemo(() => {
        const result = [];

        for (const nodedata of nodedatas) {
            const tag = tagsFromStore[nodedata.tagId];
            const tagOpt = tag.options.find(x => x.id === nodedata.tagoptId);
            if (tagOpt) {
                result.push(tagOpt);
            }
        }

        return result[0];
    }, [nodedatas, tagsFromStore]);

    return (
        <View tw="flex items-center relative">
            {nodedatas[0].tag.props?.icon ? (
                <SIcon path={nodedatas[0].tag.props.icon} tw="text-s-800 dark:text-s-300" size={35} />
            ) : image ? (
                <RImage
                    uri={image}
                    classString="h-10"
                    style={{
                        width: undefined,
                        aspectRatio: 1,
                        resizeMode: 'contain',
                    }}
                />
            ) : null}
            {nodedatas[0].value === 'yes' ? (
                <View tw="absolute -top-2 right-2 px-1  h-5 w-5 rounded-full flex items-center">
                    <SIcon path={iCheck} size={30} tw="text-green-500 dark:text-green-700" />
                    {/* <Text tw="text-sm text-black">{t('general:tagoptYes')}</Text> */}
                </View>
            ) : null}
            {/* nodedatas.length === 1 ? (
                <View tw="absolute -top-2 right-2 px-1 bg-green-500 dark:bg-green-500/50 rounded-lg">
                    <Text tw="text-sm text-white dark:text-s-100">
                        {nodedatas[0]?.tagopt?.title || nodedatas[0]?.tagopt?.value || nodedatas[0].value}
                    </Text>
                </View>
            ) : */}
            {/* <View
                                tw={
                                    (el.value === 'no' ? 'bg-red-500 ' : 'bg-green-500 ') +
                                    'p-1 absolute right-2 top-2 rounded-md'
                                }>
                                <Text tw={(el.value === 'no' ? '' : '') + 'text-xs text-white dark:text-black'}>
                                    {el.tagopt?.title || el.value}
                                </Text>
                            </View> */}
            <View tw="flex-auto">
                {/* <Text tw="text-s-800 dark:text-s-300">{JSON.stringify(tagopt)}</Text> */}
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    textBreakStrategy="simple"
                    tw="mt-2 px-1 text-center text-base text-s-800 dark:text-s-100 leading-4">
                    {nodedatas[0].tag.title}
                    {nodedatas[0].value !== 'yes' && nodedatas.length === 1
                        ? ' - ' + (tagopt?.title || tagopt?.value || nodedatas[0].value)
                        : null}
                </Text>
            </View>
        </View>
    );
};

export default WidgetNodeTag;
