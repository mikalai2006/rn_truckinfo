import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
import {useAppSelector} from '~store/hooks';
import {activeLanguage, user} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iPen} from '~utils/icons';
import RImage from '~components/r/RImage';

const SettingScreen = ({navigation}) => {
    const {t} = useTranslation();
    const activeLanguageFromStore = useAppSelector(activeLanguage);
    const userFromStore = useAppSelector(user);

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-900">
            <View tw="mt-10 mb-4">
                <WidgetHeaderApp />
            </View>
            <View tw="p-4">
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UserFormAvatarScreen')}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View>
                            <Text tw="text-s-500">{t('form:avatar')}:</Text>
                            <View tw="mt-2">
                                {userFromStore?.images ? <RImage image={userFromStore.images[0]} /> : <Text>No</Text>}
                            </View>
                        </View>
                        <SIcon path={iPen} size={20} tw="text-s-500" />
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UserFormScreen')}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View>
                            <Text tw="text-s-500">{t('form:login')}: </Text>
                            <Text tw="text-black dark:text-white text-lg">{userFromStore?.login}</Text>
                        </View>
                        <SIcon path={iPen} size={20} tw="text-s-500" />
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LanguageScreen')}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View tw="">
                            <Text tw="text-s-500">{t('general:lang')}: </Text>
                            <Text tw="text-black dark:text-white text-lg">{activeLanguageFromStore?.name}</Text>
                        </View>
                        <SIcon path={iPen} size={20} tw="text-s-500" />
                    </TouchableOpacity>
                </View>
                <View tw="bg-white dark:bg-s-800 rounded-lg p-4 mt-4">
                    <TouchableOpacity
                        onPress={() => {}}
                        activeOpacity={0.8}
                        tw="flex flex-row items-center justify-between p-3">
                        <View tw="">
                            <Text tw="text-s-500">{t('general:md')}: </Text>
                            <Text tw="text-black dark:text-white text-lg">{userFromStore?.md} км.</Text>
                            <Text tw="text-s-500">{t('general:md_description')} </Text>
                            <Text tw="mt-2 p-2 rounded-lg bg-p-500/20 text-p-500">{t('general:md_notify')} </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SettingScreen;
