import React from 'react';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {useColorScheme} from 'nativewind';
import {Text, TouchableOpacity, View} from 'react-native';
import UserInfo from '~components/UserInfo';
import useAuth from '~hooks/useAuth';
import {tokens} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import SIcon from '~components/ui/SIcon';
import {iClose} from '~utils/icons';

export function CustomDrawer(props) {
    const {onExit} = useAuth();
    const {colorScheme} = useColorScheme();
    const tokensFromStore = useAppSelector(tokens);

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
            <UserInfo />
            <View tw="flex-1 flex bg-s-100 dark:bg-s-950">
                <View tw="flex-auto m-0 p-0">
                    <DrawerItemList {...props} />
                </View>
                {tokensFromStore?.access_token !== '' ? (
                    <View tw="p-2">
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    onExit();
                                }}
                                tw="flex flex-row justify-end items-center p-3 bg-s-100 dark:bg-s-800 rounded-xl">
                                <Text tw="pr-2 text-lg text-s-500 dark:text-s-500">Выйти из аккаунта</Text>
                                <SIcon path={iClose} size={24} tw="text-s-500" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    ''
                )}
            </View>
        </DrawerContentScrollView>
    );
}

const styles = {
    drawer: {
        height: '100%',
        paddingTop: 0,
    },
};
