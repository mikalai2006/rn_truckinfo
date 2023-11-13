import {View, Text} from 'react-native';
import React from 'react';

const WidgetNodeVisitedTime = () => {
    const arrayTimes = [10, 12, 4, 6, 18, 30, 32, 44, 36, 8, 10, 22];

    return (
        <View tw="h-16 p-2 flex flex-row justify-center items-end gap-x-0.5">
            {arrayTimes.map((el, i) => {
                return (
                    <View style={{width: `${100 / 13}%`}} key={i.toString()}>
                        {/* <Text tw="text-center">{el}</Text> */}
                        <View tw="w-full bg-s-500" style={{height: `${el}%`}}></View>
                        <Text tw="text-center">{i * 2}</Text>
                    </View>
                );
            })}
        </View>
    );
};

export default WidgetNodeVisitedTime;
