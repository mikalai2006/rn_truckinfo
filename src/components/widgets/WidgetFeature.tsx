import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {feature, tokens, setFeature} from '~store/appSlice';
import PointStack from '~components/navigations/PointStack';
import RButton from '~components/r/RButton';

const WidgetFeature = () => {
    const featureData = useAppSelector(feature);
    const tokenData = useAppSelector(tokens);
    const dispatch = useAppDispatch();

    const [reviews, setReviews] = useState([]);
    const onGetReview = async () => {
        return await fetch(
            'http://localhost:8000/api/v1/review/?' +
                new URLSearchParams({
                    geoId: featureData.id,
                }),
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            },
        )
            .then(r => r.json())
            .then(response => {
                console.log('response.data=', response);
                setReviews(response.data);
            })
            .catch(e => {
                throw e;
            });
    };

    // useEffect(() => {
    //     console.log('Change feature', featureData?.id);
    //     if (featureData) {
    //         onGetReview();
    //     }
    // }, [featureData]);

    return (
        <View tw=" absolute top-0 bottom-0 z-10 bg-s-100 dark:bg-s-800 w-full">
            <PointStack />
            <RButton onPress={() => dispatch(setFeature(null))} label="Close" />
        </View>
    );
};

export default WidgetFeature;
