import {View, Text, ScrollView} from 'react-native';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {langCode, languages} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RTitle from '~components/r/RTitle';
import {NavigationProp} from '@react-navigation/native';

import useLanguage from '~hooks/useLanguage';
import SIcon from '~components/ui/SIcon';
import {iCheck} from '~utils/icons';
import UIButton from '~components/ui/UIButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const SettingLangScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const activeLangCode = useAppSelector(langCode);
    const languageFromStore = useAppSelector(languages);
    const allLanguages = useMemo(() => languageFromStore, [languageFromStore]);
    // const navigation = useNavigation();

    const {onChooseLanguage} = useLanguage();
    // const allLanguages = Object.keys(languages);
    // if (activeLangCode === '') {
    //     chooseLanguage(allLanguages[0]);
    // }

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950 border-b border-s-200 dark:border-s-900">
            <View tw="pt-4 flex-auto">
                <View tw="px-6 pb-0">
                    <RTitle text={t('general:lang')} />
                </View>
                <ScrollView tw="flex-auto px-6">
                    {allLanguages.map(lang => {
                        return (
                            <UIButton
                                type={lang.code === activeLangCode ? 'primary' : 'default'}
                                disabled={false}
                                key={lang.id}
                                twClass="mt-3"
                                onPress={() => onChooseLanguage(lang.code)}>
                                <View tw="flex-1 flex flex-row items-center">
                                    <View tw="flex-auto">
                                        <Text
                                            tw={`text-xl ${
                                                lang.code === activeLangCode
                                                    ? 'text-white'
                                                    : 'text-black dark:text-white'
                                            }`}>
                                            {lang.name}
                                        </Text>
                                    </View>
                                    <View>
                                        {lang.code === activeLangCode && (
                                            <SIcon path={iCheck} size={22} tw="text-p-500" />
                                        )}
                                    </View>
                                </View>
                            </UIButton>
                        );
                    })}
                </ScrollView>
            </View>
            <View tw="p-6">
                <UIButton type="default" text={t('general:back')} onPress={() => navigation.goBack()} />
            </View>
        </SafeAreaView>
    );
};

export default SettingLangScreen;
