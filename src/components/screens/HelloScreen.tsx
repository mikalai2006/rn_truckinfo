import React from 'react';

import {useAppSelector} from '~store/hooks';
import {langCode, tokens} from '~store/appSlice';
import AppStack from '~components/navigations/AppStack';
// import HelloStack from '~components/navigations/HelloStack';
// import AuthStack from '~components/navigations/AuthStack';
import {NativeModules, Platform} from 'react-native';

const HelloScreen = () => {
    const token = useAppSelector(tokens);
    const lang = useAppSelector(langCode);

    const deviceLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
            : NativeModules.I18nManager.localeIdentifier;

    if (lang === '') {
    }

    return <AppStack />; // token.access_token === '' ? <AuthStack /> :
};

export default HelloScreen;
