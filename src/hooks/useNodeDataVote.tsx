import {HOST_API} from '@env';

import {useFetchWithAuth} from './useFetchWithAuth';
import {useAppSelector} from '~store/hooks';
import {INodedataVote, TNodedataVoteInput, activeLanguage} from '~store/appSlice';
import {useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';

export interface INodeDataVoteProps {
    filter?: TNodedataVoteInput;
}

export const useNodeDataVote = (props: INodeDataVoteProps) => {
    const {filter} = props;

    const {onFetchWithAuth} = useFetchWithAuth();

    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const [isLoading, setLoading] = useState(true);
    const [nodeDataVotes, setNodeDataVotes] = useState<INodedataVote[]>([]);

    useEffect(() => {
        let ignore = false;
        const onGetNodedata = async () => {
            try {
                await onFetchWithAuth(
                    HOST_API +
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
                                query findNodedatavotes($limit:Int, $skip:Int, $nodedataId:String, $nodedataUserId: String, $userId: String) {
                                    nodedatavotes(
                                        skip:$skip,
                                        limit:$limit,
                                        input: {
                                            userId: $userId, 
                                            nodedataUserId: $nodedataUserId,
                                            nodedataId: $nodedataId
                                            }
                                        ) {
                                        limit
                                        skip
                                        total
                                        data {
                                            id
                                            userId
                                            nodeId
                                            nodedataId
                                            nodedataUserId
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
                        if (!ignore && response?.data?.nodedatavotes) {
                            setNodeDataVotes(response?.data?.nodedatavotes?.data);
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
        nodeDataVotes,
    };
};
