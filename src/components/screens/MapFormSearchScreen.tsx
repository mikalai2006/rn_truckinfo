import React, {useEffect, useMemo, useState} from 'react';
import {DeviceEventEmitter, Text, View} from 'react-native';

import {useQuery} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import {FlatList, TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import SIcon from '~components/ui/SIcon';
import {iArrowLeft, iArrowLeftShort, iClose, iGeoAlt, iSearch, iTimeFill} from '~utils/icons';
import UIButton from '~components/ui/UIButton';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {IHistoryQuery, historyQuery, setHistoryQuery} from '~store/appSlice';
import dayjs from '~utils/dayjs';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'MapFormSearchScreen'>;

const MapFormSearchScreen = (props: Props) => {
    const {navigation, route} = props;
    const {queryString} = route.params;
    const [queryStringLocal, setQueryStringLocal] = useState(queryString);

    const historyQueryFormStore = useAppSelector(historyQuery);
    const dispatch = useAppDispatch();
    const history = useMemo(() => {
        return [...historyQueryFormStore]?.sort((a, b) => b.createdAt - a.createdAt);
    }, [historyQueryFormStore]);

    const localNodes = useQuery(NodeSchema);
    const nodesByRegexQuery = useMemo(() => {
        // var testTime = window.performance.now();
        // const regex = new RegExp(`${queryStringLocal?.toLowerCase()}`, 'gi');
        // console.log(regex);

        const result = queryStringLocal
            ? localNodes.filtered(
                  'name CONTAINS[c] $0 OR name BEGINSWITH[c] $1',
                  queryStringLocal.toLowerCase(),
                  queryStringLocal,
              )
            : [];
        //   localNodes.filter(x => x.name.toLowerCase().match(regex))

        // console.log('time query: ', window.performance.now() - testTime);
        return result;
    }, [localNodes, queryStringLocal]);
    const nameNodes = useMemo(() => {
        const items = nodesByRegexQuery
            .map(x => x.name)
            // .sort()
            .reduce((acc, val) => {
                acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
                return acc;
            }, {});
        return Object.entries(items)
            .filter(([key, count]) => count > 1)
            .sort((a, b) => b[1] - a[1]); //.length ? [...new Set(items)] : [];
    }, [nodesByRegexQuery]);

    const onSubmit = (value?: string) => {
        let _value = value;
        if (!_value) {
            _value = queryStringLocal;
        }
        _value && onSetHistoryQuery(value);
        DeviceEventEmitter.emit('event.onSearch', {queryString: value || queryStringLocal});
        navigation.canGoBack && navigation.goBack();
    };

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('beforeRemove', e => {
    //         DeviceEventEmitter.emit('event.onSearch', {queryString: queryStringLocal});
    //     });

    //     return () => unsubscribe();
    // }, []);

    const onSetHistoryQuery = (value?: string) => {
        const _historyQuery = [...historyQueryFormStore];
        const queryIndex = _historyQuery.findIndex(x => x.query === value);
        const newItem = {
            query: value || queryStringLocal,
            createdAt: new Date().getTime(),
        };
        if (queryIndex !== -1) {
            // _historyQuery.splice(queryIndex, 1);
            _historyQuery[queryIndex] = newItem;
        } else {
            _historyQuery.push(newItem);
        }

        // console.log('_historyQuery =', _historyQuery);

        dispatch(setHistoryQuery(_historyQuery));
    };

    const onRemoveQueryHistory = (item: IHistoryQuery) => {
        const _historyQuery = [...historyQueryFormStore];
        const queryIndex = _historyQuery.findIndex(x => x.query === item.query);

        if (queryIndex !== -1) {
            _historyQuery.splice(queryIndex, 1);
        }

        // console.log('onRemoveQueryHistory =', _historyQuery);
        dispatch(setHistoryQuery(_historyQuery));
    };

    const renderItem = ({item}: {item: [string, number]}) => {
        return (
            <View tw="py-2 flex flex-row items-center border-b border-s-200 dark:border-s-800">
                <View tw="flex-auto">
                    <TouchableOpacity
                        tw="flex flex-row items-center"
                        onPress={() => {
                            // setQueryStringLocal(item[0]);
                            onSubmit(item[0]);
                        }}>
                        <View tw="pr-3">
                            {item[1] > 4 ? (
                                <View tw="bg-s-100 dark:bg-s-900 rounded-full p-2">
                                    <SIcon path={iSearch} size={20} tw="text-s-500" />
                                </View>
                            ) : (
                                <View tw="bg-s-100 dark:bg-s-900 rounded-full p-2">
                                    <SIcon path={iGeoAlt} size={20} tw="text-s-500" />
                                </View>
                            )}
                        </View>
                        <View tw="flex-auto">
                            <Text tw="text-base text-s-900 dark:text-s-200">{item[0]}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <UIButton
                        type="link"
                        twClass="p-1"
                        onPress={() => {
                            setQueryStringLocal(item[0]);
                        }}>
                        <View tw=" rotate-[45deg] transform">
                            <SIcon path={iArrowLeftShort} size={30} tw="text-s-500" />
                        </View>
                    </UIButton>
                </View>
            </View>
        );
    };

    const renderItemHistory = ({item}: {item: IHistoryQuery}) => {
        return (
            <View tw="py-2 flex flex-row items-center border-b border-s-200 dark:border-s-800">
                <View tw="flex-auto">
                    <TouchableOpacity
                        tw="flex flex-row items-center"
                        onPress={() => {
                            // setQueryStringLocal(item[0]);
                            onSubmit(item.query);
                        }}>
                        <View tw="pr-3">
                            <View tw="bg-s-100 dark:bg-s-900 rounded-full p-2">
                                <SIcon path={iTimeFill} size={20} tw="text-s-500" />
                            </View>
                        </View>
                        <View tw="flex-auto">
                            {/* <Text tw="text-base font-bold text-s-900 dark:text-s-200">{JSON.stringify(item)}</Text> */}
                            <Text tw="text-base font-bold text-s-900 dark:text-s-200">{item.query}</Text>
                            <Text tw="text-xs text-s-500">{dayjs(item.createdAt).fromNow()}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <UIButton
                        type="link"
                        twClass="p-1"
                        onPress={() => {
                            // setQueryStringLocal(item[0]);
                            onRemoveQueryHistory(item);
                        }}>
                        <View tw="">
                            <SIcon path={iClose} size={30} tw="text-s-500" />
                        </View>
                    </UIButton>
                </View>
            </View>
        );
    };
    return (
        <View tw="flex-1 pt-6 bg-white dark:bg-s-950 shadow-black border-transparent">
            <View tw="flex flex-row m-3 border border-s-200 dark:border-s-800 bg-white dark:bg-s-950 rounded-xl">
                <View>
                    <UIButton type="default" twClass="p-2 border-0 bg-transparent" onPress={() => onSubmit('')}>
                        <SIcon path={iArrowLeft} size={27} tw="text-s-900 dark:text-s-200" />
                    </UIButton>
                </View>
                <View tw="flex-auto self-center">
                    <TextInput
                        value={queryStringLocal}
                        autoFocus
                        keyboardType="web-search"
                        returnKeyType="search"
                        tw="text-base leading-5 py-2.5 text-black dark:text-s-200"
                        onChangeText={setQueryStringLocal}
                        onSubmitEditing={() => onSubmit('')}
                    />
                </View>
                <View>
                    {queryStringLocal !== '' && (
                        <UIButton
                            type="default"
                            twClass="p-2 border-0 bg-transparent"
                            onPress={() => setQueryStringLocal('')}>
                            <SIcon path={iClose} size={27} tw="text-s-900 dark:text-s-200" />
                        </UIButton>
                    )}
                </View>
            </View>
            <View tw="flex-auto px-3 self-stretch">
                {queryStringLocal && nameNodes.length === 0 ? (
                    <View>
                        <Text tw="text-base text-s-200">Not found</Text>
                    </View>
                ) : null}
                {queryStringLocal ? (
                    <FlatList
                        data={nameNodes}
                        windowSize={5}
                        renderItem={renderItem}
                        keyboardShouldPersistTaps="handled"
                    />
                ) : (
                    <FlatList
                        data={history}
                        windowSize={5}
                        renderItem={renderItemHistory}
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </View>
        </View>
    );
};

export default MapFormSearchScreen;
