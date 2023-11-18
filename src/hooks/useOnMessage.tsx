import {useNavigation} from '@react-navigation/native';
import {setTokenAccess} from '../store/appSlice';
import {useAppDispatch} from '~store/hooks';
import CookieManager from '@react-native-cookies/cookies';
import {HOST} from '@env';

export default function useOnMessage() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const onMessage = event => {
        const data = JSON.parse(event.nativeEvent.data);
        console.log('onMessage event', data.event, ' : ', data.data);

        if (data.event === 'marker') {
            navigation.navigate('MarkerScreen', {marker: data.options.marker});
        } else if (data.event === 'jwt') {
            const host = HOST.split(':')[0];
            const domain = host.split('//')[1];
            CookieManager.set(HOST, {
                name: 'rt',
                value: data.data.refresh_token,
                domain: domain,
                path: '/',
                version: '1',
                expires: '2023-11-18T23:59:00.00-05:00',
            }).then(done => {
                dispatch(setTokenAccess(data.data));
                // console.log('CookieManager.set =>', done);
            });
        }
    };

    return {
        onMessage,
    };
}
