import React from 'react';
import {useColorScheme} from 'nativewind';
import {Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useNodeDataVote} from '~hooks/useNodeDataVote';
import {useAppSelector} from '~store/hooks';
import {user} from '~store/appSlice';
import WidgetStatItem from '../stat/WidgetStatItem';

export default function WidgetNews() {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const navigation = useNavigation();

    const userFromStore = useAppSelector(user);

    //const {nodeDataVotes, isLoading} = useNodeDataVote({filter: {nodedataUserId: userFromStore?.id}});

    return (
        <View tw="">
            <View tw="flex-auto">
                <Text tw="text-s-700 dark:text-s-400 text-lg leading-6">{t('general:newsTitle')}</Text>
                {/* <Text tw="text-s-700 dark:text-s-400 text-lg leading-6">{JSON.stringify(nodeDataVotes)}</Text> */}
                <View></View>
            </View>
        </View>
    );
}
