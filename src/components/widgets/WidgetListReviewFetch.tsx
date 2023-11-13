import {FlatList, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {feature} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import SReview from '~components/ui/SReview';

const WidgetListReviewFetch = () => {
    const dispatch = useAppDispatch();
    const featureFromStore = useAppSelector(feature);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);
    console.log('WidgetListReviewFetch', reviews.length, isLoading, error);

    useEffect(() => {
        const onGetNodeInfo = async () => {
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
                        body: JSON.stringify({
                            query: `query {
                                reviewsConnection(limit: 10, input: { osmId: "${featureFromStore?.osmId}" }) {
                                    edges {
                                        node {
                                             _id
                                            userId
                                            osmId
                                            rate
                                            review
                                            createdAt
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
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        // console.log('activeMarker=', response);
                        setIsLoading(false);
                        setReviews(response.data.reviewsConnection.edges);
                    })
                    .catch(e => {
                        throw e;
                    });
            } catch (e) {
                setError(e?.message);
                setIsLoading(false);
            }
        };
        if (featureFromStore?.osmId) {
            onGetNodeInfo();
        }
    }, [dispatch, featureFromStore?.osmId]);

    return reviews.length > 0 ? (
        <View tw="flex-1">
            <FlatList
                data={reviews}
                // onViewableItemsChanged={({viewableItems}) => {
                //     console.log(viewableItems);
                // }}
                initialNumToRender={4}
                renderItem={({item, index}) => (
                    <View key={index.toString()} tw="flex-none p-2 border-b border-s-300 dark:border-s-700">
                        <SReview review={item?.node} />
                    </View>
                )}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    ) : (
        ''
    );
};

export default WidgetListReviewFetch;
