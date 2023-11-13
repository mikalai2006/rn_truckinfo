import {View, Text} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

const WidgetNodeVisited = () => {
    const {t} = useTranslation();

    return (
        <View tw="h-16 p-2 flex flex-row justify-center items-end gap-x-2">
            {[12, 15, 23, 44, 15, 25, 40].map((el, i) => {
                return (
                    <View style={{width: '10%'}} key={i.toString()}>
                        <Text tw="text-center">{el}</Text>
                        <View tw="w-full bg-s-500" style={{height: `${el}%`}}></View>
                        <Text tw="text-center">{t(`general:weekShort:${i}`)}</Text>
                    </View>
                );
            })}
        </View>
    );
};

export default WidgetNodeVisited;
