import {View, Text} from 'react-native';
import React, {useMemo} from 'react';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import WidgetUserInfo from '../user/WidgetUserInfo';
import SIcon from '~components/ui/SIcon';
import {iHandThumbsDownFill, iHandThumbsUpFill} from '~utils/icons';
import dayjs from '~utils/dayjs';
import {INodedata} from '~store/appSlice';
import {useQuery} from '@realm/react';
import {LikeSchema} from '~schema/LikeSchema';
import UIButton from '~components/ui/UIButton';

type Props = {
    nodedata: INodedata;
};

const WidgetNodedataVoteLast = (props: Props) => {
    const {nodedata} = props;
    const {t} = useTranslation();
    const navigation = useNavigation();

    const localNodedataVote = useQuery(LikeSchema);

    const votes = useMemo(() => {
        const result = [...(nodedata.votes || [])];
        const localVotes = localNodedataVote.filtered('serverNodedataId == $0', nodedata.id);

        for (const vote of localVotes) {
            const existIndex = result.findIndex(x => x.nodedataId === vote.serverNodedataId);
            if (existIndex !== -1) {
                result[existIndex].value = vote.value;
            }
        }

        return result;
    }, [localNodedataVote, nodedata.id, nodedata.votes]);

    return (
        <View tw="">
            {votes.length > 0 ? (
                <Text tw="text-sm text-left text-s-500 pt-2">{t('general:historyLikeNodedata')}</Text>
            ) : null}
            {votes.map(el => (
                <View key={el.id} tw="flex flex-row items-center pb-2">
                    <View tw="flex-auto">
                        {el?.updatedAt && <Text tw="text-sm text-s-500">{dayjs(el?.updatedAt).fromNow()}</Text>}
                        <WidgetUserInfo userData={el.user} />
                    </View>
                    {/* <View tw="">
                          </View> */}
                    <View tw="flex items-end">
                        {el.value > 0 ? (
                            <SIcon path={iHandThumbsUpFill} size={20} tw="text-green-600" />
                        ) : (
                            <SIcon path={iHandThumbsDownFill} size={20} tw="text-red-600" />
                        )}
                    </View>
                    {/* <Text tw="text-base text-s-900 dark:text-s-300">{JSON.stringify(nodeDataVotes)}</Text> */}
                </View>
            ))}
            <View tw="pt-2">
                <UIButton
                    type="default"
                    text={t('general:historyMoreLikeNodedata')}
                    onPress={() => {
                        navigation.navigate('NodedataVoteScreen', {
                            nodedataId: nodedata.id,
                        });
                    }}
                />
            </View>
        </View>
    );
};

export default WidgetNodedataVoteLast;
