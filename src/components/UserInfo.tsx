import {View, Text, ImageBackground} from 'react-native';
import React from 'react';

import {tokens, user} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import RButton from './r/RButton';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '~utils/colors';
import SwitchMode from './SwitchMode';
import RImage from './r/RImage';

const UserInfo = () => {
    const navigation = useNavigation();
    const userData = useAppSelector(user);
    const token = useAppSelector(tokens);

    return (
        <>
            {token.access_token !== '' ? (
                <ImageBackground source={require('../assets/images/menu-bg.jpeg')} tw="relative p-4">
                    <View tw="absolute right-2 top-2 z-10">
                        <SwitchMode />
                    </View>
                    <View>
                        {userData?.images ? <RImage image={userData.images[0]} /> : <Text>No</Text>}
                        <Text tw="text-s-50 font-bold text-2xl">{userData?.login}</Text>
                        <View>
                            <Text tw="text-white">{userData?.name || userData?.id}</Text>
                        </View>
                        <View>
                            <Text tw="text-white">{userData?.userId}</Text>
                        </View>
                    </View>
                </ImageBackground>
            ) : (
                <View tw="bg-p-600 dark:bg-p-600 p-4">
                    <RButton disabled={false} label="Войти" onPress={() => navigation.navigate('AuthScreen')} />
                    <View tw="mt-4">
                        <Text tw="text-white">Войдите в аккаунт, чтобы открыть все возможности приложения</Text>
                    </View>
                </View>
            )}
        </>
    );
};

export default UserInfo;
