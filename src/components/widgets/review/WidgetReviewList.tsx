import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {HOST_API} from '@env';

import {useTranslation} from 'react-i18next';

import {useQuery, useRealm} from '@realm/react';
import {BSON, UpdateMode} from 'realm';
import {ReviewSchema, TReviewSchema} from '~schema/ReviewSchema';
import {INode, IReview, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import {useFetchWithAuth} from '~hooks/useFetchWithAuth';
// import {BottomSheetFlatList, useBottomSheet} from '@gorhom/bottom-sheet';
import SReview from '~components/ui/SReview';
// import {runOnJS, useAnimatedReaction} from 'react-native-reanimated';
import {SSkeleton} from '~components/ui/SSkeleton';
import UIButton from '~components/ui/UIButton';
import {FlatList} from 'react-native-gesture-handler';

export interface IPageInfo {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
}
export interface IReviewsData {
    list: IReview[];
    pageInfo?: IPageInfo;
}

type Props = {
    lid: string;
    serverNode: INode;
};

const WidgetReviewList = (props: Props) => {
    const {lid, serverNode} = props;

    const {t} = useTranslation();
    const userFromStore = useAppSelector(user);

    // const {animatedIndex} = useBottomSheet();
    // const [isShowAll, setIsShowAll] = useState(false);
    // useAnimatedReaction(
    //     () => {
    //         return animatedIndex.value > 0.8;
    //     },
    //     v => {
    //         // 'worklet';

    //         if (v && !isShowAll) {
    //             runOnJS(setIsShowAll)(true);
    //         }
    //     },
    // );

    const localReviews = useQuery(ReviewSchema, items => {
        return items.filtered('nlid == $0', lid);
    });

    const [serverReviews, setServerReviews] = useState<IReviewsData>({list: []});
    // const [lastPageInfo, setLastPageInfo] = useState<IPageInfo | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const {onFetchWithAuth} = useFetchWithAuth();
    const realm = useRealm();

    // const ignore = useRef(false);
    const onGetReviews = useCallback(async () => {
        // setError('');
        // setIsLoading(true);
        try {
            await onFetchWithAuth(
                HOST_API +
                    '/gql/query?' +
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
                    body: JSON.stringify({
                        query: `query($after: ID, $first:Int, $nodeId: String) {
                            reviewsConnection(after: $after, first: $first, input: { nodeId: $nodeId }) {
                                edges {
                                    node {
                                        id
                                        userId
                                        nodeId
                                        rate
                                        review
                                        createdAt
                                        updatedAt
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
                                    cursor
                                }
                                pageInfo {
                                    startCursor
                                    endCursor
                                    hasNextPage
                                }
                            }
                        }
                    `,
                        variables: {
                            first: 5,
                            nodeId: serverNode?.id,
                            after: serverReviews.pageInfo?.endCursor || '',
                        },
                    }),
                },
            )
                .then(r => r.json())
                .then(response => {
                    // if (!ignore.current) {
                    // setIsLoading(false);
                    const pageInfo = response.data?.reviewsConnection?.pageInfo;
                    const responseReviews = response.data?.reviewsConnection?.edges;

                    if (responseReviews) {
                        const allReviews: IReview[] = responseReviews.map(x => x.node);
                        const myReview = allReviews.find(x => x.userId === userFromStore?.id);
                        // add my review to local db
                        if (myReview && localReviews.length === 0) {
                            realm.write(() => {
                                const newData: TReviewSchema = {
                                    rate: myReview.rate,
                                    oldRate: myReview.rate,
                                    review: myReview.review,
                                    nlid: lid,
                                    nodeId: myReview.nodeId,
                                    updatedAt: myReview.updatedAt,
                                    isLocal: false,
                                };
                                realm.create(
                                    ReviewSchema,
                                    {
                                        ...newData,
                                        _id: localReviews[0]?._id || new BSON.ObjectId(),
                                    },
                                    UpdateMode.Modified,
                                );
                            });
                        }
                        setServerReviews({list: [...serverReviews.list, ...allReviews], pageInfo});
                        // setLastPageInfo(pageInfo);
                    }
                    // }
                })
                .catch(e => {
                    throw e;
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } catch (e) {
            // setError(e?.message);
            setIsLoading(false);
        }
    }, [lid, localReviews, serverNode?.id, serverReviews, userFromStore?.id]);

    useEffect(() => {
        // if (isShowAll) {
        if (serverNode?.id) {
            // && !ignore.current
            setTimeout(() => {
                onGetReviews();
            }, 1000);
        } else {
            setIsLoading(false);
        }
        // }

        return () => {
            // ignore.current = true;
        };
    }, []);

    const footerComponents = () => (
        <View tw="px-4 pb-4">
            {/* <Text>{JSON.stringify(serverReviews.pageInfo)}</Text> */}
            {serverReviews.pageInfo?.hasNextPage ? (
                <UIButton
                    type="default"
                    text={t('general:moreReviews')}
                    onPress={() => {
                        onGetReviews();
                    }}
                />
            ) : null}
        </View>
    );

    const renderReview = ({item}: {item: IReview}) => (
        <View>
            {/* <Text>{JSON.stringify(item)}</Text> */}
            <SReview review={item} />
        </View>
    );

    // console.log('localReviews: ', localReviews);

    const reviews = useMemo(() => {
        const result = [...serverReviews.list];

        // const existReviewsIds = result.map(x => x.nodeId);
        // console.log('existReviewsIds=', existReviewsIds);
        if (serverNode) {
            const myReviewIndex = result.findIndex(x => x.userId === userFromStore?.id);
            if (myReviewIndex !== -1) {
                result[myReviewIndex].review = localReviews[0].review;
                result[myReviewIndex].rate = localReviews[0].rate;
                result[myReviewIndex].updatedAt = localReviews[0].updatedAt;
            }
        } else {
            let localReviewsList: TReviewSchema[] = [...localReviews];
            if (userFromStore) {
                localReviewsList = localReviewsList.map(x => {
                    return {
                        ...x,
                        id: x?.id || x._id,
                        user: userFromStore,
                    };
                });
            }
            result.push(...localReviewsList);
        }
        return result;
    }, [localReviews, serverNode, serverReviews, userFromStore]);

    return (
        <View tw="flex-1 mt-3">
            {isLoading ? (
                [1, 2, 3, 4, 5, 6, 7].map(x => (
                    <View key={x.toString()} tw="pb-6">
                        <View tw="flex flex-row px-4">
                            <View tw="w-16">
                                <SSkeleton classString="w-12 h-12 rounded-full mr-4" />
                            </View>
                            <View tw="flex-auto flex">
                                <SSkeleton classString="h-12 rounded-xl" />
                                <SSkeleton classString="self-end h-4 mt-2" width={'80%'} />
                            </View>
                        </View>
                    </View>
                ))
            ) : reviews ? (
                <FlatList
                    data={reviews}
                    keyExtractor={item => item.id}
                    renderItem={renderReview}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    // onEndReachedThreshold={0.01}
                    // onEndReached={() => {
                    //     console.log('End list');
                    // }}
                    ListFooterComponent={footerComponents}
                />
            ) : null}
        </View>
    );
};

export default WidgetReviewList;
