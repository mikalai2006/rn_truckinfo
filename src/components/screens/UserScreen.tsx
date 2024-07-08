import React, {useEffect, useMemo} from 'react';
import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import useUser from '~hooks/useUser';
import RImage from '~components/r/RImage';
import WidgetUserStat from '~components/widgets/user/WidgetUserStat';
import {replaceRegexByArray} from '~utils/utils';
import dayjs from '~utils/dayjs';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'UserScreen'>;

const UserScreen = (props: Props) => {
    // console.log('NodeShortScreen render');

    const {navigation, route} = props;
    const {userId} = route.params;

    const {t} = useTranslation();

    const {isLoading, userFromServer} = useUser({id: userId});

    const userStat = useMemo(() => userFromServer?.userStat, [userFromServer?.userStat]);

    return (
        <SafeAreaView tw="flex-1 bg-s-100 dark:bg-s-950">
            {userStat ? (
                <>
                    <View>
                        <View tw="flex items-center">
                            {userFromServer?.images ? (
                                <RImage image={userFromServer.images[0]} classString="h-32 w-32 rounded-full" />
                            ) : (
                                <Text>No</Text>
                            )}
                            <Text tw="text-s-800 dark:text-s-200 font-bold text-2xl">{userFromServer?.login}</Text>
                            {/* <View>
                        <Text tw="text-black dark:text-white">{userData?.name || userData?.id}</Text>
                    </View> */}
                            <View>
                                <Text tw="text-base text-s-700 dark:text-s-400">{userFromServer?.roles}</Text>
                                {/* <Text tw="text-white">{token.refresh_token}</Text> */}
                            </View>
                            <WidgetUserStat userData={userFromServer} />
                        </View>
                    </View>
                    <View tw="p-6">
                        <View tw="flex flex-row items-center">
                            <View tw="mr-1">
                                <View tw="bg-p-500 h-2 w-2 rounded-full" />
                            </View>
                            <Text tw="text-base text-s-700 dark:text-s-300">
                                {replaceRegexByArray(t('general:statUser.node'), [userStat.node])}
                            </Text>
                        </View>
                        <View tw="flex flex-row items-center">
                            <View tw="mr-1">
                                <View tw="bg-s-300 h-2 w-2 rounded-full" />
                            </View>
                            <Text tw="text-base text-s-700 dark:text-s-300">
                                {replaceRegexByArray(t('general:statUser.nodedata'), [userStat.nodedata])}
                            </Text>
                        </View>
                        <View tw="flex flex-row items-center">
                            <View tw="mr-1">
                                <View tw="bg-yellow-600 h-2 w-2 rounded-full" />
                            </View>
                            <Text tw="text-base text-s-700 dark:text-s-300">
                                {replaceRegexByArray(t('general:statUser.review'), [userStat.review])}
                            </Text>
                        </View>
                        {/* <Text tw="text-base text-s-700 dark:text-s-300">
                            {replaceRegexByArray(t('general:statUser.nodedataLike'), [userStat.nodedataLike])}
                        </Text>
                        <Text tw="text-base text-s-700 dark:text-s-300">
                            {replaceRegexByArray(t('general:statUser.nodedataDLike'), [userStat.nodedataDLike])}
                        </Text>
                        <Text tw="text-base text-s-700 dark:text-s-300">
                            {replaceRegexByArray(t('general:statUser.nodedataAuthorLike'), [
                                userStat.nodedataAuthorLike,
                            ])}
                        </Text>
                        <Text tw="text-base text-s-700 dark:text-s-300">
                            {replaceRegexByArray(t('general:statUser.nodedataAuthorDLike'), [
                                userStat.nodedataAuthorDLike,
                            ])}
                        </Text> */}
                        <Text tw="text-base text-s-700 dark:text-s-300">
                            {t('general:inApp')} {dayjs(userFromServer?.createdAt).fromNow(true)}
                        </Text>
                    </View>
                    {/* <Text tw="text-s-500">{JSON.stringify(userStat)}</Text>
                    <Text tw="text-s-500">{JSON.stringify(userFromServer)}</Text> */}
                </>
            ) : null}
        </SafeAreaView>
    );
};

export default UserScreen;
