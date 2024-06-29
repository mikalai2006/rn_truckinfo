import {useNetInfo} from '@react-native-community/netinfo';
import {useQuery, useRealm} from '@realm/react';
import dayjs from 'dayjs';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {BSON} from 'realm';
import RImage from '~components/r/RImage';
import SIcon from '~components/ui/SIcon';
import UIButton from '~components/ui/UIButton';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
import {WidgetSync2} from '~components/widgets/sync/WidgetSync2';
// import useAuth from '~hooks/useAuth';
import {CountryStat} from '~schema/CountryStat';
import {LikeSchema} from '~schema/LikeSchema';
import {NodeSchema} from '~schema/NodeSchema';
import {ICountry, countries, tokens} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import {iCheckLg} from '~utils/icons';

const SyncScreen = ({navigation}) => {
    const {isConnected} = useNetInfo();
    // const {isTokenExpired} = useAuth();
    const tokenFromStore = useAppSelector(tokens);

    const isAuth = useMemo(() => tokenFromStore?.access_token, [tokenFromStore?.access_token]);
    // useEffect(() => {
    //     if (tokenFromStore && !isTokenExpired()) {
    //         setIsAuth(true);
    //     }
    // }, [isTokenExpired, tokenFromStore]);

    const countriesFromStore = useAppSelector(countries);
    const countryStats = useQuery(CountryStat, nodes => nodes);
    const [filter, setFilter] = useState<CountryStat[]>([...countryStats]);
    const mapStats = useMemo(() => {
        return new Map(countryStats.map(x => [x.code, {...x}]));
    }, [countryStats]);

    const filterIds = useMemo(() => new Map(filter.map(x => [x.idCountry, {...x}])), [filter]);
    const isNotChange = useMemo(
        () =>
            filter.every(x => countryStats.map(y => y.idCountry).includes(x.idCountry)) &&
            filter.length === countryStats.length,
        [countryStats, filter],
    );

    // console.log('Render SyncScreen', filter);

    const {t} = useTranslation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // console.log('unmounted');

            setFilter([...countryStats]);
        });

        return unsubscribe;
    }, []);

    const realm = useRealm();
    // const [loading, setLoading] = useState(false);
    const save = async () => {
        // setLoading(true);

        const mapExistStat = new Map(countryStats.map(x => [x.code, {...x}]));
        const newStats = [];
        for (const stat of filter) {
            const existStat = mapExistStat.get(stat.code);
            if (!existStat) {
                newStats.push(stat);
            } else {
                newStats.push({...existStat});
            }
        }

        await realm.write(() => {
            realm.delete(countryStats);

            // console.log('countryStats:', countryStats);
            for (const item of newStats) {
                realm.create(
                    'CountryStat',
                    {
                        ...item,
                    },
                    // UpdateMode.Modified,
                );
            }
            setFilter(newStats);
        });
        await removeUnUsedNodes();
        // setLoading(false);
    };

    const likes = useQuery(LikeSchema);
    const nodes = useQuery(NodeSchema);
    const removeUnUsedNodes = async () => {
        // setNameCountrySync(`${t('general:syncPOIRemoveUnused')}`);
        let timeSet = window.performance.now();
        const usedCountriesCode = countryStats.map(x => x.code);
        const idsQuery = usedCountriesCode.map(code => `'${code}'`).join(', ');
        console.log('idsQuery=', idsQuery);

        const allUnSyncNodes = nodes.filtered(`NOT ccode IN {${idsQuery}}`); //.filter(x => !usedCountriesCode.includes(x.ccode));
        console.log('Remove unused nodes: ', allUnSyncNodes.length);
        console.log('Time unused: ', window.performance.now() - timeSet);

        let countRemoveNodes = 0;
        if (allUnSyncNodes.length > 0) {
            const localNodesUnUsedCountry = allUnSyncNodes.filtered('my !=$0', true);
            const myLocalNodesUnUsedCountry = allUnSyncNodes.filtered('my ==$0', true);

            // remove not my unused nodes.
            await realm.write(() => {
                if (localNodesUnUsedCountry.length > 0) {
                    realm.delete(localNodesUnUsedCountry);
                    countRemoveNodes += localNodesUnUsedCountry.length;
                }
                // for (let i = 0, total = unSyncNodes.length; i < total; i++) {
                //     const currentNode = unSyncNodes[i];
                //     if (currentNode?.sid && currentNode.sid !== '') {
                //         realm.delete(currentNode);
                //         countRemoveNodes++;
                //     }
                // }

                console.log('countRemoveNodes', countRemoveNodes);
            });

            const idsMyLocalNodes = myLocalNodesUnUsedCountry.map(l => `'${l._id.toHexString()}'`).join(', ');
            const likeUnUsedNodes = likes.filtered(`NOT ccode IN {${idsQuery}} AND NOT nlid IN {${idsMyLocalNodes}}`);
            if (likeUnUsedNodes.length > 0) {
                realm.write(() => {
                    realm.delete(likeUnUsedNodes);
                });
                console.log('Remove likeUnUsedNodes=', likeUnUsedNodes.length);
            }
        }
    };

    // const removeUnUsedLikes = () => {
    //     let timeSet = window.performance.now();
    //     // clear likes not exist nodedata
    //     // console.log('removeNodedataObject: ', removeNodedataObject);
    //     //allNodes.reduce((ac, el) => ac.concat(el.data.map(x => x.sid)), []);
    //     const bbb = nodes.filtered('ANY data.@count != 0'); // x => !!x.data.length
    //     console.log('bbb=', bbb.length);
    //     console.log('Time Filter: ', window.performance.now() - timeSet);
    //     timeSet = window.performance.now();

    //     const allIdsNodedatas: string[] = bbb.reduce((ac, el) => {
    //         const idsNodedatas = el.data.map(d => d.sid);
    //         idsNodedatas.length && ac.push(...idsNodedatas);
    //         return ac;
    //     }, []);
    //     // for (let item of bbb) {
    //     //     const idsNodedatas = item.data.map(d => d.sid);
    //     //     item.data.length && allIdsNodedatas.push(...idsNodedatas);
    //     // }
    //     console.log('Time Create array: ', window.performance.now() - timeSet);
    //     console.log('allIdsNodedatas.length=', allIdsNodedatas.length);
    //     timeSet = window.performance.now();

    //     const setIdsNodedatas = new Set(allIdsNodedatas);

    //     const removeNodedataObjectLikes = likes.filter(x => !setIdsNodedatas.has(x.serverNodedataId));
    //     // console.log('removeNodedataObjectLikes: ', removeNodedataObjectLikes.length, removeNodedataObjectLikes);

    //     console.log('Create set and: ', window.performance.now() - timeSet);

    //     realm.write(() => {
    //         realm.delete(removeNodedataObjectLikes);
    //     });
    // };

    // const onRemoveFilterItem = (id: string) => {
    //     setFilter(filter.filter(x => x.idCountry !== id));
    // };

    // function onAddFilterItem(item: CountryStat) {
    //     setFilter([...filter, item]);
    // }

    function onChangeItem(item: ICountry) {
        if (!isAuth) {
            navigation.navigate('AuthScreen');
        }

        // let timeSet = window.performance.now();
        if (filterIds.get(item.id)) {
            setFilter(filter.filter(x => x.idCountry !== item.id));
        } else {
            setFilter([
                ...filter,
                {
                    _id: new BSON.ObjectId(),
                    code: item.code,
                    count: item.stat.count,
                    lastUpdatedAt: '', //new Date('2000-01-01').toISOString(),
                    idCountry: item.id,
                },
            ]);
        }
        // console.log('Time fitler: ', window.performance.now() - timeSet);
    }

    const renderItem = ({item}) => (
        <View tw="mx-2 mb-3  rounded-lg">
            <View tw="flex flex-row items-center">
                <TouchableOpacity
                    onPress={() => {
                        onChangeItem(item);
                    }}
                    tw={`flex-auto p-2 flex flex-row items-center space-x-3 rounded-lg ${
                        filterIds.get(item.id) ? 'bg-p-500/30 dark:bg-white/20' : 'bg-s-500/5 dark:bg-black/10'
                    }`}>
                    <RImage uri={item.image} classString="ml-2 w-12 h-8" />
                    <View tw="flex-auto">
                        <Text
                            tw={`text-xl font-bold ${
                                filterIds.get(item.id) ? 'text-s-800 dark:text-s-100' : 'text-s-500 dark:text-s-300'
                            }`}>
                            {item.name}
                        </Text>
                        <View tw="flex flex-row">
                            <Text tw={`text-sm leading-4 ${filterIds.get(item.id) ? 'text-s-400' : 'text-s-400'}`}>
                                {item.stat.count} POI ~{Math.max(item.stat.size / 1024 / 1024, 0.01).toFixed(2)}Mb
                            </Text>
                        </View>
                        {mapStats?.get(item.code)?.lastUpdatedAt ? (
                            <Text tw={`text-sm leading-4 ${filterIds.get(item.id) ? 'text-s-400' : 'text-s-400'}`}>
                                {t('general:updateAt')} {dayjs(mapStats?.get(item.code)?.lastUpdatedAt).fromNow()}
                            </Text>
                        ) : (
                            ''
                        )}
                    </View>
                    <View
                        tw={`relative w-8 h-8 p-2 rounded-md border flex items-center justify-center ${
                            filterIds.get(item.id)
                                ? 'border-p-500/0 dark:border-s-500/0'
                                : 'border-s-200 dark:border-s-700'
                        }`}>
                        {filterIds.get(item.id) && <SIcon path={iCheckLg} size={30} tw="text-p-500 dark:text-p-50" />}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-950">
            <View tw="mt-8 px-4">
                <WidgetHeaderApp />
            </View>
            <View tw="px-6 py-2">
                <Text tw="text-black dark:text-s-200 text-base leading-5">{t('general:setSyncPOI')}</Text>
            </View>
            <View tw="bg-white dark:bg-s-950 flex-auto px-2">
                <FlatList data={countriesFromStore} windowSize={2} renderItem={renderItem} />
            </View>
            <View tw="px-4 py-4">
                {!isConnected && (
                    <Text tw="text-base leading-5 text-s-800 dark:text-s-300 pb-3">
                        {t('general:setSyncPOIdisconnect')}
                    </Text>
                )}
                {isNotChange && isAuth ? <WidgetSync2 /> : null}
                {!isNotChange && isAuth ? (
                    <UIButton
                        type="primary"
                        // loading={loading}
                        // tw={`p-3 rounded-lg ${isNotChange ? 'bg-s-200 dark:bg-s-900' : 'bg-p-500'}`}
                        text={t('form:button_save')}
                        disabled={isNotChange}
                        onPress={save}
                    />
                ) : null}
                {!isAuth && (
                    <UIButton
                        type="primary"
                        text={t('form:loginTitle')}
                        onPress={() => {
                            navigation.navigate('AuthScreen');
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default SyncScreen;
