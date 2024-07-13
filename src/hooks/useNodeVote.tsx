import {hostAPI} from '~utils/global';

import {useFetchWithAuth} from './useFetchWithAuth';
import {useAppSelector} from '~store/hooks';
import {INodeVote, TNodeVoteInput, activeLanguage} from '~store/appSlice';
import {useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';

export interface INodeDataVoteProps {
    filter?: TNodeVoteInput;
}

export const useNodeVote = (props: INodeDataVoteProps) => {
    const {filter} = props;

    const {onFetchWithAuth} = useFetchWithAuth();

    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [nodeVotes, setNodeVotes] = useState<INodeVote[]>([]);

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
                                query findNodevotes($limit:Int, $skip:Int, $nodeId:String, $nodeUserId: String, $userId: String) {
                                    nodevotes(
                                        skip:$skip,
                                        limit:$limit,
                                        input: {
                                            userId: $userId, 
                                            nodeUserId: $nodeUserId,
                                            nodeId: $nodeId
                                            }
                                        ) {
                                        limit
                                        skip
                                        total
                                        data {
                                            id
                                            userId
                                            nodeId
                                            nodeUserId
                                            value
                                            createdAt
                                            updatedAt
                                            user {
                                                id
                                                lang
                                                name
                                                login
                                                # lastTime
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
                                            owner {
                                                id
                                                lang
                                                name
                                                login
                                                # lastTime
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
                                ...filter,
                            },
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        if (!ignore && response?.data?.nodevotes) {
                            setNodeVotes(response?.data?.nodevotes?.data);
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
                ToastAndroid.showWithGravity(e?.message, ToastAndroid.LONG, ToastAndroid.TOP);
            }
        };

        onGetNodedata();

        return () => {
            ignore = true;
        };
    }, []);

    return {
        isLoading,
        nodeVotes,
        error,
    };
};
