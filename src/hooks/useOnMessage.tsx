// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {setFeature, setDrawer, setTokenAccess} from '../store/appSlice';
import {useAppDispatch} from '~store/hooks';
import useAuth from './useAuth';

// const setStatusOpenDraw = async (value: string) => {
//     try {
//         await AsyncStorage.setItem('opendraw', value);
//     } catch (error) {
//         console.log(error);
//     }
// };
export default function useOnMessage() {
    const dispatch = useAppDispatch();
    const {onGetIam, onRefreshToken} = useAuth();
    const navigation = useNavigation();

    const onMessage = event => {
        console.log('event', event);

        const data = JSON.parse(event.nativeEvent.data);

        if (data.event === 'opendraw') {
            console.log('dark event::: opendraw');
            // setStatusOpenDraw('true');
            setDrawer(true);
        } else if (data.event === 'marker') {
            console.log('marker event::: ', data);
            dispatch(setFeature(data.options.marker));
            navigation.navigate('MarkerScreen');
        } else if (data.event === 'jwt') {
            dispatch(setTokenAccess(data.data));
            onGetIam();
            // navigation.navigate('PointStack');
        }
    };

    return {
        onMessage,
    };
}
