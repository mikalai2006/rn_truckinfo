import {Text, View, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {LatLng, LeafletView} from '@charlespalmerbf/react-native-leaflet-js';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {
    ILatLng,
    INode,
    activeNode,
    amenities,
    bounds,
    center,
    filter,
    maxDistance,
    setActiveNode,
    setBounds,
    setCenter,
    setZoom,
    zoom,
} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'nativewind';
import colors from '~utils/colors';
import SIcon from '~components/ui/SIcon';
import {iAddMarker, iClose, iFilterFill, iMinusLg, iPlusLg} from '~utils/icons';
import WidgetHeaderApp from '../WidgetHeaderApp';
import WidgetMapLocation from './WidgetMapLocation';
import WidgetMapCreateNode, {WidgetMapCreateNodeNodeRefProps} from './WidgetMapCreateNode';
import {NodeSchema} from '~schema/NodeSchema';
import {useQuery} from '@realm/react';
import {ScreenKeys} from '~components/screens';
import {useTranslation} from 'react-i18next';
import WidgetNotConnect from '../WidgetNotConnect';
import UIButton from '~components/ui/UIButton';
import WidgetMapHeading from './WidgetMapHeading';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {PointSchema} from '~schema/PointSchema';
import {replaceRegexByArray} from '~utils/utils';

const DEFAULT_COORDINATE: LatLng = {
    lat: 52.039162780443,
    lng: 20.696011543274,
};

const WidgetMap = props => {
    // console.log('Render WidgetMapLeaflet');

    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const {t} = useTranslation();

    const {colorScheme} = useColorScheme();

    const centerFromStore = useAppSelector(center);
    const centerFromStore2 = useMemo(() => centerFromStore, []);
    const zoomFromStore = useAppSelector(zoom);
    const [zoomValue, setZoomValue] = useState(zoomFromStore);
    // const nodesFromStore = useAppSelector(nodes);
    // const [nodesX, setNodesX] = useState([] as INode[]);
    const filterFromStore = useAppSelector(filter);
    const boundsFromStore = useAppSelector(bounds);
    const amenityFromStore = useAppSelector(amenities);
    const activeNodeFromStore = useAppSelector(activeNode);
    const [showCross, setShowCross] = useState(false);
    const maxDistanceFromStore = useAppSelector(maxDistance);
    const allowDistance = useMemo(() => maxDistanceFromStore || 1, [maxDistanceFromStore]);
    const [angle, setAngle] = useState(0);
    const [enableMagnet, setEnableMagnet] = useState(false);
    const textHeading = useMemo(() => angle, [angle]);

    const [enabledLocation, setEnabledLocation] = useState(false);

    const [myPosition, setMyPosition] = useState<GeolocationResponse | null>(null);
    const onChangeMyPosition = (data: GeolocationResponse) => {
        // console.log('Change in parent', data);

        setMyPosition(data); // {lat: data.coords.latitude, lng: data.coords.longitude}
    };
    const [myPositionToCenter, setmyPositionToCenter] = useState<ILatLng | null>(null);
    const onSetCenterAsMyPosition = () => {
        console.log('onSetCenterAsMyPosition: ', myPosition);

        if (myPosition) {
            setmyPositionToCenter({lat: myPosition.coords.latitude, lng: myPosition.coords.longitude});
            dispatch(setCenter({lat: myPosition.coords.latitude, lng: myPosition.coords.longitude}));
        }
    };

    // const boundsStore = useAppSelector(bounds);

    const [queryString, setQueryString] = useState('');

    useEffect(() => {
        DeviceEventEmitter.addListener('event.onSearch', eventData => {
            // console.log('eventData: ', eventData.queryString);
            setQueryString(eventData.queryString);
        });

        return () => {
            DeviceEventEmitter.removeAllListeners('event.onSearch');
        };
    }, []);

    const allNodes = useQuery(NodeSchema, nodes => nodes);
    const nodesList = useQuery(
        NodeSchema,
        nodes => {
            let filterAmenities = Object.keys(filterFromStore);
            if (!filterAmenities.length || showCross) {
                filterAmenities = Object.keys(amenityFromStore);
            }
            var testTime = window.performance.now();
            // console.log(
            //     'filterAmenities: ',
            //     filterAmenities,
            //     JSON.stringify(filterFromStore),
            //     JSON.stringify(nodes[0]),
            // );

            const query = showCross
                ? null
                : Object.entries(filterFromStore)
                      .map(([amenityKey, value]) => {
                          const tagsQuery = Object.entries(value.tags)
                              .filter(([_, values]) => values.length > 0)
                              .map(
                                  ([tagId, values]) =>
                                      `(data.tagId == '${tagId}' AND ANY data.value IN {${values
                                          .map(str => `'${str}'`)
                                          .join(', ')}})`,
                              )
                              .join(' OR ');

                          return `(type == '${amenityKey}' ${tagsQuery.length > 0 ? 'AND (' + tagsQuery + '))' : ')'}`;
                      })
                      .join(' OR ');

            let fullQuery = 'lat > $0 AND lat < $1 AND lon > $2 AND lon < $3 ';

            if (!showCross && queryString) {
                fullQuery += ' AND ((my == $4 AND sid == $5) OR (name CONTAINS[c] $7 OR name BEGINSWITH[c] $8)) ';
            }

            if (!showCross && query) {
                fullQuery += ' AND ((my == $4 AND sid == $5) OR ' + query + ')';
            }

            const result = nodes
                .filtered(
                    fullQuery, // type IN $0
                    boundsFromStore._southWest?.lat,
                    boundsFromStore._northEast?.lat,
                    boundsFromStore._southWest?.lng,
                    boundsFromStore._northEast?.lng,
                    true,
                    '',
                    filterAmenities,
                    queryString.toLowerCase(),
                    queryString,
                )
                .sorted([['_id', true]]);
            // console.log('result: ', result);

            // console.log('query: ', JSON.stringify(result[0]));
            // console.log('query: ', query);

            //const result2 = result.filtered(query).sorted([['_id', true]]);

            // console.log('result2: ', result2.length);
            console.log('time query: ', window.performance.now() - testTime);
            console.log('fullQuery=', fullQuery);
            return result;
        },
        [filterFromStore, amenityFromStore, boundsFromStore, showCross, activeNodeFromStore, queryString],
    );
    // const [initMarkers, setInitMarkers] = useState([]);
    // useEffect(() => {
    //     const result = allNodes
    //         .map(x => {
    //             return [x._id.toHexString(), x.lat, x.lon, x.type].join('^');
    //         })
    //         .join('|');

    //     // const Buffer = require('buffer').Buffer;
    //     // let encodedStr = new Buffer(result).toString('base64');
    //     // console.log(encodedStr.length);
    //     // console.log(result.length);

    //     setInitMarkers(result);
    // }, [allNodes]);

    const [markers, setMarkers] = useState<INode[] | number>([]);

    // useEffect(() => {
    //     // var path = RNFS.DocumentDirectoryPath + '/text.txt';
    //     // console.log('path=', path);

    //     // // get a list of files and directories in the main bundle
    //     // RNFS.readFile(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     //     .then(result => {
    //     //         const data = JSON.parse(result);
    //     //         if (data.length) {
    //     //             console.log('GOT RESULT', data.length);
    //     //             const b = data.map(x => {
    //     //                 const [type, lat, lon, name, tags] = x.split(',');
    //     //                 const _tags = tags.split(';').filter(x => x);

    //     //                 return {
    //     //                     type,
    //     //                     lat,
    //     //                     lon,
    //     //                     name,
    //     //                     tags: _tags.length
    //     //                         ? _tags.map(y => {
    //     //                               const [tagId, value] = y.split(':');
    //     //                               return {
    //     //                                   tagId,
    //     //                                   value: value === '1' ? 'yes' : value,
    //     //                               };
    //     //                           })
    //     //                         : [],
    //     //                 };
    //     //             });
    //     //             setNodesX(b);
    //     //         }
    //     //     })
    //     //     .catch(err => {
    //     //         console.log(err.message, err.code);
    //     //     });

    //     // RNFS.unlink(path)
    //     //     .then(() => {
    //     //         console.log('FILE DELETED');
    //     //     })
    //     //     // `unlink` will throw an error, if the item to unlink does not exist
    //     //     .catch(err => {
    //     //         console.log(err.message);
    //     //     });

    //     // // get a list of files and directories in the main bundle
    //     // RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //     //     .then(result => {
    //     //         console.log('GOT RESULT', result);

    //     //         // stat the first file
    //     //         return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    //     //     })
    //     //     .then(statResult => {
    //     //         if (statResult[0].isFile()) {
    //     //             // if we have a file, read it
    //     //             return RNFS.readFile(statResult[1], 'utf8');
    //     //         }

    //     //         return 'no file';
    //     //     })
    //     //     .then(contents => {
    //     //         // log the file contents
    //     //         // console.log(contents);
    //     //     })
    //     //     .catch(err => {
    //     //         console.log(err.message, err.code);
    //     //     });

    //     // let dirs = RNFetchBlob.fs.dirs;
    //     // RNFetchBlob.fs.readFile(dirs.DocumentDir + '/map.json', 'utf8').then(dataStr => {
    //     //     // const d = RNFetchBlob.base64.decode(data).split('|||||');
    //     //     const dataArray = dataStr.split('|||||');
    //     //     console.log('READ File', dataArray.length);
    //     //     const b = dataArray.map(x => {
    //     //         const [type, lat, lon, name, ccode, tags] = x.split(',');
    //     //         const _tags = tags.split(';').filter(x => x);

    //     //         return {
    //     //             type,
    //     //             lat: parseFloat(lat),
    //     //             lon: parseFloat(lon),
    //     //             name,
    //     //             ccode,
    //     //             tags: _tags.length
    //     //                 ? _tags.map(y => {
    //     //                       const [tagId, value] = y.split(':');
    //     //                       return {
    //     //                           tagId,
    //     //                           value: value === '1' ? 'yes' : value,
    //     //                       };
    //     //                   })
    //     //                 : [],
    //     //         };
    //     //     });
    //     //     // setNodesX(b);

    //     //     RNFetchBlob.fs.readFile(dirs.DocumentDir + '/mypoi.json', 'utf8').then(dataMyPOIStr => {
    //     //         const dataArrayMyPOI = JSON.parse(dataMyPOIStr);
    //     //         console.log('READ File', dataArrayMyPOI.length);
    //     //         if (typeof dataArrayMyPOI === 'object' && dataArrayMyPOI?.length) {
    //     //             b.push(...dataArrayMyPOI);
    //     //             // setMyMarkers(dataArrayMyPOI);
    //     //         }
    //     //         setNodesX(b);
    //     //     });
    //     // });

    // }, []);

    useEffect(() => {
        //console.log(`markers.length=${nMarkers.length}, zoom=${zoomValue}, zoomFromStore=${zoomFromStore}`);
        if (nodesList.length > 10000) {
            setMarkers(nodesList.length);
        } else {
            // const filterAmenities = Object.keys(filterFromStore);
            // const markers: INode[] = [];
            // if (filterAmenities.length > 0 && !showCross) {
            //     console.log('filterAmenities: ', filterAmenities);
            //     const filteredNodes = nodesList;
            //     // .filter(
            //     //     sift({
            //     //         type: {$in: filterAmenities},
            //     //     }),
            //     // );
            //     console.log('filteredNodes:', filteredNodes.length);

            //     markers.push(...filteredNodes);
            // } else {
            //     markers.push(...nodesList); // .filter(t => ['pl', 'de', 'fr'].includes(t.ccode))
            // }

            const nMarkers = nodesList.map(x => {
                return {
                    _id: x._id.toHexString(),
                    lat: x.lat,
                    lon: x.lon,
                    type: x.type,
                };
            });

            setMarkers([...nMarkers]);
        }
        // setMarkers([...nMarkers]);

        // console.log(nodesList.length);
    }, [filterFromStore, nodesList, showCross]);

    const onChangeZoom = (newValueZoom: number) => {
        dispatch(setZoom(newValueZoom));
    };

    const [includeToArea, setIncludeToArea] = useState(false);

    const onMessageReceived = data => {
        // console.log(JSON.stringify(data));
        if (!data.data) {
            return;
        }

        switch (data.msg) {
            case 'ON_MOVE_END':
                // if (data.data.center.lat !== centerFromStore.lat && data.data.center.lng !== centerFromStore.lng) {
                // }
                data.data.bounds && dispatch(setBounds(data.data.bounds));
                if (data.data.zoom) {
                    onChangeZoom(data.data.zoom);
                }
                // console.log('Change center', data.data.center);
                data.data.center && dispatch(setCenter(data.data.center));
                break;
            case 'ON_CHOOSE_MARKER':
                // console.log('ON_CHOOSE_MARKER:::', data.data);
                dispatch(setActiveNode(data.data));

                navigation.navigate(ScreenKeys.NodeScreen, data.data);
                break;
            // case 'ON_SET_TYPE_NEW_NODE':
            //     widgetLocalMapCreateNodeRef.current?.onSetNewNodeType(data.data);
            //     break;
            case 'STATUS_INCLUDE_NEWPOINT_TO_AREA':
                // console.log('STATUS_INCLUDE_NEWPOINT_TO_AREA: ', data);
                setIncludeToArea(data.data.includeToArea);
                break;
            default:
                break;
        }
    };

    const bgColor = useMemo(() => {
        return colorScheme === 'dark' ? colors.s[900] : colors.w;
    }, [colorScheme]);

    const widgetMapCreateNodeRef = useRef<WidgetMapCreateNodeNodeRefProps>(null);

    const [typeNewNode, setTypeNewNode] = useState('');
    const onSetNewNodeType = useCallback((type: string) => {
        setTypeNewNode(type);
    }, []);

    const localePoints = useQuery(PointSchema);
    const pointsAllowArea = useMemo(() => {
        return localePoints.map(x => {
            return {
                lat: x.lat,
                lon: x.lon,
                acc: x.accuracy,
            };
        });
    }, [localePoints]);

    // const animationValue = useSharedValue({height: 0});
    // const animationStyle = useAnimatedStyle(() => {
    //     return {
    //         height: withTiming(animationValue.value.height, {
    //             duration: 300,
    //         }),
    //     };
    // });
    // const onSetShowCross = (status: boolean) => {
    //     setShowCross(status);
    //     animationValue.value = status ? {height: 300} : {height: 0};
    // };
    const existFilters = useMemo(() => Object.keys(filterFromStore) || [], [filterFromStore]);

    return (
        <View tw="flex-1 bg-white dark:bg-s-900">
            <View tw="flex-1">
                <LeafletView
                    mapMarkers={markers}
                    pointsAllowArea={pointsAllowArea}
                    // initMarkers={initMarkers}
                    bgColor={bgColor}
                    theme={colorScheme}
                    amenity={amenityFromStore}
                    typeNewNode={typeNewNode}
                    showCross={showCross}
                    gyroscope={360 - angle}
                    activeNode={activeNodeFromStore}
                    // mapCenterPosition={markers[0].position}
                    onMessageReceived={onMessageReceived}
                    myPosition={myPosition}
                    allowDistance={allowDistance}
                    mapCenterPosition={centerFromStore2 || DEFAULT_COORDINATE}
                    myPositionToCenter={myPositionToCenter}
                    zoom={zoomValue}
                    enableMagnet={enableMagnet}
                    source={props.source}
                    // source={{uri: 'file:///android_asset/map.html'}}
                    // startInLoadingState={true}
                    onError={er => {
                        console.log(er);
                    }}
                    doDebug={false}
                />
                <WidgetNotConnect />
                <View tw="absolute top-24 left-0 z-[999999]">
                    <Text tw=" bg-s-500">{JSON.stringify(textHeading)}</Text>
                </View>
            </View>
            {typeof markers === 'number' ? (
                <View tw="absolute top-28 left-6 right-6 z-50 bg-p-500 rounded-md p-2">
                    <Text tw="text-base leading-5 text-white">
                        {replaceRegexByArray(t('general:tooManyNodes'), [markers])}
                    </Text>
                </View>
            ) : null}
            {/* <Animated.View style={[animationStyle]}>
                <View tw="flex-1">
                    <UIButton
                        text="close"
                        type="default"
                        onPress={() => {
                            onSetShowCross(false);
                        }}
                    />
                </View>
            </Animated.View> */}

            {showCross ? (
                <WidgetMapCreateNode
                    ref={widgetMapCreateNodeRef}
                    setShowCross={setShowCross}
                    onSetNewNodeType={onSetNewNodeType}
                    zoom={zoomFromStore}
                    includeToArea={includeToArea}
                />
            ) : (
                <View tw="z-10 absolute top-6 w-full">
                    <View tw="flex-1 flex-row m-3 items-center bg-white dark:bg-s-950 rounded-xl shadow-lg shadow-black border-transparent">
                        <WidgetHeaderApp />
                        <View
                            tw={`flex-auto flex flex-row mx-3 rounded-lg pl-3 ${
                                queryString ? 'bg-p-500/10 dark:bg-white/10' : ''
                            }`}>
                            <View tw="flex-auto flex-row items-center">
                                <TouchableOpacity
                                    tw="w-full py-1.5"
                                    onPress={() =>
                                        navigation.navigate('MapFormSearchScreen', {
                                            queryString,
                                        })
                                    }>
                                    <Text
                                        tw={`text-base ${
                                            queryString ? 'font-bold text-p-500 dark:text-p-200' : 'text-s-500'
                                        }`}>
                                        {queryString ? queryString : t('general:searchText')}
                                    </Text>
                                    {/* <Text tw="text-black">{zoomFromStore}</Text> */}
                                </TouchableOpacity>
                            </View>
                            <View>
                                {queryString && (
                                    <UIButton
                                        type="default"
                                        twClass="p-1 border-0 bg-transparent"
                                        onPress={() => setQueryString('')}>
                                        <SIcon path={iClose} size={27} tw="text-s-900 dark:text-s-200" />
                                    </UIButton>
                                )}
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                tw={`p-3 rounded-r-lg ${existFilters.length ? 'bg-p-500' : ''}`}
                                onPress={async () => {
                                    navigation.navigate('MapLocalFilterScreen');
                                }}>
                                <SIcon
                                    path={iFilterFill}
                                    size={25}
                                    tw={` ${existFilters.length ? 'text-white' : 'text-black dark:text-s-200'}`}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* <TouchableOpacity tw="bg-p-300 dark:bg-p-800 p-2 rounded-r-md shadow-md" onPress={() => {}}>
                    <SIcon path={iAddMarker} size={20} tw="text-black dark:text-s-200" />
                    <Text tw="text-sm text-black dark:text-s-200">Добавить точку</Text>
                </TouchableOpacity> */}
                    </View>
                </View>
            )}

            <View tw="absolute left-3 bottom-1/3">
                <UIButton
                    type="default"
                    disabled={zoomFromStore >= 18}
                    twClass={`rounded-full shadow-lg shadow-black mb-2 border-transparent ${
                        zoomFromStore >= 18 ? 'opacity-50' : 'bg-white dark:bg-s-950'
                    }`}
                    onPress={() => {
                        setZoomValue(zoomFromStore + 1);
                    }}>
                    {/* <TouchableOpacity
                    tw="bg-white dark:bg-s-400 p-3 rounded-full shadow-md mb-2"
                    onPress={() => {
                        setZoomValue(zoomFromStore + 1);
                    }}> */}
                    <SIcon
                        path={iPlusLg}
                        size={32}
                        tw={` ${zoomFromStore >= 18 ? 'text-black dark:text-s-500' : 'text-black dark:text-s-100'}`}
                    />
                    {/* </TouchableOpacity> */}
                </UIButton>
                <UIButton
                    type="default"
                    disabled={zoomFromStore <= 2}
                    twClass={`rounded-full shadow-lg shadow-black mb-2 border-transparent ${
                        zoomFromStore <= 2 ? 'opacity-50' : 'bg-white dark:bg-s-950'
                    }`}
                    onPress={() => {
                        setZoomValue(zoomFromStore - 1);
                    }}>
                    {/* <TouchableOpacity
                    tw="bg-white dark:bg-s-400 p-3 rounded-full shadow-md"
                    onPress={() => {
                        setZoomValue(zoomFromStore - 1);
                    }}> */}
                    <SIcon
                        path={iMinusLg}
                        size={32}
                        tw={` ${zoomFromStore <= 2 ? 'text-black dark:text-s-500' : 'text-black dark:text-s-100'}`}
                    />
                    {/* </TouchableOpacity> */}
                </UIButton>
            </View>
            <View tw="absolute right-3 bottom-1/3">
                <View tw="mb-2">
                    <WidgetMapHeading onSetAngle={setAngle} onSetEnableMagnet={setEnableMagnet} />
                </View>
                <View tw="mb-2">
                    <WidgetMapLocation
                        center={centerFromStore}
                        onSetCenterAsMyPosition={onSetCenterAsMyPosition}
                        onChangeMyPosition={onChangeMyPosition}
                        onEnableLocation={setEnabledLocation}
                    />
                </View>
                {/* <TouchableOpacity tw="bg-white dark:bg-s-800 p-3 rounded-full shadow-md mb-2" onPress={async () => {}}>
                    <SIcon path={iLayout} size={32} tw="text-black dark:text-s-200" />
                </TouchableOpacity> */}
                <UIButton
                    type="primary"
                    // disabled={showCross}
                    twClass={`rounded-full shadow-lg shadow-black mb-2 border-transparent ${
                        showCross ? 'opacity-50' : ''
                    }`}
                    onPress={() => {
                        setShowCross(!showCross);
                        // animationValue.value = {height: 300};
                        !showCross && onSetNewNodeType('');
                        // if (enabledLocation) {
                        // } else {
                        //     Alert.alert('No GPS');
                        // }
                    }}>
                    {/* <TouchableOpacity
                        tw="p-3 rounded-full shadow-md bg-p-500 dark:bg-p-700"
                        onPress={() => {
                            // if (type === 'none') {
                            // } else {
                            setShowCross(!showCross);
                            !showCross && onSetNewNodeType('');
                            // }
                        }}> */}
                    <SIcon path={iAddMarker} size={32} tw="text-s-50 dark:text-s-100" />
                    {/* </TouchableOpacity> */}
                </UIButton>
            </View>
        </View>
    );
};

export default WidgetMap;
