import React from 'react';

import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import WidgetNodedataVoteHistory from '~components/widgets/nodedata/WidgetNodedataVoteHistory';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodedataVoteScreen'>;

const NodedataVoteScreen = (props: Props) => {
    const {t} = useTranslation();
    const navigation = useNavigation();

    const {nodedataId} = props.route.params;

    return (
        <SafeAreaView tw="flex-1 p-4 bg-s-100 dark:bg-s-950">
            <WidgetNodedataVoteHistory nodedataId={nodedataId} />
        </SafeAreaView>
    );
};

export default NodedataVoteScreen;
