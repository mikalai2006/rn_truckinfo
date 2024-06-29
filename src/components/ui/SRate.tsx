import {View, Text} from 'react-native';
import React from 'react';

const SRate = props => {
    // console.log('SRate');
    const {value, count, maxRate} = props;

    const width = maxRate > 0 ? (count * 100) / maxRate : 0;

    return (
        <View tw="flex flex-row items-center">
            <View>
                <Text tw="px-2 text-s-500">{value}</Text>
            </View>
            <View tw="" style={{width: '70%'}}>
                <View tw="bg-s-200 dark:bg-s-700 h-2 rounded-md" style={{width: `100%`}} />
                <View tw="absolute top-0 left-0 bg-yellow-500 h-2 rounded-md" style={{width: `${width}%`}} />
            </View>
            <View>
                <Text tw="pl-2 text-s-500">{count > 0 ? `(${count})` : ''}</Text>
            </View>
        </View>
    );
};

export default SRate;
