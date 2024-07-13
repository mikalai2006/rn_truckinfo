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
import WidgetNodeAudit from './WidgetNodeAudit';
import UIButton from '~components/ui/UIButton';
import {useNavigation} from '@react-navigation/native';
import WidgetNodeAuthor from './WidgetNodeAuthor';
import WidgetNodeVote from './WidgetNodeVote';

export interface IWidgetNodeProps {
    node: TNodeSchema;
}
const WidgetNode = (props: IWidgetNodeProps) => {
    const {node} = props;
    // console.log('WidgetNode render');
    const navigation = useNavigation();
    const [isShowTagList, setIsShowTagList] = useState(false);
    const {animatedIndex} = useBottomSheet();
    useAnimatedReaction(
        () => {
            return animatedIndex.value > -1;
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

    const localNode = useMemo(() => {
        return {..._node};
    }, [_node]);

    const {isServerNodeRemove, serverNode, isLoading, error} = useNode({localNodeId: node._id});

    const isRemovedNode = useMemo(() => isServerNodeRemove && !!localNode.sid, [isServerNodeRemove, localNode.sid]);

    return !isLoading ? (
        <View tw="flex-1">
            <WidgetNodeAudit lid={localNode._id.toHexString()} serverNode={serverNode} />
            <View tw="flex">
                <View tw="flex px-3">
                    {error && (
                        <View tw="mb-3 overflow-hidden">
                            <UIInfo
                                twClass="bg-red-200 dark:bg-s-800"
                                Title={
                                    <View tw="flex flex-row items-center">
                                        <SIcon path={iWarning} size={25} tw="mr-2 text-red-800 dark:text-red-300" />
                                        <Text tw="text-red-800 dark:text-red-300 leading-5 text-lg">
                                            {t('general:errorTitle')}
                                        </Text>
                                    </View>
                                }
                                Content={
                                    <View tw="flex flex-row p-4 pt-0">
                                        <View tw="flex-auto">
                                            <Text tw="text-black dark:text-red-300 text-base leading-5">{error}</Text>
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                    )}
                </View>
                {/* {!serverNode && !isServerNodeRemove && (
                    <View tw="px-4 mb-3 overflow-hidden">
                        <UIInfo
                            // titleText={t('general:errorTitle')}
                            Title={
                                <View tw="flex flex-row items-center">
                                    <SIcon path={iWarning} size={25} tw="mr-2 text-red-800 dark:text-red-300" />
                                    <Text tw="text-red-800 dark:text-red-300 leading-5 text-lg">
                                        {t('general:errorTitle')}
                                    </Text>
                                </View>
                            }
                            contentText={t('general:offlineDataTitle')}
                            twClass="bg-white dark:bg-s-800"
                        />
                    </View>
                )} */}
            </View>
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
            <View tw="flex px-3">
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
            </View>
            <View tw="flex-1 px-3">
                {isShowTagList ? (
                    <WidgetNodeTags
                        localNode={localNode}
                        serverNode={serverNode}
                        isLoading={isLoading}
                        isRemovedNode={isRemovedNode}
                    />
                ) : (
                    <View tw="pt-2">
                        <View tw="flex">
                            <View tw="flex flex-row flex-wrap jsutify-center">
                                <SSkeleton classString="h-24 mt-2 mr-1 w-[32%]" />
                                <SSkeleton classString="h-24 mt-2 mr-1 w-[33%]" />
                                <SSkeleton classString="h-24 mt-2 w-[32%]" />

                                <SSkeleton classString="h-24 mt-2 mr-1 w-[32%]" />
                                <SSkeleton classString="h-24 mt-2 mr-1 w-[33%]" />
                                <SSkeleton classString="h-24 mt-2 w-[32%]" />
                            </View>
                            {/* {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                                <View key={item.toString()} tw="flex-auto">
                                    <SSkeleton classString="flex-auto h-16 mb-2" />
                                </View>
                            ))} */}
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
                <WidgetNodeVote lid={localNode._id.toHexString()} serverNode={serverNode} />
            </View>
            <View tw="pt-3">
                <WidgetNodeImages localNode={localNode} serverNode={serverNode} isRemovedNode={isRemovedNode} />
            </View>
            <View>
                <WidgetNodeAddress serverNode={serverNode} />
            </View>
            {serverNode?.user && (
                <View tw="px-4">
                    <WidgetNodeAuthor lid={localNode?._id.toHexString()} serverNode={serverNode} />
                </View>
            )}
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
        <View tw="flex-1 px-3 rounded-xl">
            <View tw="flex flex-row mb-3">
                {/* <View tw="w-16">
                    <SSkeleton classString="w-12 h-12 mr-4" />
                </View> */}
                <View tw="flex-auto">
                    <SSkeleton classString="h-12" />
                </View>
            </View>
            {/* <View tw="px-6">
                <SSkeleton classString="h-6 mt-2" />
            </View> */}
            <View tw="flex flex-row flex-wrap jsutify-center">
                <SSkeleton classString="h-24 mr-1 w-[32%]" />
                <SSkeleton classString="h-24 mr-1 w-[33%]" />
                <SSkeleton classString="h-24 w-[32%]" />

                <SSkeleton classString="h-24 mt-2 mr-1 w-[32%]" />
                <SSkeleton classString="h-24 mt-2 mr-1 w-[33%]" />
                <SSkeleton classString="h-24 mt-2 w-[32%]" />
            </View>
        </View>
    );
};

export default WidgetNode;
