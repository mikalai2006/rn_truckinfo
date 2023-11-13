import {ScrollView, View} from 'react-native';
import React from 'react';
// import WidgetListReview from '~components/widgets/WidgetListReview';
import WidgetNodeRating from '~components/widgets/WidgetNodeRating';
import WidgetListReviewFetch from '~components/widgets/WidgetListReviewFetch';

const ReviewScreen = () => {
    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-800">
            {/* <WidgetAddReview /> */}
            <View tw="py-2">
                <WidgetNodeRating />
            </View>
            <View tw="flex-1">
                <WidgetListReviewFetch />
            </View>
        </View>
    );
};

export default ReviewScreen;
