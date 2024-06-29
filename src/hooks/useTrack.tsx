import {tokens} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import {HOST_API} from '@env';

export default function useTrack() {
    const token = useAppSelector(tokens);
    const onAddPointToTrack = async ({lat, lon}) => {
        return await fetch(HOST_API + '/track/', {
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

        const pointsForSave = list.filter(x => x.coords?.accuracy < 30);
        const body = pointsForSave
            .map(x => {
                return {
                    lat: x.coords.latitude,
                    lon: x.coords.longitude,
                };
            })
            .sort((a, b) => a.timestamp > b.timestamp);
        console.log(JSON.stringify(body));

        return await fetch(HOST_API + '/track/list/', {
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
