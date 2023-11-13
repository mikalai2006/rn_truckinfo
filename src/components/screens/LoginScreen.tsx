import React, {useState} from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

import LoginSVG from '../../assets/misc/login.svg';
import SocialButtons from '../SocialButtons';

import RButton from '../r/RButton';
import InputField from '../form/InputField';
import RTitle from '../r/RTitle';
import FocusStatusBar from '~components/FocusStatusBar';
import {useColorScheme} from 'nativewind';
import colors from '~utils/colors';

import {tokens} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import useAuth from '~hooks/useAuth';

const LoginScreen = ({navigation}) => {
    const {t} = useTranslation();
    const {colorScheme} = useColorScheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    const token = useAppSelector(tokens);
    const [loading, setLoading] = useState(false);

    const {onLogin, onGetIam} = useAuth();
    const onLoginForm = async () => {
        try {
            setLoading(true);
            const data = await onLogin({email, password});
            if (data.access_token) {
                setErr('');
                setEmail('');
                setPassword('');

                // navigation.navigate('HomeTabStack');
            } else {
                throw new Error(data?.message);
            }
        } catch (e) {
            console.log('onLoginForm Error:::', JSON.stringify(e));
            setErr(e.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView tw="flex-1 justify-center bg-s-100 dark:bg-s-800">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colorScheme === 'dark' ? colors.s[800] : colors.s[100]}
            />
            <View tw="p-6">
                <View tw="items-center justify-center">
                    <LoginSVG height={100} width={100} />
                </View>

                <RTitle text={t('form:login')} />

                <Text>{token.access_token}</Text>

                <InputField
                    value={email}
                    setValue={newValue => setEmail(newValue)}
                    label={t('form:email')}
                    keyboardType="email-address"
                />

                <InputField
                    value={password}
                    setValue={newValue => setPassword(newValue)}
                    label={t('form:password')}
                    inputType="password"
                    fieldButtonLabel={t('form:button_forgot')}
                    fieldButtonFunction={() => {}}
                />

                <View tw="py-4">
                    {err !== '' ? <Text tw="text-red-600 dark:text-red-400 text-lg">{err}</Text> : ''}
                </View>

                <RButton
                    disabled={false}
                    loading={loading}
                    text={t('form:button_login')}
                    onPress={() => onLoginForm()}
                />

                <Text tw="py-4 text-lg text-center">{t('form:alt_login')}</Text>

                <SocialButtons />

                <View tw="flex flex-row">
                    <Text tw="text-lg">{t('form:newToTheApp')}</Text>
                    <TouchableOpacity tw="w-full" onPress={() => navigation.navigate('Register')}>
                        <Text tw="text-lg text-p-500 font-bold ml-1">{t('form:register')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
