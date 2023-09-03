import {tokens, setTokenAccess, setUser, ITokens, IUser} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';

export interface ISign {
    email: string;
    password: string;
    login?: string;
}

const host = 'http://localhost:8000'; //'https://storydata.ru';

export default function useAuth() {
    const dispatch = useAppDispatch();

    const onLogin = async ({email, password}: ISign) => {
        const d = await fetch(host + '/api/v1/auth/sign-in', {
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
        const d = await fetch(host + '/api/v1/auth/sign-up', {
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
        // try {
        //     let d: Promise<IUser> = new Promise();
        console.log('onGetIam::: token.access_token=[', token.access_token, ']', token.access_token === '');
        if (token.access_token === '') {
            return;
        }
        //     if (token.access_token === '') {
        //         return;
        //     }

        // const response = await Promise.race([
        //     fetch('http://localhost:8000/api/v1/auth/iam', {
        //         method: 'GET',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //             Authorization: `Bearer ${token.access_token}`,
        //         },
        //         // body: JSON.stringify({}),
        //     }),
        //     new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout'), 10000))),
        // ]);
        return await fetch(host + '/api/v1/auth/iam', {
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
                console.log('response=', response);
                console.log('message=', response.message);
                if (!response.id) {
                    dispatch(setTokenAccess({access_token: '', refresh_token: ''}));
                    throw response;
                } else {
                    dispatch(setUser(response));
                    console.log('user data: ', response);

                    return response;
                    // d = response
                    //     .json()
                    //     .then((data: IUser) => {
                    //         dispatch(setUser(data));
                    //         console.log('user data: ', data);

                    //         return data;
                    //     })
                    //     .catch(e => {
                    //         // Alert.alert('Error', JSON.stringify(e));
                    //         console.log('user error', e);
                    //         throw new Error(e);
                    //     });
                }
            })
            .catch(e => {
                throw e;
            });

        // return d;
        // } catch (e) {
        //     if (e.message === 'Timeout' || e.message === 'Network request failed') {
        //         console.log('retry', e);
        //         // retry
        //     } else {
        //         // rethrow other unexpected errors
        //     }
        //     d.re e;
        // }
    };

    const onRefreshToken = async () => {
        return await fetch(host + '/api/v1/auth/refresh', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access_token}`,
            },
            body: JSON.stringify({
                token: token.refresh_token,
            }),
        })
            .then(r => r.json())
            .then(response => {
                if (!response.access_token) {
                    console.log('onRefreshToken::: no token:::', response);
                    throw response;
                } else {
                    dispatch(setTokenAccess(response));
                    console.log('onRefreshToken::: ', response);
                    return response;
                }
            })
            .catch(e => {
                throw e;
            });
    };

    const onExit = () => {
        dispatch(setUser({}));
        dispatch(setTokenAccess({access_token: '', refresh_token: ''}));
    };

    return {
        onSignUp,
        onLogin,
        onGetIam,
        onRefreshToken,
        onExit,
    };
}
