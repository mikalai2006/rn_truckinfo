import React from 'react';
// import {useColorScheme} from 'nativewind';
import {Text, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import RButton from '~components/r/RButton';
import SIcon from '~components/ui/SIcon';
import {iQuestion} from '~utils/icons';
import {useAppSelector} from '~store/hooks';
import {langCode} from '~store/appSlice';

export default function WidgetAppInfo() {
    // const {colorScheme} = useColorScheme();
    const langCodeFromStore = useAppSelector(langCode);
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
        <View>
            <Text tw="text-s-800 dark:text-s-200 text-3xl leading-10 font-extrabold">{t('general:appTitle')}</Text>
            <Text tw="text-s-600 dark:text-s-400 text-base leading-5">{t('general:appDescription')}</Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Onboarding');
                }}>
                <Text tw="underline text-base text-black dark:text-white">
                    {t('general:authBonuses')}/{JSON.stringify(langCodeFromStore)}
                </Text>
            </TouchableOpacity>
            <View tw="mt-2 flex flex-row">
                <View tw="flex-auto">
                    <RButton
                        disabled={false}
                        text={t('general:gotoMap')}
                        onPress={() => {
                            //setModalVisible(!modalVisible)
                            navigation.navigate('MapLocalStack');
                        }}
                    />
                </View>
                <TouchableOpacity onPress={() => {}} tw="flex-none p-4 ml-4 rounded-lg">
                    <SIcon path={iQuestion} size={25} tw="text-black dark:text-s-200" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
