import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {activeNode, feature} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import SReview from '~components/ui/SReview';

const WidgetListReview = () => {
    console.log('WidgetListReview');

    const activeNodeFromStore = useAppSelector(activeNode);
    const dispatch = useAppDispatch();
    const featureFromStore = useAppSelector(feature);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');
    const [reviews, setReviews] = useState([]);

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
                setIsError(true);
                setError(e?.message);
            }
        };
        if (featureFromStore?.osmId) {
            onGetNodeInfo();
        }
    }, [dispatch, featureFromStore?.osmId]);

    let reviewsComponents = [];
    if (reviews.length > 0) {
        reviewsComponents = reviews?.map((el, i) => (
            <View key={i.toString()} tw="flex-none p-2 border-b border-s-300 dark:border-s-700">
                <SReview review={el?.node} />
            </View>
        ));
    }

    return <View>{reviewsComponents}</View>;
};

export default WidgetListReview;
