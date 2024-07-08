import React, {useMemo} from 'react';
import {Text, View} from 'react-native';

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
import WidgetNodeTagsListItem from './WidgetNodeTagsListItem';
// const {height: SCREEN_HEIGHT} = Dimensions.get('screen');

export interface IWidgetNodeTagsListProps {
    localNode: NodeSchema;
    serverNode: INode;
    isLoading: boolean;
    isRemovedNode: boolean;
}

const WidgetNodeTagsList = (props: IWidgetNodeTagsListProps) => {
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
            <View tw="flex-1">
                {tagGroups.map(([key, el], i) => (
                    <WidgetNodeTagsListItem
                        key={i.toString()}
                        tagId={key}
                        nodedatas={el}
                        isRemovedNode={isRemovedNode}
                        isLoading={isLoading}
                        localNode={localNode}
                        serverNode={serverNode}
                    />
                ))}
                <View tw="pb-2">
                    <View tw="relative">
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

export default WidgetNodeTagsList;
