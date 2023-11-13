import {View} from 'react-native';
import React from 'react';
import WidgetNodeVisited from '~components/widgets/WidgetNodeVisited';
import WidgetNodeVisitedTime from '~components/widgets/WidgetNodeVisitedTime';

const StatScreen = () => {
    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-800">
            <WidgetNodeVisited />
            <WidgetNodeVisitedTime />
        </View>
    );
};

export default StatScreen;
