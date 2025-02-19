import {hostAPI} from '~utils/global';

import {useFetchWithAuth} from './useFetchWithAuth';
import {TNodeSchema} from '~schema/NodeSchema';
import {useAppSelector} from '~store/hooks';
import {INodedata, INodedataVote, activeLanguage, user} from '~store/appSlice';
import {useEffect, useState} from 'react';
import {LikeSchema, TLikeSchema} from '~schema/LikeSchema';
import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';

export interface IUseNodeDataProps {
    localNode: TNodeSchema | null;
    tagId?: string;
}

export const useNodedata = (props: IUseNodeDataProps) => {
    const {localNode, tagId} = props;

    const realm = useRealm();

    const likes = useQuery(LikeSchema, items => {
        return items;
    });

    const userFromStore = useAppSelector(user);

    const {onFetchWithAuth} = useFetchWithAuth();

    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [nodeData, setNodeData] = useState<INodedata[]>([]);

    useEffect(() => {
        let ignore = false;
        const onGetNodedata = async () => {
            try {
                await onFetchWithAuth(
                    hostAPI +
                        '/gql/query?' +
                        new URLSearchParams({
                            lang: activeLanguageFromStore?.code || 'en',
                        }),
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
                    query findNodedatas($limit:Int, $skip:Int, $nodeId:String, $tagId: String) {
                        nodedatas(
                            skip:$skip,
                            limit:$limit,
                            input: {
                                nodeId: $nodeId, 
                                tagId: $tagId
                                }
                            ) {
                            limit
                            skip
                            total
                            data {
                                id
                                userId
                                nodeId
                                tagId
                                tagoptId
                                value
                                like
                                dlike
                                createdAt
                                updatedAt
                                tag {
                                    id
                                    key
                                    title
                                    description
                                    props
                                }
                                tagopt {
                                    id
                                    title
                                    description
                                    value
                                }
                                votes {
                                    id
                                    userId
                                    nodedataId
                                    value
                                    updatedAt
                                    user {
                                        id
                                        lang
                                        name
                                        login
                                        lastTime
                                        online
                                        userStat {
                                            node
                                            nodeLike
                                            nodeDLike
                                            nodeAuthorLike
                                            nodeAuthorDLike
                                            nodedata
                                            nodedataLike
                                            nodedataDLike
                                            nodedataAuthorLike
                                            nodedataAuthorDLike
                                            review
                                        }
                                        images {
                                            id
                                            service
                                            serviceId
                                            title
                                            userId
                                            path
                                            dir
                                            ext
                                        }
                                    }
                                }
                                user {
                                    id
                                    lang
                                    name
                                    login
                                    lastTime
                                    online
                                    userStat {
                                        node
                                        nodeLike
                                        nodeDLike
                                        nodeAuthorLike
                                        nodeAuthorDLike
                                        nodedata
                                        nodedataLike
                                        nodedataDLike
                                        nodedataAuthorLike
                                        nodedataAuthorDLike
                                        review
                                    }
                                    images {
                                        id
                                        service
                                        serviceId
                                        title
                                        userId
                                        path
                                        dir
                                        ext
                                    }
                                }
                            }
                        }
                    }
                        `,
                            variables: {
                                limit: 10,
                                skip: 0,
                                nodeId: localNode?.sid,
                                tagId: tagId,
                            },
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        if (!ignore && response?.data?.nodedatas) {
                            if (userFromStore?.id) {
                                const votes: TLikeSchema[] = [];
                                response?.data?.nodedatas?.data.forEach((nodedata: INodedata) => {
                                    const myVotes: TLikeSchema[] = nodedata.votes
                                        .filter(x => x.userId === userFromStore?.id)
                                        .map((y: INodedataVote) => {
                                            return {
                                                localNodedataId: '',
                                                serverNodedataId: y.nodedataId,
                                                value: y.value,
                                                nlid: localNode?._id?.toHexString(),
                                                ccode: localNode?.ccode,
                                                oldValue: y.value,
                                                isLocal: false,
                                            };
                                        });
                                    votes.push(...myVotes);
                                });

                                // console.log('votes=', votes);

                                if (votes.length > 0) {
                                    realm.write(() => {
                                        for (const vote of votes) {
                                            const existVote = likes.find(
                                                x => x.serverNodedataId === vote.serverNodedataId,
                                            );
                                            if (!existVote) {
                                                // console.log('existVote=', existVote);
                                                realm.create(LikeSchema, {
                                                    _id: new BSON.ObjectId(),
                                                    ...vote,
                                                });
                                            }
                                        }
                                        // for (const like of likes) {
                                        //     realm.delete(like);
                                        // }
                                    });
                                }
                            }
                            setNodeData(response?.data?.nodedatas?.data);
                        }
                        return response;
                    })
                    .catch(e => {
                        throw e;
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } catch (e) {
                // console.log('UseNodedata error: ', e?.message);
                setError(e?.message);
                // ToastAndroid.showWithGravity(e?.message, ToastAndroid.LONG, ToastAndroid.TOP);
            }
        };
        setTimeout(() => {
            onGetNodedata();
        }, 500);

        return () => {
            ignore = true;
        };
    }, []);

    return {
        isLoading,
        nodeData,
        error,
    };
};
