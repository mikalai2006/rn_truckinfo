import React, {useState} from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

// import DatePicker from 'react-native-date-picker';

import RButton from '../r/RButton';
import InputField from '../form/InputField';
import RTitle from '../r/RTitle';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RegistrationSVG from '../../assets/misc/register.svg';
import SocialButtons from '../SocialButtons';
import {useAppDispatch} from '~store/hooks';
import {setTokenAccess} from '~store/appSlice';
import useAuth from '~hooks/useAuth';
import HomeTabStack from '~components/navigations/HomeTabStack';

const RegisterScreen = ({navigation}) => {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [dobLabel, setDobLabel] = useState('Date of Birth');

    const {t} = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const {onSignUp, onLogin} = useAuth();
    const onSignUpForm = async () => {
        try {
            setLoading(true);
            await onSignUp({email, password, login: email});
            const res = await onLogin({email, password});
            if (res?.access_token && res?.refresh_token) {
                console.log('onSignUpForm:::', JSON.stringify(res));
                await dispatch(setTokenAccess(res));
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigation.navigate('HomeTabStack');
            } else {
                console.log('onSignUpForm2:::', JSON.stringify(res));
            }
        } catch (e) {
            setErr(e);
            console.log('onSignUpForm Error:::', e);
        } finally {
            setLoading(false);
        }

        // fetch(`http://localhost:8000/api/v1/auth/sign-up`, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email,
        //         password,
        //     }),
        // })
        //     .then(r => r.json())
        //     .then(data => {
        //         alert(JSON.stringify(data));

        //         fetch(`http://localhost:8000/api/v1/auth/sign-in`, {
        //             method: 'POST',
        //             headers: {
        //                 Accept: 'application/json',
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 email,
        //                 password,
        //             }),
        //         })
        //             .then(r => r.json())
        //             .then((res: ITokens) => {
        //                 if (res.access_token && res.refresh_token) {
        //                     alert(JSON.stringify(res));
        //                     dispatch(setTokenAccess(res));
        //                     setEmail('');
        //                     setPassword('');
        //                     setConfirmPassword('');
        //                     navigation.goBack();
        //                 }
        //             })
        //             .catch(e => {
        //                 alert(JSON.stringify(e));
        //             });
        //     })
        //     .catch(e => {
        //         alert(JSON.stringify(e));
        //     });
    };

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-900">
            <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={130} extraScrollHeight={130}>
                <View tw="flex-1 p-6">
                    <View tw="items-center justify-center">
                        <RegistrationSVG height={200} width={200} />
                    </View>

                    <RTitle text={t('form:register')} />

                    <SocialButtons />

                    <Text tw="py-4 text-lg text-center">{t('form:alt_register')}</Text>

                    {/* <InputField label={t('form:fullName')} /> */}
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
                    />

                    <InputField
                        value={confirmPassword}
                        setValue={newValue => setConfirmPassword(newValue)}
                        label={t('form:confirmPassword')}
                        inputType="password"
                    />
                    {/* <View
                    style={{
                        flexDirection: 'row',
                        borderBottomColor: '#ccc',
                        borderBottomWidth: 1,
                        paddingBottom: 8,
                        marginBottom: 30,
                    }}>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <Text style={{color: '#666', marginLeft: 5, marginTop: 5}}>{dobLabel}</Text>
                    </TouchableOpacity>
                </View> */}

                    {/* <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode={'date'}
                    maximumDate={new Date('2005-01-01')}
                    minimumDate={new Date('1980-01-01')}
                    onConfirm={date => {
                        setOpen(false);
                        setDate(date);
                        setDobLabel(date.toDateString());
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                /> */}

                    <View tw="py-4">
                        {err !== '' ? <Text tw="text-red-600 dark:text-red-400 text-lg">{err}</Text> : ''}
                    </View>

                    <RButton label={'Register'} loading={loading} disabled={false} onPress={() => onSignUpForm()} />

                    <View tw="flex flex-row items-stretch justify-stretch pt-4">
                        <Text tw="flex-none text-lg">{t('form:alreadyRegister')}</Text>
                        <View tw="flex-auto">
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text tw="text-lg text-p-500 font-bold ml-1">{t('form:login')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
