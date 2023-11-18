import {View, Text, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useAuth from '~hooks/useAuth';
import UserInfo from '~components/UserInfo';
import RButton from '~components/r/RButton';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '~store/hooks';
import {tokens, user} from '~store/appSlice';
import {useNavigation, useRoute} from '@react-navigation/native';

const AuthScreen = () => {
    const navigation = useNavigation();

    const token = useAppSelector(tokens);
    const userFromStore = useAppSelector(user);
    const [err, setErr] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const {onGetIam, onRefreshToken} = useAuth();
    const {t} = useTranslation();

    // console.log('AuthScreen Render', err);

    const initAuth = async () => {
        try {
            setLoading(true);

            await onRefreshToken();
            // await onGetIam().then(() => {
            //     navigation.navigate('HomeScreen');
            // });
        } catch (e) {
            console.log('WidgetAuthorization error::: ', e);
            setErr(e);
        } finally {
            setLoading(false);
        }
    };

    // const onGetIamCallback = useCallback(async () => {
    //     await onGetIam();
    // }, [onGetIam]);

    // useMemo(async () => {
    //     if (token.access_token) {
    //         await onGetIam();
    //     }
    // }, [onGetIam, token.access_token]);

    useEffect(() => {
        if (token.access_token) {
            onRefreshToken()
                .then(() => {})
                .catch(e => {
                    setErr(e);
                });
        }
    }, []);

    const route = useRoute();
    useEffect(() => {
        if (token.access_token) {
            onGetIam().then(() => {
                console.log('route.name=', route.name);
            });
        }
    }, [token.access_token]);

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

    // const onRefreshTokens = async () => {
    //     await onRefreshToken();
    //     await onGetIam();
    //     // navigation.navigate('AuthScreen');
    //     setErr(null);
    // };

    const goHome = () => {
        navigation.navigate('HomeScreen');
    };

    // console.log('err=', err, token);

    return err ? (
        <View tw="flex-1 justify-center bg-white dark:bg-s-800">
            <View tw="flex-1 flex-col justify-center p-6">
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
                        ) : err.code === 700 ? (
                            <View tw="shadow-lg bg-s-100 dark:bg-s-800 rounded-lg overflow-hidden">
                                <View tw="">
                                    <UserInfo />
                                </View>
                                <View tw="p-4 ">
                                    <Text tw="text-xl font-bold text-s-800 dark:text-s-300">Время сессии истекло!</Text>
                                    <Text tw="text-lg pb-4 text-s-800 dark:text-s-300">{err.message}</Text>
                                    <Text>{userFromStore?.login}</Text>
                                    {/* <RButton text="Продолжить" onPress={onRefreshTokens} /> */}
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
                                    <Text>{userFromStore?.login}</Text>
                                    <RButton text="Продолжить" onPress={initAuth} />
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
        <View tw="p-6">
            <UserInfo />
            {token.access_token && <RButton text="Начать" onPress={goHome} />}
        </View>
    );
};

export default AuthScreen;
