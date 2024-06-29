import {View, Text} from 'react-native';
import React from 'react';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';
import {useTranslation} from 'react-i18next';
import SIcon from '~components/ui/SIcon';
import {iNoWifi} from '~utils/icons';

const WidgetNoConnect = () => {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();

    return (
        <View tw="flex-1 absolute top-0 right-0 left-0 bottom-0 items-stretch">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <View tw="absolute top-0 right-0 left-0 bottom-0 bg-black opacity-50 " />
            <View tw="p-4 pt-10 bg-red-500 flex flex-row gap-x-4">
                <SIcon path={iNoWifi} size={30} tw="text-white" />
                <View tw="flex-auto">
                    <Text tw="text-white text-lg leading-5">{t('general:noConnect')}</Text>
                </View>
            </View>
        </View>
    );
};

export default WidgetNoConnect;
