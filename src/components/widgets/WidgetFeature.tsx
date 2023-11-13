import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {feature, setActiveNode, setActiveMarkerConfig, activeNode, markerConfig, amenities} from '~store/appSlice';
// import PointStack from '~components/navigations/PointStack';
// import RButton from '~components/r/RButton';
import {markerdata} from '~utils/markerdata';

import SIcon from '~components/ui/SIcon';
import {SSkeleton} from '~components/ui/SSkeleton';

const WidgetFeature = () => {
    const dispatch = useAppDispatch();
    const featureFromStore = useAppSelector(feature);
    const markerConfigFromStore = useAppSelector(markerConfig);
    const activeNodeFromStore = useAppSelector(activeNode);
    const amenityStore = useAppSelector(amenities);
    // const [markerConfig, setMarkerConfig] = useState<IMarkerConfig | null>(null);

    // const [data, setData] = useState(initialData);
    // const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    console.log('WidgetFeature: isLoading=', isLoading);

    useEffect(() => {
        const onGetNodeInfo = async () => {
            setIsError(false);
            setError('');
            setIsLoading(true);
            try {
                await fetch(
                    'http://localhost:8000/api/v1/gql/query?' +
                        new URLSearchParams({
                            lang: 'ru',
                        }),
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            // Authorization: `Bearer ${tokenData.access_token}`,
                        },
                        // node(id: "${featureFromStore?.id}") {
                        body: JSON.stringify({
                            query: `
                            query findNodeInfo($lat: Float, $lon:Float) {
                              node(lat: $lat, lon: $lon) {
                                id
                                osmId
                                type
                                lat
                                lon
                                props
                                name
                                createdAt
                                updatedAt
                                user {
                                    id
                                    name
                                    login
                                    online
                                    images {
                                        id
                                        userId
                                        service
                                        serviceId
                                        path
                                        ext
                                        title
                                        dir
                                    }
                                }
                                data{
                                    id
                                    value
                                    status
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
                                    updatedAt
                                }
                                reviewsInfo {
                                  count
                                  value
                                  ratings
                                }
                                address {
                                  dAddress
                                }
                              }
                            }
                        `,
                            variables: {
                                lat: featureFromStore?.lat,
                                lon: featureFromStore?.lon,
                            },
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        // console.log('activeMarker=', response);
                        const {node} = response.data;
                        const {type} = node;
                        const c = markerdata.find(x => x.type === type) || null;
                        dispatch(setActiveMarkerConfig(c));
                        dispatch(setActiveNode(response.data.node));
                    })
                    .catch(e => {
                        throw e;
                    });
            } catch (e) {
                setIsError(true);
                setError(e?.message);
            } finally {
                setIsLoading(false);
            }
        };
        if (featureFromStore?.id) {
            // setTimeout(onGetNodeInfo, 100);
            onGetNodeInfo();
        }
    }, [dispatch, featureFromStore?.id]);

    // useEffect(() => {
    //     if (activeMarkerData === null) {
    //         return;
    //     }

    //     const {type} = activeMarkerData;
    //     const currentMarkerDataX = markerdata.find(x => x.type === type);
    //     setMarkerConfig(currentMarkerDataX);
    // }, [activeMarkerData]);

    // const [reviews, setReviews] = useState([]);
    // const onGetReview = async () => {
    //     return await fetch(
    //         'http://localhost:8000/api/v1/review/?' +
    //             new URLSearchParams({
    //                 osmId: featureData.id,
    //             }),
    //         {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${tokenData.access_token}`,
    //             },
    //         },
    //     )
    //         .then(r => r.json())
    //         .then(response => {
    //             console.log('response.data=', response);
    //             setReviews(response.data);
    //         })
    //         .catch(e => {
    //             throw e;
    //         });
    // };

    // useEffect(() => {
    //     console.log('Change feature', featureData?.id);
    //     if (featureData) {
    //         onGetReview();
    //     }
    // }, [featureData]);

    // const [ratesValue, setRateValue] = useState([]);
    // // const [rate, setRate] = useState(0);
    // useEffect(() => {
    //     const rates = () => {
    //         const r = [];
    //         for (let i = 0; i < 5; i++) {
    //             r.push(<SRate value={i} count={ratings[i]} maxRate={Math.max.apply(null, Object.values(ratings))} />);
    //         }
    //         return r;
    //     };
    //     console.log('change rates');
    //     const v = rates();
    //     setRateValue(v);
    // }, []);

    return (
        <View tw="px-4">
            {/* <PointStack /> */}
            {isError ? (
                <Text tw="text-red-500">{error} ...</Text>
            ) : (
                <>
                    <View tw="pt-4 flex flex-row flex-nowrap items-center gap-x-4">
                        <View tw="w-12 h-12">
                            {isLoading ? (
                                <SSkeleton classString="flex-1" />
                            ) : (
                                <View
                                    tw="p-2 rounded-lg"
                                    style={{
                                        backgroundColor: markerConfigFromStore?.bgColor,
                                    }}>
                                    <SIcon
                                        style={{
                                            color: markerConfigFromStore?.iconColor,
                                        }}
                                        size={30}
                                        path={markerConfigFromStore?.icon}
                                    />
                                </View>
                            )}
                        </View>
                        <View tw="flex-auto">
                            {isLoading ? (
                                <>
                                    <SSkeleton classString="h-4" />
                                </>
                            ) : (
                                activeNodeFromStore && (
                                    <Text tw="text-sm leading-4 text-s-600 dark:text-s-400">
                                        {amenityStore[activeNodeFromStore.type]?.title}
                                    </Text>
                                )
                            )}
                            {isLoading ? (
                                <>
                                    <SSkeleton classString="h-4" width={'100%'} />
                                    <SSkeleton classString="h-4 my-1" width={'80%'} />
                                </>
                            ) : (
                                <>
                                    <Text numberOfLines={1} tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                                        {activeNodeFromStore?.name || activeNodeFromStore?.address?.props?.title}
                                    </Text>
                                    <Text numberOfLines={1} tw="text-xs leading-4 text-s-900 dark:text-s-100">
                                        Updated {activeNodeFromStore?.updatedAt}
                                    </Text>
                                    {/* <Text tw="text-xl leading-6 font-bold text-s-900 dark:text-s-100">
                                        {activeNodeFromStore?.address?.props?.subtitle !== ''
                                            ? `${activeNodeFromStore?.address?.props?.subtitle}`
                                            : ''}
                                    </Text> */}
                                </>
                            )}
                            {/* {isLoading ? (
                                <>
                                    <SSkeleton classString="h-4" />
                                    <SSkeleton classString="h-4 mt-2" width={'60%'} />
                                    <SSkeleton classString="h-4 mt-2" width={'80%'} />
                                    <SSkeleton classString="h-4 mt-2" width={'90%'} />
                                </>
                            ) : (
                                <Text tw="text-lg leading-6 text-s-600 dark:text-s-400">
                                    {activeNodeFromStore?.address?.dAddress}
                                </Text>
                            )} */}
                        </View>
                    </View>
                </>
            )}
            {/* <RButton onPress={() => dispatch(setFeature(null))} label="Close" /> */}
        </View>
    );
};

export default WidgetFeature;
