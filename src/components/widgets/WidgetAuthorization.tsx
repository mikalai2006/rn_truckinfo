import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import useAuth from '~hooks/useAuth';
import UserInfo from '~components/UserInfo';
import RButton from '~components/r/RButton';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '~store/hooks';
import {tokens, user} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';

const WidgetAuthorization = () => {
    const navigation = useNavigation();

    const token = useAppSelector(tokens);
    const userStore = useAppSelector(user);
    const [err, setErr] = useState({});
    const [loading, setLoading] = useState(true);
    const {onGetIam, onRefreshToken} = useAuth();
    const {t} = useTranslation();

    useEffect(() => {
        const fun = async () => {
            try {
                setLoading(true);
                if (token.access_token === '') {
                    return;
                }

                await onRefreshToken();
                await onGetIam();
            } catch (e) {
                console.log('WidgetAuthorization error::: ', e);
                setErr(e);
            } finally {
                setLoading(false);
            }
        };
        fun();
    }, []);

    // useEffect(() => {
    //     const fun = async () => {
    //         try {
    //             setLoading(true);
    //             if (token.access_token === '') {
    //                 return;
    //             }
    //             await onRefreshToken();
    //         } catch (e) {
    //             console.log('WidgetAuthorization error2::: ', e);
    //             setErr(e);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fun();
    // }, []);

    const onRefreshTokens = async () => {
        await onRefreshToken();
        await onGetIam();
        // navigation.navigate('AuthScreen');
        setErr({});
    };

    return err.message ? (
        <View tw="absolute z-10 top-0 right-0 left-0 bottom-0 p-4 justify-center">
            <View tw="absolute z-1 top-0 right-0 left-0 bottom-0 bg-s-100/90 dark:bg-s-900/90" />
            <View tw="flex-1 flex-col justify-center">
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        {!err.code ? (
                            <View tw="shadow-lg bg-s-100 dark:bg-s-800 rounded-lg overflow-hidden">
                                <View tw="p-4">
                                    <Text tw="text-red-400 text-lg">{err.code}</Text>
                                    <Text tw="text-red-400 text-lg">{err.message}</Text>
                                    <RButton text="Продолжить оффлайн" onPress={() => setErr({})} />
                                </View>
                            </View>
                        ) : err.code === 401 ? (
                            <View tw="shadow-lg bg-s-100 dark:bg-s-800 rounded-lg overflow-hidden">
                                <View tw="">
                                    <UserInfo />
                                </View>
                                <View tw="p-4 ">
                                    <Text tw="text-xl font-bold text-s-800 dark:text-s-300">Время сессии истекло!</Text>
                                    <Text tw="text-lg pb-4 text-s-800 dark:text-s-300">
                                        Продолжим дальше с этим аккаунтом?
                                    </Text>
                                    <RButton text="Продолжить" onPress={onRefreshTokens} />
                                </View>
                            </View>
                        ) : (
                            ''
                        )}
                    </>
                )}
            </View>
        </View>
    ) : (
        ''
    );
};

export default WidgetAuthorization;
