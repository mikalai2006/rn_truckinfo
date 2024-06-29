import {View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {setTokens, tokens, user} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import RTitle from '~components/r/RTitle';
import RButton from '~components/r/RButton';
import {NavigationProp} from '@react-navigation/native';
import InputField from '~components/form/InputField';
import useAuth from '~hooks/useAuth';
import {HOST_API} from '@env';

const UserFormScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
    const {t} = useTranslation();
    const userFromStore = useAppSelector(user);
    const token = useAppSelector(tokens);

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
            });
    };

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-900">
            <View tw="px-6 pt-12 pb-0">
                <RTitle text={t('form:formUserTitle')} />
            </View>
            <View tw="flex-auto">
                <View tw="p-6 ">
                    <InputField
                        value={login}
                        setValue={newValue => setLogin(newValue)}
                        label={t('form:login')}
                        keyboardType="default"
                    />

                    {/* <InputField
                    value={password}
                    setValue={newValue => setPassword(newValue)}
                    label={t('form:password')}
                    inputType="password"
                    fieldButtonLabel={t('form:button_forgot')}
                    fieldButtonFunction={() => {}}
                /> */}

                    {/* <View tw="py-4">
                    {err !== '' ? <Text tw="text-red-600 dark:text-red-400 text-lg">{err}</Text> : ''}
                </View>
 */}
                    <RButton
                        disabled={false}
                        loading={loading}
                        text={t('form:button_save')}
                        onPress={() => onPatchUser()}
                    />
                </View>
            </View>
            <View tw="p-6">
                <RButton text={t('general:back')} onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
};

export default UserFormScreen;
