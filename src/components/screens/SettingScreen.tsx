import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
import {useAppSelector} from '~store/hooks';
import {activeLanguage, tokens, user} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iPen} from '~utils/icons';
import RImage from '~components/r/RImage';
import {SafeAreaView} from 'react-native-safe-area-context';
import useAuth from '~hooks/useAuth';
import UIButton from '~components/ui/UIButton';

const SettingScreen = ({navigation}) => {
    const {t} = useTranslation();
    const activeLanguageFromStore = useAppSelector(activeLanguage);
    const userFromStore = useAppSelector(user);
    const {onExit} = useAuth();
    const tokensFromStore = useAppSelector(tokens);

    const onClickExit = () =>
        Alert.alert(t('general:exitTitle'), t('general:exitMessage'), [
            {
                text: t('general:isFalse'),
                onPress: () => {},
            },
            {
                text: t('general:isTrue'),
                onPress: () => {
                    onExit();
                },
            },
        ]);

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950 border-b border-s-200 dark:border-s-900">
            <View tw="px-4">
                <WidgetHeaderApp />
            </View>
            <ScrollView tw="px-6">
                <View tw="bg-white dark:bg-s-900 rounded-lg p-4">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SettingAvatarScreen')}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View>
                            <Text tw="text-base text-s-500 dark:text-s-300">{t('general:avatar')}:</Text>
                            <View tw="mt-2">
                                {userFromStore?.images ? <RImage image={userFromStore.images[0]} /> : <Text>No</Text>}
                            </View>
                        </View>
                        <SIcon path={iPen} size={20} tw="text-s-500 dark:text-s-300" />
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SettingFormScreen')}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View>
                            <Text tw="text-base text-s-500 dark:text-s-300">{t('general:login')}: </Text>
                            <Text tw="text-black dark:text-white text-base">{userFromStore?.login}</Text>
                        </View>
                        <SIcon path={iPen} size={20} tw="text-base text-s-500 dark:text-s-300" />
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SettingLangScreen')}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View tw="">
                            <Text tw="text-base text-s-500 dark:text-s-300">{t('general:lang')}: </Text>
                            <Text tw="text-s-900 dark:text-white text-base">{activeLanguageFromStore?.name}</Text>
                        </View>
                        <SIcon path={iPen} size={20} tw="text-base text-s-500 dark:text-s-300" />
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    <TouchableOpacity
                        onPress={() => {}}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View tw="">
                            <Text tw="text-base text-s-500 dark:text-s-300">{t('general:md')}: </Text>
                            <Text tw="text-s-900 dark:text-white text-base">{userFromStore?.md} км.</Text>
                            <Text tw="mt-2 p-2 rounded-lg bg-p-500/20 text-p-500 dark:text-p-300">
                                {t('general:md_notify')}{' '}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    {tokensFromStore?.access_token ? (
                        <View tw="p-2">
                            <View>
                                <UIButton type="link" onPress={onClickExit} twClass="flex flex-row">
                                    <Text tw="pr-2 text-lg text-s-500 dark:text-s-500">{t('general:exitTitle')}</Text>
                                </UIButton>
                            </View>
                        </View>
                    ) : (
                        ''
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingScreen;
