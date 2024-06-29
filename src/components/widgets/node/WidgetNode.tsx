import React, {useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {useBottomSheet} from '@gorhom/bottom-sheet';

import WidgetNodeRatingShort from './WidgetNodeRatingShort';
import WidgetNodeTags from '~components/widgets/node/WidgetNodeTags';
import {useTranslation} from 'react-i18next';
import {SSkeleton} from '~components/ui/SSkeleton';
import {useObject} from '@realm/react';
import {NodeSchema, TNodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import WidgetNodeImages from '~components/widgets/node/WidgetNodeImages';
import useNode from '~hooks/useNode';
import {iWarning} from '~utils/icons';
import SIcon from '~components/ui/SIcon';
import WidgetNodeAddress from './WidgetNodeAddress';
import UIInfo from '~components/ui/UIInfo';
// import WidgetNodeButtonRemove from './WidgetNodeButtonRemove';
import WidgetNodeAudit from './WidgetNodeAudit';
import UIButton from '~components/ui/UIButton';
import {useNavigation} from '@react-navigation/native';

export interface INodeScreenWrapperProps {
    node: TNodeSchema;
}
const NodeScreenWrapper = (props: INodeScreenWrapperProps) => {
    const {node} = props;
    // console.log('NodeScreenWrapper render', node);
    const navigation = useNavigation();
    const {animatedIndex} = useBottomSheet();
    const [isShowTagList, setIsShowTagList] = useState(false);
    useAnimatedReaction(
        () => {
            return animatedIndex.value > 0.8;
        },
        v => {
            // 'worklet';

            if (v && !isShowTagList) {
                runOnJS(setIsShowTagList)(true);
            }
        },
    );

    const {t} = useTranslation();

    const _node = useObject(NodeSchema, new BSON.ObjectId(node._id));

    const localNode = {..._node};

    const {isServerNodeRemove, serverNode, isLoading} = useNode({localNodeId: node._id});

    const isRemovedNode = useMemo(() => isServerNodeRemove && !!localNode.sid, [isServerNodeRemove, localNode.sid]);

    return localNode?._id ? (
        <View tw="flex-1 flex">
            <WidgetNodeAudit lid={localNode._id.toHexString()} serverNode={serverNode} />
            {!serverNode && !isServerNodeRemove && (
                <View tw="px-4 mb-3 overflow-hidden">
                    <UIInfo
                        // titleText={t('general:offlineMode')}
                        Title={
                            <View tw="flex flex-row items-center">
                                <SIcon path={iWarning} size={25} tw="mr-2 text-red-800 dark:text-red-300" />
                                <Text tw="text-red-800 dark:text-red-300 leading-5 text-lg">
                                    {t('general:offlineMode')}
                                </Text>
                            </View>
                        }
                        contentText={t('general:offlineDataTitle')}
                        twClass="bg-white dark:bg-s-800"
                    />
                    {/* <View tw="mx-6 mb-3 p-2 bg-red-200 dark:bg-red-500/10">
                     <Text tw="text-base text-red-900 dark:text-red-200">{t('general:offlineDataTitle')}</Text>
                </View> */}
                </View>
            )}
            <View tw="mx-2 px-2">
                {/* <WidgetNodeHeader node={localNode} />
                <View tw="py-2 -mx-4">
                    <WidgetNodeButtons id={localNode._id} />
                </View> */}
                <View tw="pb-2">
                    <WidgetNodeRatingShort
                        localNode={localNode}
                        serverNode={serverNode}
                        isRemovedNode={isRemovedNode}
                    />
                </View>
            </View>
            {/* <WidgetNodeLikes /> */}
            <View tw="flex-1 bg-s-100 dark:bg-s-950 px-3">
                {isRemovedNode ? (
                    <View tw="mb-3 overflow-hidden">
                        <UIInfo
                            twClass="bg-red-200 dark:bg-s-800"
                            Title={
                                <View tw="flex flex-row items-center">
                                    <SIcon path={iWarning} size={25} tw="mr-2 text-red-800 dark:text-red-300" />
                                    <Text tw="font-bold text-red-800 dark:text-red-300 leading-5 text-lg">
                                        {t('general:removeNodeToServerTitle')}
                                    </Text>
                                </View>
                            }
                            Content={
                                <View tw="flex flex-row p-4 pt-0">
                                    {/* <View tw="px-2 pt-6">
                                        <SIcon path={iWarning} size={40} tw="text-red-900 dark:text-red-300" />
                                    </View> */}
                                    <View tw="flex-auto">
                                        <Text tw="text-black dark:text-red-300 text-base leading-5">
                                            {t('general:removeNodeToServer')}
                                        </Text>
                                        {/* <View tw="flex items-start">
                                            <TouchableOpacity
                                                onPress={() => {}}
                                                tw="p-2 bg-red-900/10 flex items-center justify-center rounded-lg">
                                                <Text tw="text-black dark:text-red-200 text-base">
                                                    {t('general:delete')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View> */}
                                    </View>
                                </View>
                            }
                        />
                    </View>
                ) : (
                    ''
                )}
                {isShowTagList ? (
                    <WidgetNodeTags
                        localNode={localNode}
                        serverNode={serverNode}
                        isLoading={isLoading}
                        isRemovedNode={isRemovedNode}
                    />
                ) : (
                    <View tw="pt-2">
                        <View tw="flex flex-row">
                            {[1, 2, 3].map(item => (
                                <View key={item.toString()} tw="w-1/3 h-24">
                                    <SSkeleton classString="w-full h-full mx-1" />
                                </View>
                            ))}
                        </View>
                        <View tw="flex-auto px-1 pt-3">
                            <SSkeleton classString="h-12" />
                        </View>
                    </View>
                )}
                {/* <WidgetNodeImagesLine /> */}
                {/* <WidgetNodeVisited />
                        <WidgetNodeVisitedTime /> */}
            </View>
            <View tw="pt-3">
                <WidgetNodeImages localNode={localNode} serverNode={serverNode} isRemovedNode={isRemovedNode} />
            </View>
            <View>
                <WidgetNodeAddress serverNode={serverNode} />
            </View>
            <View tw="my-3 px-4 overflow-hidden">
                <UIButton
                    type="default"
                    text={t('general:goToAuditPage')}
                    onPress={() => {
                        navigation.navigate('NodeAuditScreen', {
                            lid: localNode?._id.toHexString(),
                            serverNode,
                            isServerNodeRemove,
                        });
                    }}
                />
                {/* <UIInfo
                    twClass="py-1"
                    Title={
                        <View tw="flex flex-row items-center">
                            <Text tw="text-s-800 dark:text-s-300 leading-5 text-lg">{t('general:anotherActions')}</Text>
                        </View>
                    }
                    Content={
                        <View tw="flex flex-row p-4 pt-3">
                            <View tw="flex-auto">
                                <WidgetNodeButtonRemove
                                    localNode={localNode}
                                    isServerNodeRemove={isServerNodeRemove}
                                    serverNode={serverNode}
                                />
                            </View>
                        </View>
                    }
                /> */}
            </View>
        </View>
    ) : (
        <View tw="pt-6 mx-2 bg-white dark:bg-s-800 rounded-xl">
            <View tw="flex flex-row px-6">
                <View tw="w-16">
                    <SSkeleton classString="w-12 h-12 mr-4" />
                </View>
                <View tw="flex-auto">
                    <SSkeleton classString="h-4" />
                    <SSkeleton classString="h-4 mt-2" width={'80%'} />
                </View>
            </View>
            <View tw="px-6">
                <SSkeleton classString="h-6 mt-2" />
            </View>
            <View tw="px-6 flex flex-row flex-wrap">
                <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                <SSkeleton classString="h-20 mt-2" width={'32%'} />

                <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                <SSkeleton classString="h-20 mt-2" width={'32%'} />
            </View>
        </View>
    );
};

export default NodeScreenWrapper;
