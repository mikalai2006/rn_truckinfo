import {tokens} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';

const host = 'http://localhost:8000';

export default function useTrack() {
    const token = useAppSelector(tokens);
    const onAddPointToTrack = async ({lat, lon}) => {
        return await fetch(host + '/api/v1/track/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access_token}`,
            },
            body: JSON.stringify({
                lat,
                lon,
            }),
        })
            .then(r => r.json())
            // .then(response => {
            //     // if (!response.access_token) {
            //     //     throw response;
            //     // } else {
            //     //     dispatch(setTokenAccess(response));

            //     //     return response;
            //     // }
            // })
            .catch(e => {
                console.log('Can`t send point!');
                return false;
                // throw e;
            });
    };
    const onAddListPointToTrack = async ({list}) => {
        console.log('Need send ', list.length);
        const body = list.map(x => {
            return {
                lat: x.latitude,
                lon: x.longitude,
            };
        });
        console.log(JSON.stringify(body));

        return await fetch(host + '/api/v1/track/list/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.access_token}`,
            },
            body: JSON.stringify(body),
        })
            .then(r => r.json())
            .then(response => {
                console.log('Add ', response.lenght, ' points');

                // if (!response.access_token) {
                //     throw response;
                // } else {
                //     dispatch(setTokenAccess(response));

                //     return response;
                // }
            })
            .catch(e => {
                console.log('Can`t send point!');
                return false;
                // throw e;
            });
    };
    return {
        onAddPointToTrack,
        onAddListPointToTrack,
    };
}
