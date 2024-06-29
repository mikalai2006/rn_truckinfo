import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {activeLanguage, langCode} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RTitle from '~components/r/RTitle';
import {NavigationProp} from '@react-navigation/native';

import languages from '~localization/languages';
import useLanguage from '~hooks/useLanguage';
import SIcon from '~components/ui/SIcon';
import {iCheck} from '~utils/icons';
import UIButton from '~components/ui/UIButton';

const LanguageScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const activeLangCode = useAppSelector(langCode);
    const activeLanguageFromStore = useAppSelector(activeLanguage);
    // const navigation = useNavigation();

    const {onChooseLanguage} = useLanguage();
    const allLanguages = Object.keys(languages);
    // if (activeLangCode === '') {
    //     chooseLanguage(allLanguages[0]);
    // }

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-900">
            <View tw="flex-1 items-stretch justify-center flex gap-4 bg-s-100 dark:bg-s-800">
                <View tw="px-6 pt-12 pb-0">
                    <RTitle text={t('general:lang')} />
                </View>
                <ScrollView tw="flex-1 px-6">
                    {allLanguages.map(lang => {
                        return (
                            <UIButton
                                type={lang === activeLangCode ? 'primary' : 'default'}
                                disabled={false}
                                key={lang}
                                twClass="mt-3"
                                onPress={() => onChooseLanguage(lang)}>
                                <View tw="flex-1 flex flex-row items-center">
                                    <View tw="flex-auto">
                                        <Text
                                            tw={`text-xl ${
                                                lang === activeLangCode ? 'text-white' : 'text-black dark:text-white'
                                            }`}>
                                            {languages[lang].name}
                                        </Text>
                                    </View>
                                    <View>
                                        {lang === activeLangCode && <SIcon path={iCheck} size={22} tw="text-p-500" />}
                                    </View>
                                </View>
                            </UIButton>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

export default LanguageScreen;
