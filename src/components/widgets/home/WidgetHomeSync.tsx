import React from 'react';
import {StyledComponent, styled, useColorScheme} from 'nativewind';
import {Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native';

import colors from '../../../utils/colors';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import RButton from '~components/r/RButton';
import {ScreenKeys} from '~components/screens';

export default function WidgetHomeSync() {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
        <View tw="p-6 flex-1 flex-col items-justify">
            <View tw="flex-auto">
                <Text tw="text-s-700 dark:text-s-400 text-lg leading-6">{t('general:authSync')}</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Onboarding');
                    }}>
                    {/* <Text tw="underline text-base text-black dark:text-white pt-2">{t('general:authBonuses')}</Text> */}
                </TouchableOpacity>
            </View>
            <View tw="pt-6">
                <RButton
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
