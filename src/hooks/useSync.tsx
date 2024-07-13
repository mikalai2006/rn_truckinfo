import {hostAPI} from '~utils/global';

import {useQuery, useRealm} from '@realm/react';
import {BSON, UpdateMode} from 'realm';
import {NodeSchema, TNodeSchema} from '~schema/NodeSchema';
import {INodedata, TReviewInput} from '~store/appSlice';
import {ImageSchema} from '~schema/ImageSchema';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import {LikeSchema} from '~schema/LikeSchema';
import {useFetchWithAuth} from './useFetchWithAuth';
import {ReviewSchema} from '~schema/ReviewSchema';
import {NodeAuditSchema} from '~schema/NodeAuditSchema';
import {PointSchema} from '~schema/PointSchema';

export const useSync = () => {
    // console.log('useSync----------------------');

    // const navigation = useNavigation();
    // const dispatch = useAppDispatch();
    // const tokenFromStore = useAppSelector(tokens);

    const realm = useRealm();

    const nodesList = useQuery(
        NodeSchema,
        nodes => {
            const result = nodes.filtered('sid == $0', '');

            return result;
        },
        [],
    );

    const {onFetchWithAuth} = useFetchWithAuth();

    // const nodedatasList = useQuery(
    //     NodeDataSchema,
    //     items => {
    //         const result = items.filtered('sid == $0', '');

    //         return result;
    //     },
    //     [],
    // );

    // const delNodes = useQuery(NodeSchema, nodes => {
    //     return nodes.filtered('_sid == $0', '');
    // });
    const allNodes = useQuery(NodeSchema);
    const allNodedatas = useQuery(NodeDataSchema);
    const likes = useQuery(LikeSchema);
    const nodeAudits = useQuery(NodeAuditSchema);
    const images = useQuery(ImageSchema);
    const reviews = useQuery(ReviewSchema);
    const points = useQuery(PointSchema);
    const deleteImage = (id: BSON.ObjectId) => {
        const removedImage = images.filtered('_id == $0', id);
        realm.write(() => {
            realm.delete(removedImage);
        });
    };
    // const nodesWithLocalNodedata = useQuery(NodeSchema, nodes => {
    //     return nodes.filtered('data.isLocal == $0', true);
    // });
    // const deleteNodes = () => {
    //     realm.write(() => {
    //         realm.delete(delNodes);
    //     });
    // };

    const onSync = async () => {
        try {
            // const timeWork = window.performance.now();

            const bodyList = nodesList.map(x => {
                return {
                    lat: x.lat,
                    lon: x.lon,
                    type: x.type,
                    tags: [],
                    // data: x.data.map(item => {
                    //     return {
                    //         tagId: item.tagId,
                    //         tagoptId: item.tagoptId,
                    //         data: {
                    //             value: item.value,
                    //         },
                    //     };
                    // }),
                };
            });

            // const listOldLocaleNodes = nodesList.map(x => {
            //     return {
            //         _oldId: x._id.toHexString(),
            //         _sidId: '',
            //     };
            // });
            // console.log('listOldLocaleNodes: ', listOldLocaleNodes);

            // Sync nodes with data nodes
            if (bodyList.length > 0) {
                await onFetchWithAuth(hostAPI + '/node/list', {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin-Type': '*',
                    },
                    body: JSON.stringify(bodyList),
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res.message && res?.code === 401) {
                            console.log('401 onSync Node');
                            // dispatch(setTokenAccess({access_token: ''}));
                            return;
                        }
                        const listCreatedNodes: TNodeSchema[] = [];
                        // const listCreatedNodedatas = [];
                        for (let i = 0; i < res.length; i++) {
                            const item = res[i];
                            // const data = item.data.map(x => {
                            //     return {
                            //         sid: x._id,
                            //         nodeSId: item._id,
                            //         tagoptId: x.tagoptId,
                            //         tagId: x.tagId,
                            //         value: x.data.value,
                            //         isLocal: false,
                            //     };
                            // });
                            // listCreatedNodedatas.push([...data]);
                            // const localNode = nodesList.find(x => x.lat === item.lat )

                            listCreatedNodes.push({
                                _id: nodesList[i]._id, //new BSON.ObjectId(),
                                sid: item._id,
                                name: item.name,
                                type: item.type,
                                lat: item.lat,
                                lon: item.lon,
                                // userId: item.userId,
                                ccode: item.ccode,
                                // data,
                                // createdAt: item.createdAt,
                            });
                        }

                        // console.log('Inserted nodes: ', listCreatedNodes);

                        for (let i = 0, total = listCreatedNodes.length; i < total; i++) {
                            realm.write(() => {
                                const currentCreatedNode = listCreatedNodes[i];
                                const existLocalNode = allNodes.filtered('sid == $0', currentCreatedNode.sid);
                                // listOldLocaleNodes[i]._sidId = listCreatedNodes[i].sid;
                                // console.log('currentCreatedNode: ', currentCreatedNode);
                                // console.log('existLocalNode: ', existLocalNode);

                                const currentCreatedNodeData = allNodedatas.filtered(
                                    'nlid == $0',
                                    currentCreatedNode._id?.toHexString(),
                                );
                                const currentCreatedNodeReview = reviews.filtered(
                                    'nlid == $0',
                                    currentCreatedNode._id?.toHexString(),
                                );
                                const currentCreatedNodeLikes = likes.filtered(
                                    'nlid == $0',
                                    currentCreatedNode._id?.toHexString(),
                                );
                                const currentCreatedNodeImages = images.filtered(
                                    'nlid == $0',
                                    currentCreatedNode._id?.toHexString(),
                                );

                                if (existLocalNode.length === 0) {
                                    realm.create('NodeSchema', {...currentCreatedNode}, UpdateMode.Modified);

                                    const nodedatas = currentCreatedNodeData.map(x => {
                                        return {
                                            ...x,
                                            nsid: currentCreatedNode.sid,
                                        };
                                    });
                                    for (let j = 0; j < nodedatas.length; j++) {
                                        realm.create('NodeDataSchema', {...nodedatas[j]}, UpdateMode.Modified);
                                    }

                                    const reviewsForUpdateNodeId = currentCreatedNodeReview.map(x => {
                                        return {
                                            ...x,
                                            nodeId: currentCreatedNode.sid,
                                        };
                                    });
                                    for (let j = 0; j < reviewsForUpdateNodeId.length; j++) {
                                        realm.create(
                                            'ReviewSchema',
                                            {...reviewsForUpdateNodeId[j]},
                                            UpdateMode.Modified,
                                        );
                                    }

                                    const likesForUpdateNodeId = currentCreatedNodeLikes.map(x => {
                                        return {
                                            ...x,
                                            ccode: currentCreatedNode.ccode,
                                        };
                                    });
                                    for (let j = 0; j < likesForUpdateNodeId.length; j++) {
                                        realm.create('LikeSchema', {...likesForUpdateNodeId[j]}, UpdateMode.Modified);
                                    }
                                } else {
                                    const localNodeNeedRemove = allNodes.filtered('_id == $0', currentCreatedNode._id);
                                    realm.delete(localNodeNeedRemove);

                                    const nodedatas = currentCreatedNodeData.map(x => {
                                        return {
                                            ...x,
                                            nlid: existLocalNode[0]._id.toHexString(),
                                            nsid: existLocalNode[0].sid,
                                        };
                                    });
                                    for (let j = 0; j < nodedatas.length; j++) {
                                        realm.create('NodeDataSchema', {...nodedatas[j]}, UpdateMode.Modified);
                                    }

                                    const reviewsForUpdateNodeId = currentCreatedNodeReview.map(x => {
                                        return {
                                            ...x,
                                            nlid: existLocalNode[0]._id.toHexString(),
                                            nodeId: existLocalNode[0].sid,
                                        };
                                    });
                                    for (let j = 0; j < reviewsForUpdateNodeId.length; j++) {
                                        realm.create(
                                            'ReviewSchema',
                                            {...reviewsForUpdateNodeId[j]},
                                            UpdateMode.Modified,
                                        );
                                    }

                                    const likesForUpdateNodeId = currentCreatedNodeLikes.map(x => {
                                        return {
                                            ...x,
                                            nlid: existLocalNode[0]._id.toHexString(),
                                            ccode: existLocalNode[0].ccode,
                                        };
                                    });
                                    for (let j = 0; j < likesForUpdateNodeId.length; j++) {
                                        realm.create('LikeSchema', {...likesForUpdateNodeId[j]}, UpdateMode.Modified);
                                    }

                                    const imagesForUpdateNodeId = currentCreatedNodeImages.map(x => {
                                        return {
                                            _id: x._id,
                                            nlid: existLocalNode[0]._id.toHexString(),
                                            // serviceId: existLocalNode[0].sid,
                                        };
                                    });
                                    for (let j = 0; j < imagesForUpdateNodeId.length; j++) {
                                        realm.create('ImageSchema', imagesForUpdateNodeId[j], UpdateMode.Modified);
                                    }
                                    // realm.delete(currentCreatedNodeData);
                                    // realm.delete(currentCreatedNodeReview);
                                    // realm.delete(currentCreatedNodeLikes);
                                }
                            });
                        }

                        // deleteNodes();

                        return res;
                    })
                    .catch(e => {
                        console.log('Sync nodes: ', e);
                        throw e;
                    });
            }

            // Sync node data
            const nodesWithLocalNodedata = allNodedatas.filtered('isLocal == $0', true);
            // console.log('nodesWithLocalNodedata=', nodesWithLocalNodedata);
            const newNodedata = nodesWithLocalNodedata.length
                ? nodesWithLocalNodedata.reduce((ac, el) => {
                      const newValue: any = ac;

                      //   for (const data of el.data) {
                      if (el.isLocal) {
                          newValue.push({
                              tagId: el.tagId,
                              tagoptId: el.tagoptId,
                              nodeId: el.nsid,
                              data: {
                                  value: el.value,
                              },
                              localId: el._id,
                          });
                      }
                      //   }

                      return newValue;
                  }, [])
                : [];

            if (newNodedata.length > 0) {
                // console.log('newNodedata:', newNodedata);
                await onFetchWithAuth(hostAPI + '/nodedata/list', {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin-Type': '*',
                    },
                    body: JSON.stringify(newNodedata),
                })
                    .then(res => res.json())
                    .then((res: INodedata[]) => {
                        if (res?.message && res?.code === 401) {
                            console.log('401 onSync Nodedata');
                            return;
                        }
                        const createdNodedataToServer = res.length
                            ? res.map(x => {
                                  return {
                                      //   lid: x.nodeId,
                                      tagId: x?.tagId,
                                      tagoptId: x?.tagoptId,
                                      sid: x?._id,
                                      nsid: x?.nodeId,
                                      value: x?.data.value,
                                      isLocal: false,
                                  };
                              })
                            : [];

                        // console.log('res=', res);

                        realm.write(() => {
                            if (createdNodedataToServer.length > 0) {
                                for (let i = 0; i < createdNodedataToServer.length; i++) {
                                    const nodedata = createdNodedataToServer[i];
                                    const currentNodedata = allNodedatas.filtered(
                                        '_id==$0 LIMIT(1)',
                                        newNodedata[i].localId,
                                    );
                                    if (nodedata.sid) {
                                        // set sid for nodedata
                                        if (currentNodedata.length > 0) {
                                            const elem = currentNodedata[0];
                                            // .data.find(
                                            //     x =>
                                            //         x.tagId === nodedata.tagId &&
                                            //         x.tagoptId === nodedata.tagoptId &&
                                            //         x.isLocal,
                                            // );
                                            if (elem) {
                                                elem.sid = nodedata.sid;
                                                elem.isLocal = false;
                                            }
                                            // console.log('elem=', elem);
                                        }
                                        // set sid for local likes
                                        const localLikesNodedata = likes.filtered(
                                            'localNodedataId == $0',
                                            newNodedata[i].localId?.toHexString(),
                                        );
                                        // console.log(
                                        //     'localLikesNodedata=',
                                        //     newNodedata[i].localId?.toHexString(),
                                        //     localLikesNodedata,
                                        // );

                                        localLikesNodedata.forEach((l, index) => {
                                            if (l.serverNodedataId === '') {
                                                l.serverNodedataId = nodedata.sid;
                                            }
                                        });
                                    } else if (newNodedata[i].localId) {
                                        const removeNodedataObject = allNodedatas.find(
                                            x => x._id.toHexString() === newNodedata[i].localId?.toHexString(),
                                        );
                                        removeNodedataObject && realm.delete(removeNodedataObject);
                                    }
                                }
                            }
                        });

                        return res;
                    })
                    .catch(e => {
                        console.log('Sync nodedata error: ', e);

                        throw e;
                    });
            }

            // realm.write(() => {
            //     realm.delete(likes);
            //     realm.delete(nodeAudits);
            // });

            // Sync likes
            const likesNeedSync = likes.filtered('isLocal == $0', true);
            if (likesNeedSync.length > 0) {
                const newLikes = likesNeedSync
                    .filter(x => !!x.serverNodedataId)
                    .map(x => {
                        return {
                            nodedataId: x.serverNodedataId,
                            value: x.value,
                        };
                    });
                // console.log('newLikes=', newLikes);
                await onFetchWithAuth(hostAPI + '/nodedatavote/list', {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin-Type': '*',
                    },
                    body: JSON.stringify(newLikes),
                })
                    .then(r => r.json())
                    .then(() => {
                        realm.write(() => {
                            for (const localLike of likesNeedSync) {
                                localLike.isLocal = false;
                                localLike.oldValue = localLike.value;
                            }
                        });
                    })
                    .catch(e => {
                        throw e;
                    });
            }

            // Sync reviews
            const reviewsNeedSync = reviews.filtered('isLocal == $0', true);
            if (reviewsNeedSync.length > 0) {
                const newReviews: TReviewInput[] = reviewsNeedSync.map(x => {
                    return {
                        nodeId: x.nodeId,
                        updatedAt: x.updatedAt,
                        rate: x.rate,
                        review: x.review,
                    };
                });
                // console.log('newReviews=', newReviews);
                await onFetchWithAuth(hostAPI + '/review/list', {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin-Type': '*',
                    },
                    body: JSON.stringify(newReviews),
                })
                    .then(r => r.json())
                    .then(() => {
                        realm.write(() => {
                            for (const localReview of reviewsNeedSync) {
                                localReview.isLocal = false;
                                localReview.oldRate = localReview.rate;
                            }
                        });
                    })
                    .catch(e => {
                        throw e;
                    });
            }

            // Sync images (only exist nodes)
            if (images.length > 0) {
                for (const imageItem of images) {
                    const data = new FormData();

                    for (let i = 0; i < imageItem.images.length; i++) {
                        data.append('images', {
                            name: imageItem.images[i].name,
                            type: imageItem.images[i].type,
                            uri: imageItem.images[i].uri,
                        });
                    }
                    data.append('service', imageItem.service);

                    let serviceId = imageItem.serviceId;
                    if (!serviceId) {
                        const localNodeForImage = allNodes.filtered('_id == $0', new BSON.ObjectId(imageItem.nlid));
                        // console.log('localNodeForImage', localNodeForImage);

                        if (localNodeForImage.length > 0) {
                            serviceId = localNodeForImage[0]?.sid;
                        }
                    }
                    if (serviceId) {
                        data.append('serviceId', serviceId);
                        // console.log('Load ', data, imageItem);
                        onFetchWithAuth(hostAPI + '/image', {
                            method: 'POST',
                            headers: {
                                'Access-Control-Allow-Origin-Type': '*',
                            },
                            body: data,
                        })
                            .then(res => res.json())
                            .then(response => {
                                // console.log('response', response);
                                if (response) {
                                    deleteImage(imageItem._id);
                                }
                            })
                            .catch(error => {
                                console.log('error', error);
                            });
                    } else {
                        console.log('not Load ', data, imageItem);
                        deleteImage(imageItem._id);
                    }
                }
            }

            // Sync node audits
            const nodeAuditsNeedLoad = nodeAudits.filtered('isLocal == $0', true);
            if (nodeAuditsNeedLoad.length > 0) {
                const auditsData = [];
                for (const item of nodeAuditsNeedLoad) {
                    auditsData.push({
                        nodeId: item.nodeId,
                        message: item.message,
                    });
                }

                if (auditsData.length > 0) {
                    onFetchWithAuth(hostAPI + '/node_audit/list', {
                        method: 'POST',
                        headers: {
                            'Access-Control-Allow-Origin-Type': '*',
                        },
                        body: JSON.stringify(auditsData),
                    })
                        .then(res => res.json())
                        .then(response => {
                            // console.log('response', response);
                            // if (response) {
                            // }
                            realm.write(() => {
                                realm.delete(nodeAuditsNeedLoad);
                                // for (const localReview of nodeAuditsNeedLoad) {
                                //     localReview.isLocal = false;
                                // }
                            });
                        })
                        .catch(error => {
                            console.log('error', error);
                        });
                }
            }
            // // check removed nodes.
            // realm.write(() => {
            //     for (const audit of nodeAudits) {
            //         const existNode = allNodes.filtered('_id == $0', new BSON.ObjectId(audit.nlid));
            //         if (!existNode) {
            //             realm.delete(audit);
            //         }
            //     }
            // });

            // Remove local nodedata
            const mayBeRemoveNodedatas = allNodedatas.filtered('isLocal == $0', false);
            const localLikes = likes.filtered('isLocal == $0', true);
            if (localLikes.length === 0) {
                realm.write(() => {
                    for (const nodedata of mayBeRemoveNodedatas) {
                        realm.delete(nodedata);
                    }
                });
            }
            // console.log('Time Complete sync: ', window.performance.now() - timeWork);

            // let timeSet = window.performance.now();
            // // clear likes not exist nodedata
            // // console.log('removeNodedataObject: ', removeNodedataObject);
            // //allNodes.reduce((ac, el) => ac.concat(el.data.map(x => x.sid)), []);
            // const bbb = allNodes.filtered('ANY data.@count != 0'); // x => !!x.data.length
            // console.log('bbb=', bbb.length);
            // console.log('Time Filter: ', window.performance.now() - timeSet);
            // timeSet = window.performance.now();

            // const allIdsNodedatas: string[] = bbb.reduce((ac, el) => {
            //     const idsNodedatas = el.data.map(d => d.sid);
            //     idsNodedatas.length && ac.push(...idsNodedatas);
            //     return ac;
            // }, []);
            // // for (let item of bbb) {
            // //     const idsNodedatas = item.data.map(d => d.sid);
            // //     item.data.length && allIdsNodedatas.push(...idsNodedatas);
            // // }
            // console.log('Time Create array: ', window.performance.now() - timeSet);
            // console.log('allIdsNodedatas.length=', allIdsNodedatas.length);
            // timeSet = window.performance.now();

            // const setIdsNodedatas = new Set(allIdsNodedatas);

            // const removeNodedataObjectLikes = likes.filter(x => !setIdsNodedatas.has(x.serverNodedataId));
            // // console.log('removeNodedataObjectLikes: ', removeNodedataObjectLikes.length, removeNodedataObjectLikes);

            // console.log('Create set and: ', window.performance.now() - timeSet);

            // realm.write(() => {
            //     realm.delete(removeNodedataObjectLikes);
            // });

            // Save user nodedata
            const needSaveTrackerPoints = points.filtered('isLocal == $0', true);
            const pointsBody = needSaveTrackerPoints.map(x => {
                return {
                    lat: x.lat,
                    lon: x.lon,
                    createdAt: x.createdAt,
                };
            });
            if (pointsBody.length > 0) {
                onFetchWithAuth(hostAPI + '/track/list', {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin-Type': '*',
                    },
                    body: JSON.stringify(pointsBody),
                })
                    .then(res => res.json())
                    .then(response => {
                        // console.log('response', response);
                        if (response) {
                            realm.write(() => {
                                for (const point of needSaveTrackerPoints) {
                                    point.isLocal = false;
                                }
                            });
                        }
                    })
                    .catch(error => {
                        console.log('error', error);
                    });
            }

            // console.log('All nodedatas: ', allNodedatas.length, JSON.stringify(allNodedatas));
            // console.log('All images: ', images.length, JSON.stringify(images));
            // console.log('All local likes: ', likes.length, JSON.stringify(likes));
            // console.log('All nodes: ', allNodes.length, JSON.stringify(allNodes.length)); // , JSON.stringify(allNodes)
            // console.log('All node audits: ', nodeAudits.length, JSON.stringify(nodeAudits));
            // console.log('All points: ', points.length); //, JSON.stringify(points)
        } catch (e) {
            console.log('Sync error: ', e);
        }
    };

    return {
        onSync,
    };
};
