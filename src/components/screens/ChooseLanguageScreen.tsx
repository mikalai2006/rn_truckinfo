import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {langCode} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RTitle from '~components/r/RTitle';
import RButton from '~components/r/RButton';
import {NavigationProp} from '@react-navigation/native';
import RButtonBorder from '~components/r/RButtonBorder';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '~utils/colors';
// import {useNavigation} from '@react-navigation/native';

import languages from '~localization/languages';
import useLanguage from '~hooks/useLanguage';

const ChooseLanguageScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const activeLang = useAppSelector(langCode);
    // const navigation = useNavigation();

    const {chooseLanguage} = useLanguage();

    const allLanguages = Object.keys(languages);
    if (activeLang === '') {
        chooseLanguage(allLanguages[0]);
    }

    return (
        <View tw="flex-1 items-stretch justify-center flex gap-4 bg-s-100 dark:bg-s-800">
            <View tw="p-6 pb-0">
                <RTitle text={t('general:chooseLanguage')} />
            </View>
            <ScrollView tw="flex-1 px-6">
                {allLanguages.map(lang => {
                    return (
                        <RButtonBorder disabled={false} key={lang} onPress={() => chooseLanguage(lang)}>
                            <View tw="flex-1 flex flex-row items-center">
                                <View tw="flex-auto">
                                    <Text tw={`text-xl font-bold ${lang === activeLang ? 'text-p-500' : ''}`}>
                                        {languages[lang].name}
                                    </Text>
                                </View>
                                <View>
                                    {lang === activeLang && <Icon name="check" size={22} color={colors.p[500]} />}
                                </View>
                            </View>
                        </RButtonBorder>
                    );
                })}
            </ScrollView>
            <View tw="p-6">
                <RButton
                    disabled={activeLang === ''}
                    label={t('general:next')}
                    onPress={() => navigation.navigate('Auth')}
                />
            </View>
        </View>
    );
};

export default ChooseLanguageScreen;
