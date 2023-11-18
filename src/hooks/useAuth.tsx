import {tokens, setTokenAccess, setUser, ITokens} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {HOST_API} from '@env';

export interface ISign {
    email: string;
    password: string;
    login?: string;
}

export default function useAuth() {
    const dispatch = useAppDispatch();

    const onLogin = async ({email, password}: ISign) => {
        const d = await fetch(HOST_API + '/api/v1/auth/sign-in', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then(r => r.json())
            .then((data: ITokens) => {
                if (data.access_token && data.refresh_token) {
                    dispatch(setTokenAccess(data));
                }
                return data;
            })
            .catch(e => {
                // Alert.alert('Error', JSON.stringify(e));
                dispatch(setTokenAccess({access_token: '', refresh_token: ''}));
                throw new Error(e);
            });

        return d;
    };

    const onSignUp = async ({email, password, login}: ISign): Promise<ITokens> => {
        const d = await fetch(HOST_API + '/api/v1/auth/sign-up', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                login,
            }),
        })
            .then(r => r.json())
            .then(data => {
                return data;
                // fetch(`http://localhost:8000/api/v1/auth/sign-in`, {
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
                //     .then((res: ITokens) => {
                //         if (res.access_token && res.refresh_token) {
                //             alert(JSON.stringify(res));
                //             dispatch(setTokenAccess(res));
                //             setEmail('');
                //             setPassword('');
                //             setConfirmPassword('');
                //             navigation.goBack();
                //         }
                //     })
                //     .catch(e => {
                //         alert(JSON.stringify(e));
                //     });
            })
            .catch(e => {
                // console.log('useAuth: onSignUp Error:::', JSON.stringify(e));
                throw new Error(e);
            });

        return d;
    };

    const token = useAppSelector(tokens);
    const onGetIam = async () => {
        // console.log('onGetIam::: token.access_token=[', token.access_token, ']', token.access_token === '');
        if (token.access_token === '') {
            return;
        }
        return await fetch(HOST_API + '/api/v1/auth/iam', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access_token}`,
            },
            // body: JSON.stringify({}),
        })
            .then(r => r.json())
            .then(response => {
                // console.log('response=', response);
                // console.log('message=', response.message);
                if (!response.id) {
                    // dispatch(setTokenAccess({access_token: '', refresh_token: ''}));
                    throw response;
                } else {
                    dispatch(setUser(response));
                    // console.log('user data: ', response);

                    return response;
                }
            })
            .catch(e => {
                throw e;
            });
    };

    // const onRefreshToken = async () => {
    //     // console.log('onRefreshToken>>>>>>>>>access_token=', token.access_token);
    //     // console.log('onRefreshToken>>>>>>>>>refresh_token=', token.refresh_token);
    //     if (!token.refresh_token) {
    //         return;
    //     }
    //     return await fetch(host + '/api/v1/auth/refresh', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token.access_token}`,
    //         },
    //         body: JSON.stringify({
    //             token: token.refresh_token,
    //         }),
    //     })
    //         .then(r => r.json())
    //         .then(response => {
    //             // console.log('onRefreshToken RESPONSE::: ', response);
    //             if (!response.access_token) {
    //                 onExit();
    //                 console.log('onRefreshToken::: no token:::', response);
    //                 throw response;
    //             } else {
    //                 dispatch(setTokenAccess(response));
    //                 return response;
    //             }
    //         })
    //         .catch(e => {
    //             throw e;
    //         });
    // };

    const onExit = () => {
        dispatch(setTokenAccess({access_token: null, refresh_token: null}));
        dispatch(setUser(null));
    };

    return {
        onSignUp,
        onLogin,
        onGetIam,
        onExit,
        // onRefreshToken,
    };
}
