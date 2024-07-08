import {View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {setTokens, tokens, user} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import RTitle from '~components/r/RTitle';
import {NavigationProp} from '@react-navigation/native';
import useAuth from '~hooks/useAuth';
import {HOST_API} from '@env';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import {useColorScheme} from 'react-native';
import colors from '~utils/colors';
import UIButton from '~components/ui/UIButton';

const SettingFormScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const userFromStore = useAppSelector(user);
    const token = useAppSelector(tokens);
    const colorScheme = useColorScheme();

    const [login, setLogin] = useState(userFromStore?.login);

    const createFormData = (body: any = {}) => {
        const data = new FormData();

        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });

        return data;
    };

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const {onGetIam, onSyncToken: onCheckAuth} = useAuth();
    const onPatchUser = async () => {
        setLoading(true);

        await onCheckAuth();

        return await fetch(HOST_API + `/user/${userFromStore?.id}`, {
            method: 'PATCH',
            headers: {
                'Access-Control-Allow-Origin-Type': '*',
                Authorization: `Bearer ${token.access_token}`,
            },
            body: createFormData({login}),
        })
            .then(r => r.json())
            .then(response => {
                if (response.message && response?.code === 401) {
                    dispatch(setTokens({access_token: ''}));
                }

                if (response.id) {
                    onGetIam();
                    return response;
                }
            })
            .catch(e => {
                console.log('e=', e);

                throw e;
            })
            .finally(() => {
                setLoading(false);
                navigation.goBack();
            });
    };

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950 border-b border-s-200 dark:border-s-900">
            <View tw="px-6 pt-4">
                <RTitle text={t('general:login')} />
            </View>
            <View tw="flex-auto">
                <View tw="p-6">
                    {/* <InputField
                        value={login}
                        setValue={newValue => setLogin(newValue)}
                        label={t('general:login')}
                        keyboardType="default"
                    /> */}

                    <TextInput
                        value={login}
                        onChangeText={newValue => setLogin(newValue)}
                        placeholder={t('general:login')}
                        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
                        keyboardType="default"
                        textAlignVertical="top"
                        tw="mb-4 p-4 text-base border border-s-200 dark:border-s-700 text-s-500 dark:text-s-300 bg-white dark:bg-s-950 rounded-xl"
                        placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    />
                    <UIButton
                        type="default"
                        disabled={false}
                        loading={loading}
                        text={t('general:save')}
                        onPress={() => onPatchUser()}
                    />
                </View>
            </View>
            <View tw="p-6">
                <UIButton type="default" text={t('general:back')} onPress={() => navigation.goBack()} />
            </View>
        </SafeAreaView>
    );
};

export default SettingFormScreen;
