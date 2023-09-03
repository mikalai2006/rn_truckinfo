import {Text} from 'react-native';
import React from 'react';

const RTitle = ({text}: {text: string}) => {
    return <Text tw=" pb-4 text-3xl font-bold text-s-600 dark:text-s-200">{text}</Text>;
};

export default RTitle;
