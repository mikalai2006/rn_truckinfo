import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {feature} from '~store/appSlice';
import WidgetNodeRatingShort from '~components/widgets/WidgetNodeRatingShort';
import WidgetNodeLikes from '~components/widgets/WidgetNodeLikes';
import WidgetNodeTagsLine from '~components/widgets/WidgetNodeTagsLine';
import WidgetNodeVisited from '~components/widgets/WidgetNodeVisited';
import WidgetNodeVisitedTime from '~components/widgets/WidgetNodeVisitedTime';
import WidgetNodeAddress from '~components/widgets/WidgetNodeAddress';

const PointScreen = () => {
    // const featureData = useAppSelector(feature);
    return (
        <ScrollView tw="flex-1 bg-s-100 dark:bg-s-800">
            {/* <Text>{JSON.stringify(featureData)}</Text> */}
            <WidgetNodeAddress />
            <WidgetNodeRatingShort />
            <WidgetNodeLikes />
            <WidgetNodeTagsLine />
            {/* <WidgetNodeImagesLine /> */}
            {/* <WidgetNodeVisited />
            <WidgetNodeVisitedTime /> */}
        </ScrollView>
    );
};

export default PointScreen;
