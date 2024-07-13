import React, {useMemo, useRef} from 'react';
// import {HOST_API} from  '~utils/global';

import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SSkeleton} from '~components/ui/SSkeleton';
import dayjs from '~utils/dayjs';
import {INodedata, tags} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iHandThumbsDown, iHandThumbsDownFill, iHandThumbsUp, iHandThumbsUpFill, iWarning} from '~utils/icons';
import {useAppSelector} from '~store/hooks';
import {useNodedata} from '~hooks/useNodeData';
import {useObject, useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import {LikeSchema, TLikeSchema} from '~schema/LikeSchema';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import UIButton from '~components/ui/UIButton';
import {getObjectId} from '~utils/utils';
import WidgetUserInfo from '~components/widgets/user/WidgetUserInfo';
import WidgetNodedataVoteLast from '~components/widgets/nodedata/WidgetNodedataVoteLast';
import UIInfo from '~components/ui/UIInfo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import RImage from '~components/r/RImage';
import WidgetUserLink from '~components/widgets/user/WidgetUserLink';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodedataScreen'>;

const NodedataScreen = (props: Props) => {
    const {t} = useTranslation();
    const navigation = useNavigation();

    const {tagId, lidNode} = props.route.params;
    const localNode = useObject(NodeSchema, new BSON.ObjectId(lidNode));

    const tagsFromStore = useAppSelector(tags);
    const tag = useMemo(() => tagsFromStore[tagId] || {}, [tagId, tagsFromStore]);
    const localNodedatas = localNode?.data.filter(x => x.tagId === tagId);

    const newNodedatas = useQuery(
        NodeDataSchema,
        nodedatas => {
            return nodedatas.filtered('nlid == $0 AND tagId == $1', lidNode, tagId);
        },
        [],
    );
    // console.log('localNodedatas=', localNodedatas);
    // console.log('newNodedatas=', newNodedatas);

    const {nodeData, isLoading, error} = useNodedata({localNode, tagId});

    const localLikes = useQuery(LikeSchema, likes => {
        return likes;
    });

    const nodedataList = useMemo(() => {
        const result: INodedata[] = [];

        if (nodeData.length) {
            result.push(
                ...nodeData.map(x => {
                    return {
                        ...x,
                        localNodedataId: '',
                        serverNodedataId: x.id,
                    };
                }),
            );
        }

        if (localNodedatas) {
            localNodedatas.forEach(el => {
                if (
                    !result.find(
                        x =>
                            x.tagId === el.tagId &&
                            getObjectId(x.tagoptId) === getObjectId(el.tagoptId) &&
                            el.value === x.value,
                    )
                ) {
                    result.push({...el, localNodedataId: '', serverNodedataId: el.sid});
                }
            });
        }

        if (newNodedatas) {
            newNodedatas.forEach(el => {
                if (
                    !result.find(
                        x =>
                            x.tagId === el.tagId &&
                            getObjectId(x.tagoptId) === getObjectId(el.tagoptId) &&
                            el.value === x.value,
                    )
                ) {
                    result.push({...el, localNodedataId: el._id.toHexString(), serverNodedataId: el.sid});
                }
            });
        }

        const resultNodedata = result.map(x => {
            const localVotes = localLikes.filter(
                like =>
                    (x?.localNodedataId !== ''
                        ? like.localNodedataId === x.localNodedataId
                        : like.serverNodedataId === x.serverNodedataId) &&
                    (like.isLocal === true || nodeData.length === 0),
            );
            const currentVote = localLikes.find(like =>
                x?.localNodedataId !== ''
                    ? like.localNodedataId === x.localNodedataId
                    : like.serverNodedataId === x.serverNodedataId,
            )?.value;
            const localLike = localVotes.filter(z => z.value > 0).length;
            const localDLike = localVotes.filter(z => z.value < 0).length;
            const localLikeOldValue = localVotes[0]?.oldValue || 0;

            // console.log('localVotes=', localVotes, localVotes.length);
            // console.log('local likes=', localLike, localDLike);
            // console.log('likes=', x.like, x.dlike, typeof x.like === 'number');

            return {
                ...x,
                tag: tag, // x.tag ||
                tagopt: tag.options.find(y => y.id === x.tagoptId), // x.tagopt ||
                votes: x.votes || localVotes,
                like:
                    typeof x.like === 'number'
                        ? Math.max(
                              0,
                              x.like -
                                  (localLikeOldValue > 0 && localDLike
                                      ? 1
                                      : localLikeOldValue < 0 && localLike
                                      ? -1
                                      : 0),
                          )
                        : localLike,
                dlike:
                    typeof x.dlike === 'number'
                        ? Math.max(
                              0,
                              x.dlike -
                                  (localLikeOldValue > 0 && localDLike
                                      ? -1
                                      : localLikeOldValue < 0 && localLike
                                      ? 1
                                      : 0),
                          )
                        : localDLike,
                localLikeValue: currentVote,
            };
        });

        return resultNodedata;
    }, [nodeData, localNodedatas, newNodedatas, localLikes, tag]);

    // console.log('nodedataList=', nodedataList);

    const realm = useRealm();
    const onLike = (el: INodedata, value: 1 | -1) => {
        // console.log('onLike=', el);

        const newData: TLikeSchema = {
            localNodedataId: el?.localNodedataId,
            serverNodedataId: el?.serverNodedataId,
            value,
            oldValue: 0,
            ccode: localNode?.ccode,
            nlid: localNode?._id.toHexString(),
            isLocal: true,
        };

        realm.write(() => {
            const existLike = localLikes.filter(like =>
                el?.localNodedataId !== ''
                    ? like.localNodedataId === el.localNodedataId
                    : like.serverNodedataId === el.serverNodedataId,
            );
            // console.log('existLike=', existLike);

            realm.create(
                LikeSchema,
                {
                    ...newData,
                    oldValue: existLike[0]?.oldValue || 0,
                    _id: existLike[0]?._id || new BSON.ObjectId(),
                },
                UpdateMode.Modified,
            );
            // console.log('localLikes=', localLikes);
        });
    };

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950">
            <ScrollView>
                <View tw="flex-1">
                    <View tw="flex flex-row mx-4 p-4 bg-white rounded-xl dark:bg-s-900">
                        {tag.props?.icon && (
                            <View tw="bg-s-200 dark:bg-s-900 p-3 mr-3 rounded-full flex self-start shrink-0">
                                <SIcon path={tag.props.icon} tw="text-s-800 dark:text-s-300" size={40} />
                            </View>
                        )}
                        <View tw="flex-auto">
                            <Text tw="text-2xl leading-6 font-bold text-black dark:text-s-300">{tag?.title}</Text>
                            <Text tw="mt-1 text-base leading-5 text-black dark:text-s-400">{tag?.description}</Text>
                        </View>
                    </View>
                    <View tw="flex px-3 pt-4">
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
                    {isLoading ? (
                        [1, 2].map(item => (
                            <View key={item} tw="pt-3">
                                <View tw="flex flex-row px-4">
                                    <SSkeleton classString="w-10 h-10 rounded-full" />
                                    <SSkeleton classString="h-10 mx-2 flex-auto" />
                                    <SSkeleton classString="h-10 w-12" />
                                </View>
                                <View tw="px-4">
                                    <SSkeleton classString="h-64 mt-2" />
                                </View>
                            </View>
                        ))
                    ) : (
                        <View tw="px-4">
                            {nodedataList.length ? (
                                nodedataList.map((el, index) => (
                                    <View key={index.toString()} tw="mb-3">
                                        {el?.user && (
                                            <View tw="pb-2">
                                                <WidgetUserLink userData={el.user} />
                                            </View>
                                        )}
                                        <View tw="flex bg-white dark:bg-s-900 px-4 py-4 rounded-xl relative mt-2">
                                            {!error && (
                                                <View tw="rotate-[45deg] transform absolute -top-2 left-3 w-4 h-4 bg-white dark:bg-s-900" />
                                            )}
                                            {el?.createdAt && (
                                                <Text tw="text-s-500">
                                                    {/* {t('general:added')}  */}
                                                    {dayjs(el?.createdAt).fromNow()}
                                                </Text>
                                            )}
                                            <View tw="flex flex-row items-start">
                                                {el?.tagopt?.props?.image && (
                                                    <View tw="pr-2">
                                                        <RImage
                                                            uri={el.tagopt.props.image}
                                                            classString="h-10"
                                                            style={{
                                                                width: undefined,
                                                                aspectRatio: 1,
                                                                resizeMode: 'contain',
                                                            }}
                                                        />
                                                    </View>
                                                )}
                                                <View tw="flex-auto">
                                                    <Text tw="text-xl text-s-900 dark:text-white">
                                                        {/* {JSON.stringify(tag)} */}
                                                        {el?.tag?.title} -{' '}
                                                        {(el.value === 'yes'
                                                            ? t('general:tagoptYes')
                                                            : el?.tagopt?.title
                                                            ? el?.tagopt?.title
                                                            : el.value
                                                        )
                                                            .toString()
                                                            .toLowerCase()}
                                                    </Text>
                                                </View>
                                            </View>
                                            {el?.votes && (
                                                <>
                                                    <View tw="flex md:flex-row md:items-center mt-3 p-4 bg-s-500/10 dark:bg-s-500/10 border border-s-200 dark:border-s-700 rounded-xl">
                                                        <Text tw="text-base leading-5 text-s-900 dark:text-s-300">
                                                            {t('general:hintAddNodedataLike')}
                                                        </Text>
                                                        <View tw="flex flex-row items-center flex-auto justify-end">
                                                            <Text tw="text-base leading-5 text-black dark:text-white my-1 mr-3">
                                                                {el?.tag?.title} -{' '}
                                                                {(el.value === 'yes'
                                                                    ? t('general:tagoptYes')
                                                                    : el?.tagopt?.title
                                                                    ? el?.tagopt?.title
                                                                    : el.value
                                                                )
                                                                    .toString()
                                                                    .toLowerCase()}
                                                                ?
                                                            </Text>
                                                            <View tw="flex flex-row items-center">
                                                                <UIButton
                                                                    type="default"
                                                                    disabled={el.localLikeValue === 1}
                                                                    twClass="py-2"
                                                                    onPress={() => onLike(el, 1)}>
                                                                    <View tw="flex flex-row items-center">
                                                                        <SIcon
                                                                            path={
                                                                                // el.votes.find(x => x.userId === userStore?.id && x.value > 0)
                                                                                el.localLikeValue > 0
                                                                                    ? iHandThumbsUpFill
                                                                                    : iHandThumbsUp
                                                                            }
                                                                            tw={`${
                                                                                el.localLikeValue > 0
                                                                                    ? 'text-green-600 dark:text-green-300'
                                                                                    : 'text-s-800 dark:text-s-300'
                                                                            }`}
                                                                            size={25}
                                                                        />
                                                                        <Text tw="p-2 text-s-800 dark:text-s-300">
                                                                            {t('general:isTrue')}
                                                                        </Text>
                                                                        <View tw="self-center">
                                                                            {el.like > 0 && (
                                                                                <Text tw="bg-s-500 text-white px-2 py-1 leading-4 rounded-full">
                                                                                    {el.like}
                                                                                </Text>
                                                                            )}
                                                                        </View>
                                                                    </View>
                                                                </UIButton>
                                                                <UIButton
                                                                    type="default"
                                                                    disabled={el.localLikeValue === -1}
                                                                    twClass="py-2 ml-3"
                                                                    onPress={() => onLike(el, -1)}>
                                                                    <View tw="flex flex-row items-center">
                                                                        <SIcon
                                                                            path={
                                                                                // el.votes.find(x => x.userId === userStore?.id && x.value < 0)
                                                                                el.localLikeValue < 0
                                                                                    ? iHandThumbsDownFill
                                                                                    : iHandThumbsDown
                                                                            }
                                                                            tw={`${
                                                                                el.localLikeValue < 0
                                                                                    ? 'text-red-500 dark:text-red-300'
                                                                                    : 'text-s-800 dark:text-s-300'
                                                                            }`}
                                                                            size={25}
                                                                        />
                                                                        <Text tw="p-2 text-s-800 dark:text-s-300">
                                                                            {t('general:isFalse')}
                                                                        </Text>
                                                                        <View tw="self-center">
                                                                            {el.dlike > 0 && (
                                                                                <Text tw="bg-s-500 text-white px-2 py-1 leading-4 rounded-full">
                                                                                    {el.dlike}
                                                                                </Text>
                                                                            )}
                                                                        </View>
                                                                    </View>
                                                                </UIButton>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {el.id && (
                                                        <View>
                                                            <WidgetNodedataVoteLast nodedata={el} />
                                                        </View>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View>
                                    <Text>no info</Text>
                                </View>
                            )}
                            {/* <View tw="pt-6">
                        <Text tw="text-s-500">{t('general:historyTags')}</Text>
                    </View> */}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NodedataScreen;
