import React, {useMemo} from 'react';
import {Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useObject} from '@realm/react';
import {NodeSchema, TNodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import SIcon from '~components/ui/SIcon';
import WidgetNodeTagsShort from './WidgetNodeTagsShort';
import UIButton from '~components/ui/UIButton';
import {useNavigation} from '@react-navigation/native';
import {iChevronDown} from '~utils/icons';
import useNode from '~hooks/useNode';
import {SSkeleton} from '~components/ui/SSkeleton';
import WidgetNodeShortRating from './WidgetNodeShortRating';

export interface IWidgetNodeShortProps {
    node: TNodeSchema;
}
const WidgetNodeShort = (props: IWidgetNodeShortProps) => {
    const {node} = props;

    const navigation = useNavigation();
    // console.log('WidgetNodeShort render', node);
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

    const {isServerNodeRemove, serverNode, isLoading, error} = useNode({localNodeId: node._id});
    const isRemovedNode = useMemo(() => isServerNodeRemove && !!localNode.sid, [isServerNodeRemove, localNode.sid]);

    return (
        <View tw="flex-1 flex">
            {!isLoading ? (
                <>
                    <View tw="px-4">
                        <WidgetNodeShortRating
                            localNode={localNode}
                            serverNode={serverNode}
                            isRemovedNode={isRemovedNode}
                        />
                    </View>
                    <View tw="flex-auto p-3 px-4">
                        {localNode.data?.length > 0 ? <WidgetNodeTagsShort localNode={localNode} /> : null}
                    </View>
                    <View tw="px-3 pb-3">
                        <UIButton
                            type="default"
                            twClass="flex flex-row items-center"
                            onPress={() => {
                                navigation.navigate('NodeMoreScreen', {
                                    lidNode: localNode._id?.toHexString(),
                                    serverNode,
                                    error,
                                });
                            }}>
                            <View tw="flex-auto">
                                <Text tw="text-base leading-5 text-s-900 dark:text-s-200">{t('general:more')}</Text>
                            </View>
                            <View tw="transform -rotate-90">
                                <SIcon path={iChevronDown} size={25} tw="text-s-700 dark:text-s-200" />
                            </View>
                        </UIButton>
                    </View>
                </>
            ) : (
                <View tw="">
                    <View tw="flex flex-row px-3">
                        <View tw="flex-auto">
                            <SSkeleton classString="h-7 w-[80%]" />
                        </View>
                    </View>
                    <View tw="p-4 flex flex-row items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(key => (
                            <SSkeleton key={key} classString="h-12 w-12 rounded-full mr-1.5" />
                        ))}
                    </View>
                    <View tw="px-3 flex flex-row flex-wrap">
                        <SSkeleton classString="h-12 w-full" />
                    </View>
                </View>
            )}
        </View>
    );
};

export default WidgetNodeShort;
