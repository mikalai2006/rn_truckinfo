import React, {useMemo} from 'react';
import {Text, ToastAndroid, View} from 'react-native';

import {useAppSelector} from '~store/hooks';
import {INode, INodedata, tags} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {iPlusLg} from '~utils/icons';
import {useTranslation} from 'react-i18next';
import {NodeSchema} from '~schema/NodeSchema';
import {ScreenKeys} from '~components/screens';
import WidgetNodeTagsVote from './WidgetNodeTagsVote';
import {useQuery} from '@realm/react';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import UIButton from '~components/ui/UIButton';
import WidgetNodeTag from './WidgetNodeTag';
// const {height: SCREEN_HEIGHT} = Dimensions.get('screen');

export interface IWidgetNodeTagsProps {
    localNode: NodeSchema;
    serverNode: INode;
    isLoading: boolean;
    isRemovedNode: boolean;
}

const WidgetNodeTags = (props: IWidgetNodeTagsProps) => {
    // console.log('Render WidgetNodeTags: ');
    const {localNode, serverNode, isLoading, isRemovedNode} = props;
    const localNodedatas = useQuery(
        NodeDataSchema,
        nodedatas => {
            return nodedatas.filtered('nlid == $0', localNode._id.toHexString());
        },
        [localNode._id],
    );

    const navigation = useNavigation<MapLocalStackParamList>();
    const {t} = useTranslation();

    // const node = useMemo(() => serverNode || localNode, [localNode, serverNode]);
    const nodedatas = useMemo(() => {
        const result = [...(serverNode?.data || [])];

        localNode.data?.forEach(el => {
            if (!result.find(x => x.id === el.sid)) {
                result.push({...el, id: el.sid});
            }
        });

        // console.log('localNodedatas::::::::::::::::', localNodedatas);

        localNodedatas?.forEach(el => {
            // if (!result.find(x => x.id === el.sid)) {
            result.push({...el, id: el._id.toHexString()});
            // }
        });

        return result; //[...(serverNode?.data || []), ...(localNode.data || []), ...(localNodedatas || [])];
    }, [localNode.data, localNodedatas, serverNode?.data]);
    // console.log('nodedatas.length=', nodedatas.length);

    // useObject(NodeSchema, new BSON.ObjectId(id));
    const tagsFromStore = useAppSelector(tags);
    // const activeMarkerData = useAppSelector(activeNode);

    // const tagsStore = useAppSelector(tags);
    // console.log('nodedatas=', localNode);

    const tagGroups = useMemo(() => {
        let result: [string, INodedata[]][] = [];
        const all: {[key: string]: INodedata[]} = {};

        nodedatas?.forEach((el: INodedata) => {
            const keyTag = el.tagId;
            if (el.tagId) {
                const elData = {...el, tag: tagsFromStore[keyTag]};
                if (!all[keyTag]) {
                    all[keyTag] = [elData];
                } else {
                    all[keyTag].push(elData);
                }
            }
        });
        result = Object.entries(all);
        // if (result.length > 7) {
        //     result = result.slice(0, 7);
        // }
        return result;
    }, [nodedatas, tagsFromStore]);

    // const countVisibleTag = useMemo(() => {
    //     return SCREEN_HEIGHT > 800 ? 18 : 6;
    // }, []);

    return (
        <View tw="flex-1">
            {/* {tagGroups.length > 0 ? (
                <View>
                    <Text tw="text-s-900 dark:text-s-200 text-base px-2">{t('general:nodeTagsTitle')}:</Text>
                </View>
            ) : null} */}
            <View tw="flex-1 flex flex-row flex-wrap">
                {tagGroups.map(([key, el], i) => (
                    <View key={i.toString()} tw="w-1/3 lg:w-1/5 h-[130px]">
                        <View tw="relative m-1">
                            <TouchableOpacity
                                disabled={isRemovedNode}
                                tw="h-full rounded-xl p-0 pt-3 bg-white dark:bg-s-900 border border-s-200 dark:border-s-900 flex-col items-center justify-end"
                                onPress={() =>
                                    navigation.navigate(ScreenKeys.NodedataScreen, {
                                        lidNode: localNode._id.toHexString(),
                                        tagId: el[0].tagId,
                                    })
                                }>
                                <View tw="flex-auto self-stretch">
                                    <WidgetNodeTag tagId={key} nodedatas={el} />
                                </View>
                                <View tw="self-stretch">
                                    {el.length > 1 ? (
                                        <View tw="p-1">
                                            <Text tw="text-sm text-center text-s-900 dark:text-s-200 underline">
                                                {t('general:more')}...
                                            </Text>
                                        </View>
                                    ) : (
                                        <WidgetNodeTagsVote
                                            tagId={el[0].tagId}
                                            nodedatas={el}
                                            serverNode={serverNode}
                                            isLoading={isLoading}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View tw="w-full pt-0">
                    <View tw="relative m-1 flex-1">
                        {!isRemovedNode && (
                            <UIButton
                                type="default"
                                onPress={() => {
                                    navigation.navigate('NodedataCreatorScreen', {lid: localNode._id.toHexString()});
                                }}>
                                <View tw="flex flex-row items-center justify-center">
                                    <SIcon path={iPlusLg} tw="text-s-500 dark:text-s-500" size={30} />
                                    <View tw="ml-2">
                                        <Text
                                            numberOfLines={3}
                                            ellipsizeMode="tail"
                                            tw="text-lg text-center text-black dark:text-s-300">
                                            {t('general:addTagopt')}
                                        </Text>
                                    </View>
                                </View>
                            </UIButton>
                        )}
                        {/* <TouchableOpacity
                            tw="h-full rounded-lg px-2 pt-2 bg-s-200 flex items-center"
                            onPress={() =>
                                navigation.navigate('NodedataCreatorScreen', {lid: localNode._id.toHexString()})
                            }>
                            <SIcon path={iPlusLg} tw="text-black" size={30} />
                            <View>
                                <Text numberOfLines={3} ellipsizeMode="tail" tw="text-lg text-center text-black">
                                    {t('general:addTagopt')}
                                </Text>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WidgetNodeTags;
