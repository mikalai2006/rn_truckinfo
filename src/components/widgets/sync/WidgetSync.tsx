import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {hostAPI} from '~utils/global';

import {useFetchWithAuth} from '~hooks/useFetchWithAuth';
import {ICountry, INode, countries, tokens} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import {useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {CountryStat} from '~schema/CountryStat';
import {LikeSchema} from '~schema/LikeSchema';
import UIButton from '~components/ui/UIButton';
import {useTranslation} from 'react-i18next';
import {iCloudSync} from '~utils/icons';
import {getObjectId, replaceRegexByArray} from '~utils/utils';
import {useNetInfo} from '@react-native-community/netinfo';

type TStat = {
    stat: CountryStat;
    country: ICountry;
};

export const WidgetSync = () => {
    const {onFetchWithAuth} = useFetchWithAuth();

    const {t} = useTranslation();

    const {isConnected} = useNetInfo();

    // const tokensFromStore = useAppSelector(tokens);
    const [loadPOI, setLoadPOI] = useState(false);

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

    const tokenFromStore = useAppSelector(tokens);
    const handleAddNodes = (data: INode[]) => {
        realm.write(() => {
            try {
                const ccode = data[0]?.ccode;
                if (!ccode) {
                    return;
                }
                console.log('Sync ccode=', ccode);

                const localNodes = [...nodes].filter(x => x.ccode === ccode);
                const serverNodesMap = new Map(data.map(s => [s.id, s]));
                const localNodesMap = new Map(localNodes.map(s => [s.sid, s]));

                const nodesNotExistLocal = data.filter(x => !localNodesMap.get(x.id));
                const nodesNotExistServer = localNodes.filter(x => !serverNodesMap.get(x.sid));

                console.log('nodesNotExistLocal=', nodesNotExistLocal.length);
                console.log('nodesNotExistServer=', nodesNotExistServer.length);

                // add server nodes
                // const newNodes = data.filter(x => !localNodesMap.get(x.id));
                let countAddNodes = 0;
                let countUpdateNodes = 0;
                for (let i = 0, total = data.length; i < total; i++) {
                    const existLocalNode = localNodesMap.get(data[i].id);
                    const nodeData = data[i].data.map(x => {
                        return {
                            sid: x.id,
                            tagoptId: getObjectId(x.tagoptId),
                            tagId: x.tagId,
                            value: x.data.value,
                        };
                    });
                    const newItem = {
                        ...data[i],
                        data: nodeData,
                        _id: existLocalNode?._id || new BSON.ObjectId(),
                        sid: data[i].id,
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

                // remove nodes not exist on the server
                let countRemoveNodes = 0;
                let countRemoveNodeLikes = 0;
                for (let i = 0, total = nodesNotExistServer.length; i < total; i++) {
                    const currentNode = nodesNotExistServer[i];
                    const idsNodedatasCurrentNode = currentNode.data.map(x => x.sid);
                    const existLikes = likes.filter(x => idsNodedatasCurrentNode.includes(x.serverNodedataId));

                    for (const currentNodedataLike of existLikes) {
                        realm.delete(currentNodedataLike);
                        countRemoveNodeLikes++;
                    }

                    if (currentNode?.sid) {
                        realm.delete(currentNode);
                        countRemoveNodes++;
                    }
                }
                console.log(`countRemoveNodes=${countRemoveNodes}, countRemoveNodeLikes=${countRemoveNodeLikes}`);
            } catch (e) {
                throw e;
                // console.log(e);
            }
        });
    };

    const mapCountry = useMemo(() => new Map(countriesFromStore.map(x => [x.id, x])), [countriesFromStore]);

    const isBusy = useRef(false);
    const onStopLoadPOI = () => {
        isBusy.current = false;
    };
    // console.log('SyncStats::: countryStats=', countryStats);
    // console.log('Widget sync::: isBusy=', isBusy.current);
    // useEffect(() => {
    const onLoadPOI = useCallback(
        async (listSync: TStat[]) => {
            try {
                isBusy.current = true;

                if (listSync.length === 0) {
                    isBusy.current = false;
                    return;
                }

                if (!loadPOI) {
                    setLoadPOI(true);
                }

                const element = listSync.pop(); //needSync[0];

                // console.log('SyncStats::: needSync=', needSync);
                // console.log('element =', element);
                const currentCountry = mapCountry.get(element?.stat.idCountry);

                if (!element || !currentCountry) {
                    isBusy.current = false;
                    return;
                }

                setNameCountrySync(`${t('general:syncPOILoadCountry')} ${currentCountry.name}`);

                await onFetchWithAuth(`${hostAPI}/file/${element.stat.code}`, {
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
                        const newState = {
                            _id: element.stat._id,
                            lastUpdatedAt: currentCountry.stat.lastUpdatedAt,
                            createdAt: new Date().toISOString(),
                        };
                        realm.write(() => {
                            realm.create('CountryStat', newState, UpdateMode.Modified);
                        });

                        return res;
                    })
                    .catch(e => {
                        throw e;
                    })
                    .finally(() => {
                        // setNameCountrySync('');
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

                if (listSync.length && isBusy.current) {
                    // listSync.length > 55 &&
                    console.log('listSync.length=', listSync.length);
                    onLoadPOI([...listSync]);
                } else {
                    setLoadPOI(false);
                    isBusy.current = false;
                    // removeUnUsedNodes();
                }
            } catch (e) {
                console.log('WidgetSync error: ', e?.message);
                setLoadPOI(false);
                isBusy.current = false;
                // removeUnUsedNodes();
            }
        },
        [loadPOI, mapCountry, onFetchWithAuth, realm, t],
    );

    // if (isBusy.current && needSync.length) {
    //     console.log('isBusy.current=', isBusy.current, needSync.length);

    //     onLoadPOI();
    // }
    // }, [needSync]);
    // const removeUnUsedNodes = () => {
    //     setNameCountrySync(`${t('general:syncPOIRemoveUnused')}`);
    //     let timeSet = window.performance.now();
    //     const usedCountriesCode = countryStats.map(x => x.code);
    //     const idsQuery = usedCountriesCode.map(code => `'${code}'`).join(', ');
    //     console.log('idsQuery=', idsQuery);

    //     const unSyncNodes = nodes.filtered(`NOT ccode IN {${idsQuery}}`); //.filter(x => !usedCountriesCode.includes(x.ccode));
    //     console.log('Remove unused nodes: ', unSyncNodes.length);
    //     console.log('UnSyncNodes', unSyncNodes.length);
    //     console.log('Time unused: ', window.performance.now() - timeSet);

    //     let countRemoveNodes = 0;
    //     if (unSyncNodes.length > 0) {
    //         realm.write(() => {
    //             for (let i = 0, total = unSyncNodes.length; i < total; i++) {
    //                 const currentNode = unSyncNodes[i];
    //                 if (currentNode?.sid && currentNode.sid !== '') {
    //                     realm.delete(currentNode);
    //                     countRemoveNodes++;
    //                 }
    //             }

    //             console.log('countRemoveNodes', countRemoveNodes);
    //             isBusy.current = false;
    //             setLoadPOI(false);
    //         });
    //     }
    // };

    // useEffect(() => {
    //     console.log('Check removed');

    //     if (needSync.length === 0 && !isBusy.current) {
    //         isBusy.current = true;
    //         if (!loadPOI) {
    //             setLoadPOI(true);
    //         }
    //         removeUnUsedNodes();
    //     }
    // }, [countryStats]);

    return (
        <>
            {needSync.length > 0 ? (
                <View>
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300 pb-3">
                        {replaceRegexByArray(t('general:availableUpdate'), [needSync.length])}
                    </Text>
                    {!isConnected && (
                        <Text tw="text-base leading-5 text-s-800 dark:text-s-300 pb-3">
                            {t('general:setSyncPOIdisconnect')}
                        </Text>
                    )}
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
                                ? `${nameCountrySync} ...`
                                : `${t('general:syncPOIAll')} ~${Math.max(
                                      needSync.reduce((ac, el) => ac + el.country.stat.size, 0) / 1024 / 1024,
                                      0.01,
                                  ).toFixed(2)}Mb`
                        }
                        disabled={loadPOI || !isConnected}
                        loading={loadPOI}
                        icon={iCloudSync}
                        onPress={() => {
                            if (!loadPOI) {
                                onLoadPOI([...needSync]);
                            } else {
                                onStopLoadPOI();
                            }
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
            ) : (
                <View>
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300">{t('general:actualUpdateNone')}</Text>
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300">
                        {t('general:countCountry')}: {countryStats.length},{t('general:countPOI')}: {nodes.length}
                    </Text>
                </View>
            )}
        </>
    );
};
