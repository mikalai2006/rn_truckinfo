import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import {IUser} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import RImage from '~components/r/RImage';
import WidgetUserStat from './WidgetUserStat';
import WidgetUserInfo from './WidgetUserInfo';
import SIcon from '~components/ui/SIcon';
import {iChevronDown} from '~utils/icons';

type Props = {
    userData: IUser;
};

const WidgetUserLink = (props: Props) => {
    const {userData} = props;
    const {t} = useTranslation();
    const navigation = useNavigation();

    const goToUserPage = () => {
        navigation.navigate('UserScreen', {
            userId: userData?.id,
        });
    };

    return (
        <TouchableOpacity tw="rounded-xl flex flex-row" onPress={goToUserPage}>
            <View tw="flex-auto">
                <View tw="flex flex-row items-center">
                    <WidgetUserInfo userData={userData} />
                </View>
            </View>
            <View tw="self-center">
                <View tw="transform -rotate-90">
                    <SIcon path={iChevronDown} size={25} tw="text-s-300 dark:text-s-500" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default WidgetUserLink;
