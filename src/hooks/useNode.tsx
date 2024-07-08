import React, {useState} from 'react';
import {HOST_API} from '@env';

import {useFetchWithAuth} from './useFetchWithAuth';
import {useAppSelector} from '~store/hooks';
import {INode, INodedata, activeLanguage} from '~store/appSlice';
import {NodeSchema} from '~schema/NodeSchema';
import {useObject, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {getObjectId} from '~utils/utils';
import {useTranslation} from 'react-i18next';

export interface IUseNodeProps {
    localNodeId: string;
}

const useNode = (props: IUseNodeProps) => {
    // console.log('UseNode---------------------->');

    const {t} = useTranslation();

    const {localNodeId} = props;

    const realm = useRealm();

    const {onFetchWithAuth} = useFetchWithAuth();

    const localNode = useObject(NodeSchema, new BSON.ObjectId(localNodeId));

    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serverNode, setNodeFromServer] = useState<INode | null>(null);
    const [isServerNodeRemove, setIsServerNodeRemove] = React.useState(false);

    React.useEffect(() => {
        let ignore = false;
        const onGetNodeInfo = async () => {
            try {
                // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
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
                        // node(id: "${featureFromStore?.id}") {
                        body: JSON.stringify({
                            query: `
                                query findNodeInfo($lat: Float, $lon: Float, $id: ID){
                                    node(lat: $lat, lon: $lon, id: $id) {
                                        id
                                        osmId
                                        type
                                        lat
                                        lon
                                        name
                                        userId
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
                                        images {
                                            id
                                            service
                                            serviceId
                                            title
                                            userId
                                            path
                                            dir
                                            ext
                                            createdAt
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
                                        props
                                        data{
                                            id
                                            nodeId
                                            tagId
                                            tagoptId
                                            value
                                            title
                                            description
                                            like
                                            dlike
                                            audit {
                                                id
                                                nodedataId
                                                value
                                                props
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
                                            tag {
                                                id
                                                key
                                                title
                                                description
                                                options {
                                                    id
                                                }
                                            }
                                            tagopt {
                                                id
                                                title
                                                description
                                                value
                                            }
                                            createdAt
                                        }
                                        reviewsInfo {
                                            count
                                            value
                                            ratings
                                        }
                                        address {
                                            id
                                            userId
                                            osmId
                                            dAddress
                                            address
                                            props
                                        }
                                        audits {
                                            message
                                            status
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
                                        createdAt
                                    }
                                }
                                `,
                            variables: {
                                // lat: localNode?.lat,
                                // lon: localNode?.lon,
                                id: localNode?.sid,
                            },
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        if (!ignore) {
                            // console.log('onGetNodeInfo: ', response, '========>', localNode);

                            const responseNode = response.data.node;
                            if (!responseNode) {
                                // dispatch(setActiveNode(null));
                                setNodeFromServer(null);
                                setIsServerNodeRemove(true);
                                setTimeout(() => {
                                    setLoading(false);
                                }, 300);
                                return;
                            }

                            const nodeDataFromServer = responseNode.data.map((x: INodedata) => {
                                return {
                                    sid: x.id,
                                    tagId: x.tagId,
                                    tagoptId: getObjectId(x.tagoptId),
                                    value: x.value,
                                };
                            });
                            //console.log('nodeDataFromServer=', nodeDataFromServer);

                            // const maps = new Map(nodeDataFromServer.map((s: INodedata) => [s.tagId, s]));
                            if (localNode) {
                                const newData = nodeDataFromServer;
                                // .concat(
                                //     JSON.parse(JSON.stringify(localNode.data)).filter(
                                //         (x: NodeDataSchema) => !maps.get(x.tagId),
                                //     ),
                                // );
                                realm.write(() => {
                                    //console.log('newData=', newData.length);
                                    localNode.data = [...newData];
                                    localNode.createdAt = responseNode.createdAt;
                                    if (responseNode.userId && localNode?.userId === '') {
                                        localNode.userId = responseNode.userId;
                                    }
                                    // realm.create(
                                    //     'NodeSchema',
                                    //     {
                                    //         ...localNode,
                                    //         data: [...newData],
                                    //         _id: localNode?._id,
                                    //         createdAt: responseNode.createdAt,
                                    //         userId: responseNode.userId,
                                    //     },
                                    //     UpdateMode.Modified,
                                    // );
                                });
                            }
                            //console.log('onGetNodeInfo: ', localNode);

                            setNodeFromServer(responseNode);
                            setTimeout(() => {
                                setLoading(false);
                            }, 100);
                            // console.log('activeMarker=', response);
                            // dispatch(setActiveNode(responseNode));
                        }
                    })
                    .catch(e => {
                        setTimeout(() => {
                            setLoading(false);
                        }, 300);
                        throw e;
                    });
            } catch (e: any) {
                // ToastAndroid.showWithGravity(
                //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
                //     ToastAndroid.LONG,
                //     ToastAndroid.TOP,
                // );
                setError(e.message);
                // console.log('UseNode error: ', e?.message);
            }
        };

        if (localNode?.lat && localNode?.lon && !ignore) {
            // setTimeout(onGetNodeInfo, 100);
            onGetNodeInfo();
        }

        return () => {
            ignore = true;
        };
    }, []);

    return {
        isLoading,
        serverNode,
        isServerNodeRemove,
        error,
    };
};

export default useNode;
