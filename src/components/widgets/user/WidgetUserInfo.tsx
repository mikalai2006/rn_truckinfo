import {View, Text} from 'react-native';
import React from 'react';

import {IUser} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import RImage from '~components/r/RImage';
import WidgetUserStat from './WidgetUserStat';

type Props = {
    userData: IUser;
};

const WidgetUserInfo = (props: Props) => {
    const {userData} = props;
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
        <View tw="flex flex-row items-center">
            <View>
                <RImage image={userData?.images ? userData?.images[0] : null} tw="h-10 w-10" />
            </View>
            <View tw="pl-2">
                <Text tw="text-base text-s-900 dark:text-s-300">{userData.login}</Text>
                <WidgetUserStat userData={userData} />
            </View>
        </View>
    );
};

export default WidgetUserInfo;
