import NetInfo from '@react-native-community/netinfo';

const useFetch = () => {
    const onFetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
        const stateNet = await NetInfo.fetch();
        // console.log('onFetch:::::', stateNet);

        if (!stateNet.isConnected) {
            throw new Error('Not connect');
        }

        const controller = new AbortController();

        const timeoutId = setTimeout(() => controller.abort(), 5000);
        // console.log(`onFetch: ${timeoutId}`, input);

        return await fetch(input, {...init, signal: controller.signal})
            // .then(response => {
            //     // завершенный запрос до истечения тайм-аута
            //     // Если вы хотите заблокировать только запрос, а не ответ, добавьте:
            //     // clearTimeout(timeoutId)
            //     return response;
            // })
            .then(function (response) {
                // console.log(`Fetch ${timeoutId} complete. (Not aborted)`);
                clearTimeout(timeoutId);
                return response;
            })
            .catch(function (err) {
                // console.error(`Fetch ${timeoutId} error: ${err}`);
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
        onFetch,
    };
};

export default useFetch;
