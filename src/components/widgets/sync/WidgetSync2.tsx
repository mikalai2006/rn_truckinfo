import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {HOST_API} from '@env';

import {useFetchWithAuth} from '~hooks/useFetchWithAuth';
import {ICountry, INode, countries, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import {useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {CountryStat} from '~schema/CountryStat';
import {LikeSchema} from '~schema/LikeSchema';
import {getObjectId, replaceRegexByArray} from '~utils/utils';
import {useNetInfo} from '@react-native-community/netinfo';
import UIButton from '~components/ui/UIButton';
import {useTranslation} from 'react-i18next';
import {iCloudSync} from '~utils/icons';

type TStat = {
    stat: CountryStat;
    country: ICountry;
};

export const WidgetSync2 = () => {
    const {isConnected} = useNetInfo();
    const {onFetchWithAuth} = useFetchWithAuth();

    const userFromStore = useAppSelector(user);

    // const tokensFromStore = useAppSelector(tokens);
    const [loadPOI, setLoadPOI] = useState(false);

    const {t} = useTranslation();

    const realm = useRealm();

    const countryStats = useQuery(CountryStat);
    const nodes = useQuery(NodeSchema);
    const likes = useQuery(LikeSchema);

    const countriesFromStore = useAppSelector(countries);

    const [nameCountrySync, setNameCountrySync] = useState('');

    const needSync = useMemo(() => {
        const mapCountry = new Map(countriesFromStore.map(x => [x.id, x]));
        const result: TStat[] = [];
        for (const element of countryStats) {
            const currentCountry = mapCountry.get(element.idCountry);

            if (currentCountry) {
                const diffTime = currentCountry?.createdAt
                    ? new Date(currentCountry.stat.lastUpdatedAt).getTime() -
                      (element.lastUpdatedAt !== ''
                          ? new Date(element.lastUpdatedAt).getTime()
                          : new Date('2000-01-01').getTime())
                    : 0;
                // console.log(
                //     'diff=>',
                //     element.code,
                //     '---',
                //     diffTime,
                //     '---',
                //     element.lastUpdatedAt,
                //     ' ---- ',
                //     currentCountry?.stat.lastUpdatedAt,
                // );
                if (diffTime) {
                    result.push({
                        stat: element,
                        country: currentCountry,
                    });
                }
            } else {
                console.log('Not found ', element.code);
            }
        }
        return result;
    }, [countryStats]);

    // console.log('needSync: ', needSync.length);

    const handleAddNodes = (data: any[]) => {
        realm.write(() => {
            try {
                const ccode = data[0]?.[2];
                if (!ccode) {
                    return;
                }
                console.log('Sync ccode=', ccode);

                const localNodes = [...nodes].filter(x => x.ccode === ccode);
                const serverNodesMap = new Map(data.map(s => [s[0], s]));
                const localNodesMap = new Map(localNodes.map(s => [s.sid, s]));

                const nodesNotExistLocal = data.filter(x => !localNodesMap.get(x[0]));
                const nodesNotExistServer = localNodes.filter(x => !serverNodesMap.get(x.sid));

                console.log('nodesNotExistLocal=', nodesNotExistLocal.length);
                console.log('nodesNotExistServer=', nodesNotExistServer);

                // add server nodes
                // const newNodes = data.filter(x => !localNodesMap.get(x.id));
                let countAddNodes = 0;
                let countUpdateNodes = 0;
                for (let i = 0, total = data.length; i < total; i++) {
                    const [_id, _type, _ccode, _lat, _lon, _name, _userId, _date, _data] = data[i];
                    // console.log([_id, _type, _ccode, _lat, _lon, _name, _userId, _date, _data]);

                    const existLocalNode = localNodesMap.get(_id);
                    const nodeData = _data.map(x => {
                        const [nodedata_id, nodedata_tagId, nodedata_tagoptId, nodedata_value] = x;
                        return {
                            sid: nodedata_id,
                            tagoptId: getObjectId(nodedata_tagoptId),
                            tagId: nodedata_tagId,
                            value: nodedata_value,
                        };
                    });
                    const newItem = {
                        // ...data[i],
                        // data: nodeData,
                        // _id: existLocalNode?._id || new BSON.ObjectId(),
                        // sid: data[i].id,
                        // userId: data[i].userId,
                        // my: data[i].userId === userFromStore?.id,
                        _id: existLocalNode?._id || new BSON.ObjectId(),
                        sid: _id,
                        name: _name,
                        type: _type,
                        lat: _lat,
                        lon: _lon,
                        ccode: _ccode,
                        my: _userId === userFromStore?.id,
                        createdAt: new Date(_date).toISOString(),
                        data: nodeData,
                    };
                    // console.log('newItem: ', newItem);

                    realm.create('NodeSchema', newItem, UpdateMode.Modified);
                    if (existLocalNode?._id) {
                        countUpdateNodes++;
                    } else {
                        countAddNodes++;
                    }
                }
                console.log(`New newNodes: countAddNodes=${countAddNodes} countUpdateNodes=${countUpdateNodes}`);

                // // remove nodes not exist on the server
                // let countRemoveNodes = 0;
                // let countRemoveNodeLikes = 0;
                // for (let i = 0, total = nodesNotExistServer.length; i < total; i++) {
                //     const currentNode = nodesNotExistServer[i];
                //     const idsNodedatasCurrentNode = currentNode.data.map(x => x.sid);
                //     const existLikes = likes.filter(x => idsNodedatasCurrentNode.includes(x.serverNodedataId));

                //     for (const currentNodedataLike of existLikes) {
                //         realm.delete(currentNodedataLike);
                //         countRemoveNodeLikes++;
                //     }

                //     if (currentNode?.sid) {
                //         realm.delete(currentNode);
                //         countRemoveNodes++;
                //     }
                // }
                // console.log(`countRemoveNodes=${countRemoveNodes}, countRemoveNodeLikes=${countRemoveNodeLikes}`);
            } catch (e) {
                throw e;
                // console.log(e);
            }
        });
    };

    const mapCountry = useMemo(() => new Map(countriesFromStore.map(x => [x.id, x])), [countriesFromStore]);

    const isBusy = useRef(false);
    const [isWork, setIsWork] = useState(false);
    // console.log('SyncStats::: countryStats=', countryStats);
    // console.log('Widget sync::: isBusy=', isBusy.current);
    useEffect(() => {
        const onLoadPOI = async () => {
            try {
                isBusy.current = true;

                if (needSync.length === 0) {
                    isBusy.current = false;
                    setIsWork(false);
                    return;
                }

                setLoadPOI(true);

                const element = needSync[0];

                // console.log('SyncStats::: needSync=', needSync);
                // console.log('element =', element);
                const currentCountry = mapCountry.get(element.stat.idCountry);

                if (!element || !currentCountry) {
                    isBusy.current = false;
                    setIsWork(false);
                    return;
                }

                setNameCountrySync(currentCountry.name);

                let newState = null;

                await onFetchWithAuth(`${HOST_API}/file/${element.stat.code}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin-Type': '*',
                        // Authorization: `Bearer ${tokensFromStore.access_token}`,
                    },
                })
                    .then(r => r.json())
                    .then((res: INode[]) => {
                        // // console.log('res =', res.length);
                        // if (!res.length) {
                        //     return;
                        // }
                        handleAddNodes(res);

                        // set new date by update
                        newState = {
                            _id: element.stat._id,
                            lastUpdatedAt: currentCountry.stat.lastUpdatedAt,
                            createdAt: new Date().toISOString(),
                        };

                        return res;
                    })
                    .catch(e => {
                        throw e;
                    })
                    .finally(async () => {
                        if (newState) {
                            await realm.write(() => {
                                realm.create('CountryStat', newState, UpdateMode.Modified);
                            });
                        }
                        isBusy.current = false;
                        setNameCountrySync('');
                        // setLoadPOI(false);
                    });
                // Promise.all(syncPromises)
                //     .then(data => {
                //         // console.log(data);
                //         console.log('updatedStats: ', updatedStats);

                //         realm.write(() => {
                //             for (const statData of updatedStats) {
                //                 realm.create('CountryStat', statData, UpdateMode.Modified);
                //             }
                //         });
                //         return data;
                //     })
                //     .catch(e => {
                //         throw e;
                //     })
                //     .finally(() => {
                //         setLoadPOI(false);
                //     });
            } catch (e) {
                console.log('WidgetSync error: ', e?.message);
                setLoadPOI(false);
            }
        };

        // console.log('isWork: ', isWork);
        // console.log('isBusy.current: ', isBusy.current);
        // console.log('===========================================');
        if (!isBusy.current && isWork) {
            onLoadPOI();
        }
        if (needSync.length === 0 && loadPOI) {
            setLoadPOI(false);
        }
    }, [mapCountry, needSync, isWork]);

    // useEffect(() => {
    //     if (needSync.length === 0) {
    //         const usedCountriesCode = countryStats.map(x => x.code);
    //         const unSyncNodes = nodes.filter(x => !usedCountriesCode.includes(x.ccode));
    //         console.log('Remove unused nodes', usedCountriesCode);
    //         console.log('UnSyncNodes', unSyncNodes.length);

    //         let countRemoveNodes = 0;
    //         if (unSyncNodes.length > 0) {
    //             realm.write(() => {
    //                 for (let i = 0, total = unSyncNodes.length; i < total; i++) {
    //                     const currentNode = unSyncNodes[i];
    //                     if (currentNode?.sid && currentNode.sid !== '') {
    //                         realm.delete(currentNode);
    //                         countRemoveNodes++;
    //                     }
    //                 }
    //             });
    //         }
    //         console.log('countRemoveNodes', countRemoveNodes);
    //     }
    // }, [countryStats, needSync, nodes]);

    return (
        <>
            {needSync.length > 0 ? (
                <View>
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300 pb-3">
                        {replaceRegexByArray(t('general:availableUpdate'), [needSync.length])}
                    </Text>
                    {/* <View>
                        {loadPOI ? (
                            <>
                                <ActivityIndicator size={20} color={'white'} />
                                <Text>Sync POI {nameCountrySync}</Text>
                            </>
                        ) : null}
                    </View> */}
                    <UIButton
                        type="primary"
                        text={
                            loadPOI
                                ? `${t('general:syncPOILoadCountry')} ${nameCountrySync} ...`
                                : `${t('general:syncPOIAll')} ~${Math.max(
                                      needSync.reduce((ac, el) => ac + el.country.stat.size, 0) / 1024 / 1024,
                                      0.01,
                                  ).toFixed(2)}Mb`
                        }
                        disabled={loadPOI || !isConnected}
                        loading={loadPOI}
                        icon={iCloudSync}
                        onPress={() => {
                            setIsWork(true);
                            // if (!loadPOI) {
                            //     onLoadPOI([...needSync]);
                            // } else {
                            //     onStopLoadPOI();
                            // }
                        }}
                    />
                    {/* <Text tw="text-base leading-5 text-s-800 pb-1">
                        {needSync.reduce((ac, el) => ac + el.country.stat.count, 0)} POI ~
                        {Math.max(
                            needSync.reduce((ac, el) => ac + el.country.stat.size, 0) / 1024 / 1024,
                            0.01,
                        ).toFixed(2)}
                        Mb
                    </Text> */}
                </View>
            ) : nodes.length ? (
                <View>
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300">{t('general:actualUpdateNone')}</Text>
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300">
                        {t('general:setup')}: {t('general:countCountry')}: {countryStats.length},{' '}
                        {t('general:countPOI')}: {nodes.length}
                    </Text>
                </View>
            ) : null}
            {/* {loadPOI ? (
                <View tw="absolute top-9 right-3 z-50 bg-p-500 rounded-md p-1">
                    <ActivityIndicator size={50} color={'white'} />
                    <Text>Sync POI {nameCountrySync}</Text>
                </View>
            ) : (
                <View tw="absolute top-9 right-3 z-50 bg-p-500 rounded-md p-1">
                    <Text>{nodes.length}</Text>
                </View>
            )} */}
        </>
    );
};
