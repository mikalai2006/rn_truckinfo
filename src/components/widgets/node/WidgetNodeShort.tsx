import React, {useState} from 'react';
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
import {iWarning} from '~utils/icons';
import SIcon from '~components/ui/SIcon';
import WidgetNodeAddress from './WidgetNodeAddress';
import UIInfo from '~components/ui/UIInfo';
import WidgetNodeButtonRemove from './WidgetNodeButtonRemove';
import WidgetNodeAudit from './WidgetNodeAudit';
import WidgetNodeTagsShort from './WidgetNodeTagsShort';

export interface IWidgetNodeShortProps {
    node: TNodeSchema;
}
const WidgetNodeShort = (props: IWidgetNodeShortProps) => {
    const {node} = props;
    // console.log('NodeScreenWrapper render', node);
    // const {animatedIndex} = useBottomSheet();
    // const [isShowTagList, setIsShowTagList] = useState(false);
    // useAnimatedReaction(
    //     () => {
    //         return animatedIndex.value > 0.8;
    //     },
    //     v => {
    //         // 'worklet';

    //         if (v && !isShowTagList) {
    //             runOnJS(setIsShowTagList)(true);
    //         }
    //     },
    // );

    const {t} = useTranslation();

    const _node = useObject(NodeSchema, new BSON.ObjectId(node._id));

    const localNode = {..._node};

    return localNode?._id ? (
        <View tw="flex-1 flex">
            {/* <WidgetNodeAudit lid={localNode._id.toHexString()} serverNode={serverNode} /> */}
            <View tw="mx-2 px-2">
                {/* <WidgetNodeHeader node={localNode} />
                <View tw="py-2 -mx-4">
                    <WidgetNodeButtons id={localNode._id} />
                </View> */}
                <View tw="pb-2">
                    {/* <WidgetNodeRatingShort
                        localNode={localNode}
                        serverNode={serverNode}
                        isRemovedNode={isRemovedNode}
                    /> */}
                </View>
            </View>
            {/* <WidgetNodeLikes /> */}
            <View tw="flex-1 px-3">
                <WidgetNodeTagsShort localNode={localNode} />
                {/* <WidgetNodeImagesLine /> */}
                {/* <WidgetNodeVisited />
                        <WidgetNodeVisitedTime /> */}
            </View>
            {/* <View tw="pt-3">
                <WidgetNodeImages localNode={localNode} serverNode={serverNode} isRemovedNode={isRemovedNode} />
            </View>
            <View>
                <WidgetNodeAddress serverNode={serverNode} />
            </View> */}
            {/* <View tw="my-3 px-4 overflow-hidden">
                <UIInfo
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
                />
            </View> */}
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

export default WidgetNodeShort;
