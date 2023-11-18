import React, {useCallback, useEffect, useRef, useState} from 'react';

import WidgetFeature from '../widgets/WidgetFeature';
import SBottomSheet, {BottomSheetRefProps} from '../ui/SBottomSheet';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {INode, activeLanguage, setActiveNode, setFeature} from '~store/appSlice';

import WidgetNodeRatingShort from '../widgets/WidgetNodeRatingShort';
import {ScrollView} from 'react-native-gesture-handler';
import WidgetNodeTagsLine from '../widgets/WidgetNodeTagsLine';
import WidgetNodeVisited from '../widgets/WidgetNodeVisited';
import WidgetNodeVisitedTime from '../widgets/WidgetNodeVisitedTime';
import RButton from '~components/r/RButton';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import WidgetNodeGeo from '../widgets/WidgetNodeGeo';
import {SSkeleton} from '~components/ui/SSkeleton';
import WidgetNodeImages from '~components/widgets/WidgetNodeImages';

const MarkerScreen = props => {
    console.log('MarkerScreen render');

    const {t} = useTranslation();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const closeSheet = () => {
        //     webviewRef.current?.injectJavaScript(
        //         `(function() {
        //     document.dispatchEvent(new MessageEvent('message',
        //       ${JSON.stringify({
        //           data: {
        //               event: 'closenode',
        //               status: false,
        //           },
        //       })}));
        //   })();
        //   `,
        //     );
        // onClose && onClose();
        dispatch(setFeature(null));
        dispatch(setActiveNode(null));
        navigation && navigation.goBack();
    };

    const markerData = props.route.params.marker; //useAppSelector(feature);
    // const activeNodeData = useAppSelector(activeNode);
    const ref = useRef<BottomSheetRefProps>(null);
    const snapPoints = [0, -300, -600];
    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(snapPoints[1]);
        }
    }, []);

    // useEffect(() => {
    //     if (markerData?.id) {
    //         console.log('Change feature', markerData?.id);
    //         // navigation.navigate('PointStack');
    //         // bottomSheetModalRef.current?.present();
    //         onPress();
    //     }
    // }, [markerData, onPress]);

    const [node, setNode] = useState<INode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    console.log('MarkerScreen: isLoading=', isLoading);
    const activeLanguageFromStore = useAppSelector(activeLanguage);

    useEffect(() => {
        const onGetNodeInfo = async () => {
            setIsError(false);
            setError('');
            setIsLoading(true);
            onPress();
            try {
                await fetch(
                    'http://localhost:8000/api/v1/gql/query?' +
                        new URLSearchParams({
                            lang: activeLanguageFromStore?.code || 'en',
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
                                lat: markerData?.lat,
                                lon: markerData?.lon,
                            },
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        // console.log('activeMarker=', response);
                        setNode(response.data.node);
                        // const {node} = response.data;
                        // const {type} = node;
                        // const c = markerdata.find(x => x.type === type) || null;
                        // dispatch(setActiveMarkerConfig(c));
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

        console.log('Load marker', markerData);
        if (markerData?.id) {
            // setTimeout(onGetNodeInfo, 100);
            onGetNodeInfo();
        }
    }, [activeLanguageFromStore?.code, dispatch, markerData, onPress]);

    // if (!node) {
    //     return <Text tw="text-red-500">{error} ...</Text>;
    // }

    return (
        <SBottomSheet
            ref={ref}
            // key={featureData?.id}
            onClose={() => {
                closeSheet();
            }}
            snapPoints={snapPoints}
            topheader={<WidgetNodeImages node={node} />}>
            {isError ? (
                <Text tw="text-red-500">{error} ...</Text>
            ) : node?.id ? (
                <>
                    {/* <View tw="p-2 flex flex-row gap-x-2">
                            <View>
                                <RButton customClass="bg-s-700 p-3 rounded-full">
                                    <SIcon path={iCamera} size={25} tw="text-white" />
                                </RButton>
                            </View>
                            <View tw="flex-auto self-start" />
                            <View>
                                <RButton customClass="bg-s-800 p-3 rounded-full">
                                    <SIcon path={iHeart} size={25} tw="text-white" />
                                </RButton>
                            </View>
                            <View>
                                <RButton customClass="bg-s-800 p-3 rounded-t-md">
                                    <SIcon path={iWarning} size={25} tw="text-white" />
                                </RButton>
                            </View>
                        </View> */}
                    <WidgetFeature node={node} />
                    {/* <Text>translateY={ref.current?.translateY?.value}</Text> */}
                    <View tw="py-1 px-4">
                        <WidgetNodeRatingShort />
                    </View>
                    {/* <WidgetNodeLikes /> */}
                    <ScrollView tw="flex-1">
                        <WidgetNodeTagsLine />
                        {/* <WidgetNodeImagesLine /> */}
                        <WidgetNodeVisited />
                        <WidgetNodeVisitedTime />
                        {/* <WidgetNodeButtons /> */}
                    </ScrollView>
                    <View tw="border-y border-black/10">
                        <WidgetNodeGeo />
                    </View>
                    {/* <WidgetNodeRating /> */}
                    {/* <ScrollView>
                                <WidgetAddReview />
                                <WidgetListReview />
                            </ScrollView> */}
                    {/* <PointStack navigation={false} index={1} /> */}
                    <View tw="px-4">
                        <RButton onPress={() => navigation.navigate('PointStack')}>
                            <Text tw="text-xl text-white">{t('general:more')}</Text>
                        </RButton>
                    </View>
                </>
            ) : (
                <View tw="pt-6">
                    <View tw="flex flex-row px-6">
                        <View tw="w-16">
                            <SSkeleton classString="w-12 h-12 mr-4" />
                        </View>
                        <View tw="flex-auto">
                            <SSkeleton classString="h-4" />
                            <SSkeleton classString="h-4 mt-2" width={'80%'} />
                        </View>
                    </View>
                    <View tw="px-6">
                        <SSkeleton classString="h-6 mt-2" />
                    </View>
                    <View tw="px-6 flex flex-row flex-wrap">
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2" width={'32%'} />

                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2" width={'32%'} />
                    </View>
                </View>
            )}
        </SBottomSheet>
    );
};

export default MarkerScreen;
