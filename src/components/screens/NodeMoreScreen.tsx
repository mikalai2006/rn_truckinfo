import React, {useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';

import {useAppDispatch} from '~store/hooks';
import {setActiveNode} from '~store/appSlice';

import {useObject} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
// import WidgetNode from '../widgets/node/WidgetNode';
import WidgetNodeHeader from '~components/widgets/node/WidgetNodeHeader';
import WidgetNodeButtons from '~components/widgets/node/WidgetNodeButtons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import WidgetNodeAudit from '~components/widgets/node/WidgetNodeAudit';
import SIcon from '~components/ui/SIcon';
import UIInfo from '~components/ui/UIInfo';
import WidgetNodeRatingShort from '~components/widgets/node/WidgetNodeRatingShort';
import WidgetNodeTags from '~components/widgets/node/WidgetNodeTags';
import WidgetNodeImages from '~components/widgets/node/WidgetNodeImages';
import WidgetNodeAddress from '~components/widgets/node/WidgetNodeAddress';
import UIButton from '~components/ui/UIButton';
import {iWarning} from '~utils/icons';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SSkeleton} from '~components/ui/SSkeleton';
import WidgetNodeAuthor from '~components/widgets/node/WidgetNodeAuthor';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodeMoreScreen'>;

const NodeMoreScreen = (props: Props) => {
    // console.log('NodeMoreScreen render');

    const {t} = useTranslation();

    const {navigation, route} = props;
    const {lidNode, serverNode, isServerNodeRemove, error} = route.params;

    const [isShowTagList, setIsShowTagList] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsShowTagList(true);
        }, 300);
    }, []);

    const dispatch = useAppDispatch();

    useEffect(() => {
        // 👇️ run a function when the component unmounts 👇️
        return () => {
            // console.log('Close sheet');
            // props.route.params.marker = null;
            dispatch(setActiveNode(null));
        };
    }, [dispatch]);

    const _node = useObject(NodeSchema, new BSON.ObjectId(lidNode));
    const localNode = {..._node};

    const isRemovedNode = useMemo(() => isServerNodeRemove && !!localNode.sid, [isServerNodeRemove, localNode.sid]);

    const isLoading = false;

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950">
            <View>
                <View tw="mx-2 px-2">
                    <WidgetNodeHeader lid={localNode._id?.toHexString()} />
                </View>
                <View tw="py-3">
                    <WidgetNodeButtons id={localNode._id} />
                </View>
            </View>

            <ScrollView tw="flex-1 flex">
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
                                                <SIcon
                                                    path={iWarning}
                                                    size={25}
                                                    tw="mr-2 text-red-800 dark:text-red-300"
                                                />
                                                <Text tw="text-red-800 dark:text-red-300 leading-5 text-lg">
                                                    {t('general:errorTitle')}
                                                </Text>
                                            </View>
                                        }
                                        Content={
                                            <View tw="flex flex-row p-4 pt-0">
                                                <View tw="flex-auto">
                                                    <Text tw="text-black dark:text-red-300 text-base leading-5">
                                                        {error}
                                                    </Text>
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
                    {/* <WidgetNodeVote lid={localNode._id.toHexString()} serverNode={serverNode} /> */}
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
            </ScrollView>
        </SafeAreaView>
    );
};

export default NodeMoreScreen;
