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

    // const onGetNode = React.useCallback(
    //     async () => (lang: string, markerData: any) => {
    //         // console.log('onGetNode:::', markerData);
    //         return await onFetchWithAuth(
    //             HOST_API +
    //                 '/gql/query?' +
    //                 new URLSearchParams({
    //                     lang: lang || 'en',
    //                 }),
    //             {
    //                 method: 'POST',
    //                 headers: {
    //                     Accept: 'application/json',
    //                     'Content-Type': 'application/json',
    //                 },
    //                 // node(id: "${featureFromStore?.id}") {
    //                 body: JSON.stringify({
    //                     query: `
    //                             query findNodeInfo($lat: Float, $lon:Float) {
    //                             node(lat: $lat, lon: $lon) {
    //                                 id
    //                                 osmId
    //                                 type
    //                                 lat
    //                                 lon
    //                                 ccode
    //                                 props
    //                                 name
    //                                 user {
    //                                     id
    //                                     lang
    //                                     name
    //                                     login
    //                                     lastTime
    //                                     online
    //                                     images {
    //                                         id
    //                                         service
    //                                         serviceId
    //                                         title
    //                                         userId
    //                                         path
    //                                         dir
    //                                         ext
    //                                     }
    //                                 }
    //                                 images {
    //                                     id
    //                                     service
    //                                     serviceId
    //                                     title
    //                                     userId
    //                                     path
    //                                     dir
    //                                     ext
    //                                     createdAt
    //                                     user {
    //                                         id
    //                                         lang
    //                                         name
    //                                         login
    //                                         lastTime
    //                                         online
    //                                         images {
    //                                             id
    //                                             service
    //                                             serviceId
    //                                             title
    //                                             userId
    //                                             path
    //                                             dir
    //                                             ext
    //                                         }
    //                                     }
    //                                 }
    //                                 createdAt
    //                                 updatedAt
    //                                 data{
    //                                     id
    //                                     value
    //                                     status
    //                                     like
    //                                     dlike
    //                                     tagId
    //                                     tagoptId
    //                                     nodeId
    //                                     user {
    //                                         id
    //                                         lang
    //                                         name
    //                                         login
    //                                         lastTime
    //                                         online
    //                                         images {
    //                                             id
    //                                             service
    //                                             serviceId
    //                                             title
    //                                             userId
    //                                             path
    //                                             dir
    //                                             ext
    //                                         }
    //                                     }
    //                                     tag {
    //                                         id
    //                                         key
    //                                         title
    //                                         description
    //                                         props
    //                                     }
    //                                     tagopt {
    //                                         id
    //                                         title
    //                                         description
    //                                         value
    //                                     }
    //                                     createdAt
    //                                     updatedAt
    //                                 }
    //                                 reviewsInfo {
    //                                 count
    //                                 value
    //                                 ratings
    //                                 }
    //                                 address {
    //                                 dAddress
    //                                 }
    //                             }
    //                             }
    //                         `,
    //                     variables: {
    //                         lat: markerData?.lat,
    //                         lon: markerData?.lon,
    //                     },
    //                 }),
    //             },
    //         )
    //             .then(r => r.json())
    //             .then(response => {
    //                 // console.log('response: ', response);

    //                 return response;
    //             })
    //             .catch(e => {
    //                 throw e;
    //             });
    //     },
    //     [],
    // );

    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const [isLoading, setLoading] = useState(true);
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
                                    query findNodeInfo($lat: Float, $lon:Float, $id: ID) {
                                    node(lat: $lat, lon: $lon, id: $id) {
                                        id
                                        osmId
                                        type
                                        lat
                                        lon
                                        ccode
                                        props
                                        name
                                        user {
                                            id
                                            lang
                                            name
                                            login
                                            lastTime
                                            online
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
                                        updatedAt
                                        data{
                                            id
                                            value
                                            status
                                            like
                                            dlike
                                            tagId
                                            tagoptId
                                            nodeId
                                            user {
                                                id
                                                lang
                                                name
                                                login
                                                lastTime
                                                online
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
                                                props
                                            }
                                            tagopt {
                                                id
                                                title
                                                description
                                                value
                                            }
                                            createdAt
                                            updatedAt
                                        }
                                        reviewsInfo {
                                            count
                                            value
                                            ratings
                                        }
                                        audits {
                                            message
                                            status
                                            userId
                                            user {
                                                id
                                                lang
                                                name
                                                login
                                                lastTime
                                                online
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
                                        address {
                                            dAddress
                                        }
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
                                setLoading(false);
                                setIsServerNodeRemove(true);
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
                                    localNode.data = newData;
                                    localNode.createdAt = responseNode.createdAt;
                                    if (responseNode.userId && localNode?.userId === '') {
                                        localNode.userId = responseNode.userId;
                                    }
                                });
                            }
                            //console.log('onGetNodeInfo: ', localNode);

                            setNodeFromServer(responseNode);
                            setLoading(false);
                            // console.log('activeMarker=', response);
                            // dispatch(setActiveNode(responseNode));
                        }
                    })
                    .catch(e => {
                        setLoading(false);
                        throw e;
                    });
            } catch (e: any) {
                // ToastAndroid.showWithGravity(
                //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
                //     ToastAndroid.LONG,
                //     ToastAndroid.TOP,
                // );
                console.log('UseNode error: ', e?.message);
            }
        };

        if (localNode?.lat && localNode?.lon) {
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
    };
};

export default useNode;
