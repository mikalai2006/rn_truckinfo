// import {useNavigation} from '@react-navigation/native';
// import {setTokenAccess, setUser, tokens} from '../store/appSlice';
// import {useAppDispatch, useAppSelector} from '~store/hooks';
// import CookieManager from '@react-native-cookies/cookies';
// import {HOST} from '@env';
// import {Alert} from 'react-native';
// import {ScreenKeys} from '~components/screens';

// export default function useOnMessage() {
//     const dispatch = useAppDispatch();
//     const navigation = useNavigation();
//     const tokenFromStore = useAppSelector(tokens);

//     const onMessage = event => {
//         const data = JSON.parse(event.nativeEvent.data);
//         console.log('onMessage event', data);

//         if (data.event === 'marker') {
//             navigation.navigate(ScreenKeys.NodeScreen, {marker: data.options.marker});
//         } else if (data.event === 'iam') {
//             // navigation.navigate('MarkerScreen', {marker: data.options.marker});
//             dispatch(setUser(data.iam));
//             console.log('IAM:', data.iam);
//         } else if (data.event === 'newNode') {
//             navigation.navigate(ScreenKeys.NodeScreen, {marker: data.options.marker});
//         } else if (data.event === 'jwt') {
//             console.log('jwt:', data.data);
//             dispatch(setTokenAccess(data.data));
//             if (data.refresh_token) {
//                 const host = HOST.split(':')[0];
//                 const domain = host.split('//')[1];
//                 CookieManager.set(HOST, {
//                     name: 'rt',
//                     value: data.data.refresh_token || tokenFromStore.refresh_token,
//                     domain: domain,
//                     path: '/',
//                     version: '1',
//                     expires: '2023-11-18T23:59:00.00-05:00',
//                 }).then(done => {
//                     // console.log('CookieManager.set =>', done);
//                 });
//             }
//         } else if (data.event === 'error') {
//             const code = data.data?.code;
//             switch (code) {
//                 case 401:
//                     dispatch(setTokenAccess({access_token: 'refresh' + new Date().getTime()}));
//                     break;
//                 default:
//                     Alert.alert('Error', data.data.message, [
//                         // {
//                         //   text: 'Ask me later',
//                         //   onPress: () => console.log('Ask me later pressed'),
//                         // },
//                         {
//                             text: 'Cancel',
//                             onPress: () => console.log('Cancel Pressed'),
//                             style: 'cancel',
//                         },
//                         {text: 'OK', onPress: () => console.log('OK Pressed')},
//                     ]);
//                     break;
//             }
//         }
//     };

//     return {
//         onMessage,
//     };
// }
