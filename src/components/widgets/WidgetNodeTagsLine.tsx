import {Modal, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useAppSelector} from '~store/hooks';
import {ITag, activeNode, tags} from '~store/appSlice';

import SIcon from '~components/ui/SIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {iPlusLg} from '~utils/icons';
import {useTranslation} from 'react-i18next';

const WidgetNodeTagsLine = () => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const activeMarkerData = useAppSelector(activeNode);
    const tagsStore = useAppSelector(tags);

    return (
        <>
            <View tw="p-2 flex flex-row flex-wrap">
                {activeMarkerData?.data?.map((el, i) => (
                    <View key={i.toString()} tw="basis-[25%]">
                        <View tw="relative m-1 flex-1">
                            <TouchableOpacity
                                tw="h-full rounded-lg p-0 py-2 bg-white dark:bg-s-800  flex-col items-center justify-end"
                                onPress={() => navigation.navigate('NodedataScreen', {nodedata: {...el}})}>
                                {el.tag.props?.icon && (
                                    <SIcon path={el.tag.props.icon} tw="text-s-800 dark:text-s-300" size={30} />
                                )}
                                {/* <View
                                tw={
                                    (el.value === 'no' ? 'bg-red-500 ' : 'bg-green-500 ') +
                                    'p-1 absolute right-2 top-2 rounded-md'
                                }>
                                <Text tw={(el.value === 'no' ? '' : '') + 'text-xs text-white dark:text-black'}>
                                    {el.tagopt?.title || el.value}
                                </Text>
                            </View> */}
                                <View key={i} tw="flex-auto">
                                    {/* <Text tw="text-s-800 dark:text-s-300">{el.tag.key}</Text> */}
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        tw="text-center text-xs text-s-800 dark:text-s-300">
                                        {el.tag.title}
                                    </Text>
                                    {/* <Text tw="text-s-800 dark:text-s-300">{el.value}</Text> */}
                                    {/* {el.options?.length
                                ? el.options.map(x => (
                                      <>
                                          <Text>{x.value}</Text>
                                      </>
                                  ))
                                : ''} */}
                                </View>
                                <View
                                    tw={
                                        (el.value === 'no' ? 'bg-red-500 ' : 'bg-green-500 ') +
                                        'p-1 rounded-b-md self-stretch'
                                    }>
                                    <Text tw={(el.value === 'no' ? '' : '') + 'text-xs text-white dark:text-black'}>
                                        {el.value === 'yes'
                                            ? t('general:tagoptYes')
                                            : el.tagopt?.title
                                            ? el.tagopt?.title
                                            : el.value}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View tw="basis-[100%]">
                    <View tw="relative m-1 flex-1">
                        <TouchableOpacity
                            tw="h-full rounded-lg p-0 p-3 bg-white dark:bg-s-800  flex-row items-center justify-end"
                            onPress={() => navigation.navigate('NodedataCreatorScreen')}>
                            <SIcon path={iPlusLg} tw="text-s-800 dark:text-s-300" size={30} />
                            <View tw="flex-auto">
                                {/* <Text tw="text-s-800 dark:text-s-300">{el.tag.key}</Text> */}
                                <Text
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    tw="text-center text-sm text-s-800 dark:text-s-300">
                                    {t('general:addTagopt')}
                                </Text>
                                {/* <Text tw="text-s-800 dark:text-s-300">{el.value}</Text> */}
                                {/* {el.options?.length
                            ? el.options.map(x => (
                                    <>
                                        <Text>{x.value}</Text>
                                    </>
                                ))
                            : ''} */}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

export default WidgetNodeTagsLine;
