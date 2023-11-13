import {View, Text} from 'react-native';
import React from 'react';
import {IReview} from '~store/appSlice';
import SRateStar from './SRateStar';
import RImage from '~components/r/RImage';

export interface IReviewProps {
    review: IReview;
}

export default function SReview({review}: IReviewProps) {
    console.log('SReview');
    return (
        <View>
            <View tw="flex flex-row items-center">
                <RImage
                    uri="https://i.etsystatic.com/44411218/r/il/17530f/5202775231/il_300x300.5202775231_jm0p.jpg"
                    classString="h-8 w-8 rounded-full mr-2"
                />
                <View tw="self-start">
                    <Text tw="text-lg text-s-400">Mikalai Parakhnevich</Text>
                    <View tw="flex flex-row items-center space-x-4">
                        <SRateStar value={review.rate} />
                        <Text tw="text-lg text-s-400">3 day before</Text>
                    </View>
                </View>
            </View>
            <Text tw="text-base text-s-900 dark:text-s-200 leading-5">{review.review}</Text>
        </View>
    );
}
