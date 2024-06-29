import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ScreenKeys} from '~components/screens';
import useAuth from '~hooks/useAuth';
import NetInfo from '@react-native-community/netinfo';

export default function () {
    const {onGetIam, isTokenExpired, onSyncToken} = useAuth();
    const navigation = useNavigation();

    React.useEffect(() => {
        const onCheck = async () => {
            try {
                const stateNet = await NetInfo.fetch();
                if (!stateNet.isConnected) {
                    return;
                }

                const tokensFromStore = await onSyncToken();
                // console.log('WidgetInitAuth: token.access_token=', tokensFromStore);

                if (!tokensFromStore) {
                    // console.log('WidgetInitAuth: Go to auth screen');
                    navigation.navigate(ScreenKeys.AuthScreen);
                } else if (tokensFromStore.access_token && tokensFromStore.refresh_token && !isTokenExpired()) {
                    // console.log('WidgetInitAuth: Get user info');
                    await onGetIam();
                }
            } catch (e: Error | any) {
                console.log('WidgetInitAuth error: ', e.message);
            }
        };

        onCheck();
    }, []);

    return null;
}
