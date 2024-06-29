import React, {useMemo, useRef} from 'react';
// import {HOST_API} from '@env';

import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SSkeleton} from '~components/ui/SSkeleton';
import dayjs from '~utils/dayjs';
import SUser from '~components/ui/SUser';
import {INodedata, tags} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iHandThumbsDown, iHandThumbsDownFill, iHandThumbsUp, iHandThumbsUpFill} from '~utils/icons';
import {useAppSelector} from '~store/hooks';
import {useNodedata} from '~hooks/useNodeData';
import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {useObject, useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import {LikeSchema, TLikeSchema} from '~schema/LikeSchema';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import UIButton from '~components/ui/UIButton';
import {getObjectId} from '~utils/utils';

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

    const {nodeData, isLoading} = useNodedata({localNode, tagId});

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
                if (!result.find(x => x.tagId === el.tagId && getObjectId(x.tagoptId) === getObjectId(el.tagoptId))) {
                    result.push({...el, localNodedataId: el._id.toHexString(), serverNodedataId: el.sid});
                }
            });
        }

        const resultNodedata = result.map(x => {
            const localVotes = localLikes.filter(
                like =>
                    (x?.localNodedataId !== ''
                        ? like.localNodedataId === x.localNodedataId
                        : like.serverNodedataId === x.serverNodedataId) && like.isLocal === true,
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

    // const userStore = useAppSelector(user);
    // const [nodedatas, setNodedatas] = useState<INodedata[]>([]);

    // const fetchNodedatas = useCallback(async () => {
    //     // setIsError(false);
    //     // setError('');
    //     // setIsLoading(true);
    //     try {
    //         if (!nodeId) {
    //             return;
    //         }
    //         await onGetNodedata({lang: activeLanguageFromStore?.code || 'en', nodeId, tagId})
    //             .then(response => {
    //                 setNodedatas(response.data.nodedatas.data);
    //                 ref?.current?.snapToIndex(1);
    //             })
    //             .catch(e => {
    //                 throw e;
    //             });
    //     } catch (e) {
    //         // setIsError(true);
    //         // setError(e?.message);
    //     } finally {
    //         // setIsLoading(false);
    //     }
    // }, [activeLanguageFromStore?.code, nodeId, snapPoints, tagId]);

    // useEffect(() => {
    //     if (tagId && nodeId) {
    //         fetchNodedatas();
    //     }
    // }, [fetchNodedatas, nodeId, tagId]);

    // const tokenStore = useAppSelector(tokens);
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

        // fetch(HOST_API + '/nodedatavote', {
        //     method: 'POST',
        //     headers: {
        //         'Access-Control-Allow-Origin-Type': '*',
        //         Authorization: `Bearer ${tokenStore?.access_token}`,
        //     },
        //     body: JSON.stringify(newData),
        // })
        //     .then(r => r.json())
        //     .then((response: any) => {
        //         if (response.message && response?.code === 401) {
        //             // dispatch(setTokens({access_token: ''}));
        //             console.log('onLike: ', response);
        //         } else if (response.code) {
        //             throw response;
        //         }

        //         // if ((response.id || response._id) && nodeStore) {
        //         // // nodeStore.data.push(response);
        //         // onGetNode(activeLanguageFromStore?.code || 'en', {lat: nodeStore.lat, lon: nodeStore.lon})
        //         //     .then(r => {
        //         //         if (r?.message && r?.code === 401) {
        //         //             console.log('401 marker');
        //         //         }
        //         //         dispatch(setActiveNode(r.data.node));
        //         //     })
        //         //     .catch(e => {
        //         //         throw e;
        //         //     });
        //         // }
        //         // fetchNodedatas();
        //     })
        //     .catch(e => {
        //         console.log('error:', e);

        //         Alert.alert('Error', e.message, [{text: 'OK', onPress: () => {}}]);
        //     });
    };
    // const onDisLike = (el: INodedata) => {
    //     const newData: TNodedataVoteInput = {
    //         nodedataId: el.id,
    //         value: -1,
    //     };

    //     fetch(HOST_API + '/nodedatavote', {
    //         method: 'POST',
    //         headers: {
    //             'Access-Control-Allow-Origin-Type': '*',
    //             Authorization: `Bearer ${tokenStore?.access_token}`,
    //         },
    //         body: JSON.stringify(newData),
    //     })
    //         .then(r => r.json())
    //         .then((response: any) => {
    //             if (response.message && response?.code === 401) {
    //                 console.log('OnDislike: ', response);
    //             } else if (response.code) {
    //                 throw response;
    //             }

    //             // if ((response.id || response._id) && nodeStore) {
    //             //     // nodeStore.data.push(response);
    //             //     onGetNode(activeLanguageFromStore?.code || 'en', {lat: nodeStore.lat, lon: nodeStore.lon})
    //             //         .then(r => {
    //             //             if (r?.message && r?.code === 401) {
    //             //                 console.log('401 marker');
    //             //             }

    //             //             dispatch(setActiveNode(r.data.node));
    //             //         })
    //             //         .catch(e => {
    //             //             throw e;
    //             //         });
    //             // }

    //             // fetchNodedatas();
    //         })
    //         .catch(e => {
    //             console.log('error:', e);

    //             Alert.alert('Error', e.message, [{text: 'OK', onPress: () => {}}]);
    //         });
    // };

    const ref = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '96%'], []);
    const closeSheet = () => {
        // onClose && onClose();
        navigation && navigation.goBack();
    };
    const activeIndex = React.useRef(0);

    return (
        <UIBottomSheetScrollView
            ref={ref}
            onClose={() => {
                closeSheet();
            }}
            onAnimate={(from, to) => {
                activeIndex.current = to;
            }}
            index={activeIndex.current}
            snapPoints={snapPoints}
            enablePanDownToClose={true}>
            {!isLoading ? (
                <View tw="bg-s-100 dark:bg-s-950 flex-1 p-4">
                    <View tw="flex flex-row">
                        <View tw="pr-4">
                            {tag.props?.icon && (
                                <SIcon path={tag.props.icon} tw="text-s-800 dark:text-s-300" size={70} />
                            )}
                        </View>
                        <View tw="flex-auto">
                            <Text tw="text-2xl leading-6 font-bold text-black dark:text-s-300">{tag?.title}</Text>
                            <Text tw="mt-1 text-base leading-5 text-black dark:text-s-400">{tag?.description}</Text>
                        </View>
                    </View>
                    {nodedataList.length ? (
                        nodedataList.map((el, index) => (
                            <View key={index.toString()} tw="mt-3 bg-white dark:bg-s-900 p-2 rounded-md">
                                <View tw="flex">
                                    <Text tw="text-xl text-black dark:text-white">
                                        {/* {JSON.stringify(tag)} */}
                                        {el?.tag?.title} -{' '}
                                        {el.value === 'yes'
                                            ? t('general:tagoptYes')
                                            : el?.tagopt?.title
                                            ? el?.tagopt?.title
                                            : el.value}
                                        ?
                                    </Text>
                                    <View tw="py-2">
                                        {el?.user && (
                                            <View>
                                                <SUser user={el.user} />
                                            </View>
                                        )}
                                        {el?.updatedAt && (
                                            <View tw="flex-auto">
                                                <Text tw="text-xs text-left text-s-500">
                                                    {/* {t('general:added')}: {dayjs(el?.createdAt).fromNow()} */}
                                                    {t('general:updated')}: {dayjs(el?.updatedAt).fromNow()}
                                                </Text>
                                                {/* <Text tw="text-xs text-right text-s-500">
                                            </Text> */}
                                            </View>
                                        )}
                                    </View>
                                    {el?.votes && (
                                        <View tw="flex flex-row space-x-2 pt-1 items-center">
                                            <UIButton
                                                type="default"
                                                disabled={el.localLikeValue === 1}
                                                twClass="py-2"
                                                onPress={() => onLike(el, 1)}>
                                                <View tw="flex flex-row items-center">
                                                    <SIcon
                                                        path={
                                                            // el.votes.find(x => x.userId === userStore?.id && x.value > 0)
                                                            el.localLikeValue > 0 ? iHandThumbsUpFill : iHandThumbsUp
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
                                            {/* <TouchableOpacity
                                                activeOpacity={0.5}
                                                disabled={el.localLikeValue === 1}
                                                tw="flex-auto p-2 flex flex-row items-center rounded-md bg-s-200 dark:bg-s-700"
                                                onPress={() => onLike(el, 1)}>
                                                <SIcon
                                                    path={
                                                        // el.votes.find(x => x.userId === userStore?.id && x.value > 0)
                                                        el.localLikeValue > 0 ? iHandThumbsUpFill : iHandThumbsUp
                                                    }
                                                    tw={`${
                                                        el.localLikeValue > 0
                                                            ? 'text-green-600 dark:text-green-300'
                                                            : 'text-s-800 dark:text-s-300'
                                                    }`}
                                                    size={25}
                                                />
                                                <Text tw="p-2 text-s-800 dark:text-s-300">{t('general:isTrue')}</Text>
                                                {el.like > 0 && (
                                                    <Text tw="bg-green-500 text-white px-2 py-1 leading-4 rounded-full">
                                                        {el.like}
                                                    </Text>
                                                )}
                                            </TouchableOpacity> */}
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
                                            {/* <TouchableOpacity
                                                activeOpacity={0.5}
                                                disabled={el.localLikeValue === -1}
                                                tw="flex-auto p-2 flex flex-row items-center rounded-md bg-s-200 dark:bg-s-700"
                                                onPress={() => onLike(el, -1)}>
                                                <SIcon
                                                    path={
                                                        // el.votes.find(x => x.userId === userStore?.id && x.value < 0)
                                                        el.localLikeValue < 0 ? iHandThumbsDownFill : iHandThumbsDown
                                                    }
                                                    tw={`${
                                                        el.localLikeValue < 0
                                                            ? 'text-red-500 dark:text-red-300'
                                                            : 'text-s-800 dark:text-s-300'
                                                    }`}
                                                    size={25}
                                                />
                                                <Text tw="p-2 text-s-800 dark:text-s-300">{t('general:isFalse')}</Text>
                                                {el.dlike > 0 && (
                                                    <Text tw="bg-red-500 text-white px-2 py-1 leading-4 rounded-full">
                                                        {el.dlike}
                                                    </Text>
                                                )}
                                            </TouchableOpacity> */}
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View>
                            <Text>no info</Text>
                        </View>
                    )}
                    <View tw="pt-6">
                        <Text tw="text-s-500">{t('general:historyTags')}</Text>
                    </View>
                </View>
            ) : (
                <View tw="pt-6">
                    <View tw="flex flex-row px-6">
                        <View tw="w-24">
                            <SSkeleton classString="w-12 h-24 mr-4" />
                        </View>
                        <View tw="flex-auto">
                            <SSkeleton classString="h-4" />
                            <SSkeleton classString="h-4 mt-2" width={'60%'} />
                            <SSkeleton classString="h-4 mt-2" width={'30%'} />
                            <SSkeleton classString="h-4 mt-2" width={'80%'} />
                        </View>
                    </View>
                    <View tw="px-6">
                        <SSkeleton classString="h-24 mt-2" />
                    </View>
                    <View tw="px-6">
                        <SSkeleton classString="h-24 mt-2" />
                    </View>
                    <View tw="px-6">
                        <SSkeleton classString="h-24 mt-2" />
                    </View>
                </View>
            )}
        </UIBottomSheetScrollView>
    );
};

export default NodedataScreen;
