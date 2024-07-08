import {Text, View} from 'react-native';
import React, {useMemo} from 'react';

import {INode, INodedata} from '~store/appSlice';

import SIcon from '~components/ui/SIcon';
import {iHandThumbsDown, iHandThumbsUp, iWarningCircle} from '~utils/icons';
import {SSkeleton} from '~components/ui/SSkeleton';
import {useQuery} from '@realm/react';
import {LikeSchema} from '~schema/LikeSchema';
import {formatNum} from '~utils/utils';

export interface IWidgetNodeTagsListVoteProps {
    tagId: string;
    serverNode: INode;
    isLoading: boolean;
    nodedatas: INodedata[];
}
const WidgetNodeTagsListVote = (props: IWidgetNodeTagsListVoteProps) => {
    const {serverNode, nodedatas, isLoading} = props;
    // const tagsFromStore = useAppSelector(tags);
    // const activeNodeFromStore = useAppSelector(activeNode);
    // console.log('Render WidgetNodeTagsLineVote: ');

    // const tagData = useMemo(() => {
    //     // let result: [string, INodedata[]][] = [];
    //     // const all: {[key: string]: INodedata[]} = {};

    //     const result = serverNode?.data?.filter(x => x.tagId === tagId) || [];
    //     return result;
    // }, [serverNode?.data, tagId]);

    const localLikesDB = useQuery(LikeSchema, likes => {
        return likes;
    });

    const idsServerNodedata = useMemo(() => nodedatas.map(x => x.id).filter(x => !!x), [nodedatas]);
    const idsLocalNodedate = useMemo(() => nodedatas.map(x => x?.id).filter(x => !!x), [nodedatas]);

    const localLikes = useMemo(() => {
        // console.log('idsLocalNode==========================>', idsServerNodedata, idsLocalNodedate);

        return localLikesDB.filter(
            x =>
                (x.isLocal || !serverNode) &&
                (idsLocalNodedate.includes(x?.localNodedataId) || idsServerNodedata.includes(x?.serverNodedataId)),
        );
    }, [idsLocalNodedate, idsServerNodedata, localLikesDB, serverNode]);

    // console.log('localLikes=', localLikes);

    const likesValue = useMemo(() => {
        const result = {
            like: nodedatas.reduce((ac, el) => ac + (el.like || 0), 0),
            dlike: nodedatas.reduce((ac, el) => ac + (el.dlike || 0), 0),
        };
        // let likes = nodedatas.reduce((ac, el) => ac + el.like, 0);
        // let likesLocal = localLikes.reduce((ac, el) => ac + (el.value > 0 ? el.value : 0), 0);
        localLikes.forEach(el => {
            if (el.oldValue !== 0) {
                // change exist vote
                if (serverNode) {
                    if (el.oldValue > 0 && el.value < 0) {
                        // like -> dlike
                        result.like -= 1;
                        result.dlike += 1;
                    } else if (el.oldValue < 0 && el.value > 0) {
                        // dlike -> like
                        result.like += 1;
                        result.dlike -= 1;
                    }
                } else if (!serverNode) {
                    result.like += el.value > 0 ? 1 : 0;
                    result.dlike += el.value < 0 ? 1 : 0;
                }
            } else {
                // add new vote

                if (el.value > 0) {
                    result.like += 1;
                } else {
                    result.dlike += 1;
                }
                // console.log('New vote result=', result);
            }
        });

        return result;
    }, [localLikes, nodedatas, serverNode]);

    // const dlikesValue = useMemo(() => {
    //     let dlikes = nodedatas.reduce((ac, el) => ac + el.dlike, 0);
    //     let dlikesLocal = localLikes.reduce((ac, el) => ac + (el.value < 0 ? -el.value : 0), 0);

    //     return dlikes + dlikesLocal;
    // }, [localLikes, nodedatas]);

    // console.log(
    //     'localLikes=>',
    //     localLikes,
    //     ' idsLocalNodedate=>',
    //     idsLocalNodedate,
    //     ' idsServerNodedata=>',
    //     idsServerNodedata,
    // );
    // console.log('nodedatas .length =', nodedatas.length);

    // const allNodedatas = useQuery(NodeDataSchema, nodedatas => {
    //     return nodedatas;
    // });

    // const nodedataList = useMemo(() => {
    //     const result: INodedata[] = tagData;

    //     const resultNodedata = result.map(x => {
    //         const localVotes = localLikes.filter(
    //             like =>
    //                 (x?.id !== ''
    //                     ? like.localNodedataId === x.localNodedataId
    //                     : like.serverNodedataId === x.serverNodedataId) && like.isLocal === true,
    //         );
    //         const currentVote = localLikes.find(like =>
    //             x?.localNodedataId !== ''
    //                 ? like.localNodedataId === x.localNodedataId
    //                 : like.serverNodedataId === x.serverNodedataId,
    //         )?.value;
    //         const localLike = localVotes.filter(z => z.value > 0).length;
    //         const localDLike = localVotes.filter(z => z.value < 0).length;
    //         const localLikeOldValue = localVotes[0]?.oldValue || 0;

    //         // console.log('localVotes=', localVotes, localVotes.length);
    //         // console.log('local likes=', localLike, localDLike);
    //         // console.log('likes=', x.like, x.dlike, typeof x.like === 'number');

    //         return {
    //             ...x,
    //             tag: x.tag || tag,
    //             tagopt: x.tagopt || tag.options.find(y => y.id === x.tagoptId),
    //             votes: x.votes || localVotes,
    //             like:
    //                 typeof x.like === 'number'
    //                     ? Math.max(
    //                           0,
    //                           x.like -
    //                               (localLikeOldValue > 0 && localDLike
    //                                   ? 1
    //                                   : localLikeOldValue < 0 && localLike
    //                                   ? -1
    //                                   : 0),
    //                       )
    //                     : localLike,
    //             dlike:
    //                 typeof x.dlike === 'number'
    //                     ? Math.max(
    //                           0,
    //                           x.dlike -
    //                               (localLikeOldValue > 0 && localDLike
    //                                   ? -1
    //                                   : localLikeOldValue < 0 && localLike
    //                                   ? 1
    //                                   : 0),
    //                       )
    //                     : localDLike,
    //             localLikeValue: currentVote,
    //         };
    //     });

    //     return resultNodedata;
    // }, [nodeData, localNodedatas, newNodedatas, localLikes, tag]);

    // console.log('tagData/nodedatas=', nodedatas, '  ------------->   ', tagData);

    return (
        <View>
            {!isLoading ? (
                <View>
                    {/* <Text tw="text-black">{JSON.stringify(likesValue)}</Text> */}
                    {/* {tagData.length > 5 ? (
                        <>
                            <Text tw="text-xs text-s-800">{t('general:more')}...</Text>
                        </>
                    ) : (
                    )} */}
                    <View tw="flex flex-row items-center justify-start">
                        <View tw="p-0.5 flex flex-row">
                            {likesValue.like > 0 && (
                                <>
                                    <SIcon path={iHandThumbsUp} tw="text-green-500" size={15} />
                                    <Text tw="pl-1 text-base leading-4 text-green-500 font-bold">
                                        +{formatNum(likesValue.like, 0)}
                                    </Text>
                                </>
                            )}
                        </View>
                        <View tw="p-0.5 flex flex-row items-center justify-center">
                            {likesValue.dlike > 0 && (
                                <>
                                    <SIcon path={iHandThumbsDown} tw="text-red-500" size={15} />
                                    <Text tw="pl-1 text-base leading-4 text-red-500 dark:text-red-400 font-bold">
                                        -{formatNum(likesValue.dlike, 0)}
                                    </Text>
                                </>
                            )}
                            {likesValue.dlike > 0 && (
                                <SIcon
                                    path={iWarningCircle}
                                    size={18}
                                    tw="ml-0.5 -mt-1 text-red-500 dark:text-red-300"
                                />
                            )}
                        </View>
                        {/* <Text tw="flex-auto text-xs text-white">
                            {el
                                .map(tagopt =>
                                    tagopt.value === 'yes'
                                        ? t('general:tagoptYes')
                                        : tagopt.tagopt?.title
                                        ? tagopt.tagopt?.title
                                        : tagopt.value,
                                )
                                .join(', ')}
                        </Text> */}
                    </View>
                </View>
            ) : (
                <>
                    <SSkeleton classString="h-4 rounded-md" text="" textClassString="text-xs" />
                </>
            )}
        </View>
    );
};

export default WidgetNodeTagsListVote;
