import NetInfo from '@react-native-community/netinfo';
import {useTranslation} from 'react-i18next';
import useAuth from '~hooks/useAuth';

export const useFetchWithAuth = () => {
    const {onSyncToken} = useAuth();
    const {t} = useTranslation();

    const onFetchWithAuth = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
        const tokens = await onSyncToken();
        if (!tokens) {
            // console.log('tokens: ', tokens);
            throw new Error(t('general:httpError.notFoundToken'));
        }
        const stateNet = await NetInfo.fetch();
        // console.log('onFetch:::::', stateNet);

        if (!stateNet.isConnected) {
            throw new Error(t('general:httpError.notConnect'));
        }

        if (init) {
            const headers = new Headers(init?.headers);
            headers.set('Authorization', `Bearer ${tokens.access_token}`);
            init.headers = headers;
            // headers.forEach((el, key) => {
            //     console.log(el, key);
            // });
        }

        // if (!tokenData) {
        //     throw new Error('Not found tokens');
        // }

        const controller = new AbortController();

        const timeoutId = setTimeout(() => controller.abort(), 5000);
        // console.log(`onFetchWithAuth: ${timeoutId}`, input);

        return await fetch(input, {...init, signal: controller.signal})
            .then((response: any) => {
                if (response?.message || response?.code) {
                    throw new Error(`${response?.code}: ${response?.message}`);
                }
                // завершенный запрос до истечения тайм-аута
                // Если вы хотите заблокировать только запрос, а не ответ, добавьте:
                clearTimeout(timeoutId);
                return response;
            })
            .then(function (response) {
                // console.log(`FetchWithAuth ${timeoutId} complete. (Not aborted)`);
                return response;
            })
            .catch(function (err) {
                // console.error(`FetchWithAuth ${timeoutId} error: ${err}`);
                throw err;
            });

        // await fetch(
        //     HOST_API +
        //         '/country?' +
        //         new URLSearchParams({
        //             lang: activeLanguageFromStore?.code || 'en',
        //             $limit: '100',
        //         }),
        //     {
        //         method: 'GET',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json',
        //         },
        //     },
        // )
    };

    return {
        onFetchWithAuth,
    };
};
