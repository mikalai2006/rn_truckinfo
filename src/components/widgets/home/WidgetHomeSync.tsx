import React from 'react';
import {useColorScheme} from 'nativewind';
import {Text, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import UIButton from '~components/ui/UIButton';

export default function WidgetHomeSync() {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
        <View tw="flex-col items-justify">
            <View tw="flex-auto">
                <Text tw="text-s-700 dark:text-s-400 text-base leading-5">{t('general:authSync')}</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Onboarding');
                    }}>
                    {/* <Text tw="underline text-base text-black dark:text-white pt-2">{t('general:authBonuses')}</Text> */}
                </TouchableOpacity>
            </View>
            <View tw="pt-6">
                <UIButton
                    type="primary"
                    disabled={false}
                    text={t('general:syncButton')}
                    onPress={() => {
                        //setModalVisible(!modalVisible)
                        navigation.navigate('SyncScreen');
                    }}
                />
            </View>
        </View>
    );
}
