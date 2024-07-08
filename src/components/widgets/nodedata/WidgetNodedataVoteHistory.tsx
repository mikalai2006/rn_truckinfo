import {View, Text} from 'react-native';
import React, {useMemo} from 'react';

import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useNodeDataVote} from '~hooks/useNodeDataVote';
import WidgetUserInfo from '../user/WidgetUserInfo';
import SIcon from '~components/ui/SIcon';
import {iHandThumbsDownFill, iHandThumbsUpFill} from '~utils/icons';
import dayjs from '~utils/dayjs';
import {useQuery} from '@realm/react';
import {LikeSchema} from '~schema/LikeSchema';

type Props = {
    nodedataId: string;
};

const WidgetNodedataVoteHistory = (props: Props) => {
    const {nodedataId} = props;
    const {t} = useTranslation();
    const navigation = useNavigation();

    const {nodeDataVotes, isLoading} = useNodeDataVote({filter: {nodedataId}});

    const localNodedataVote = useQuery(LikeSchema);

    const votes = useMemo(() => {
        const result = [...(nodeDataVotes || [])];
        const localVotes = localNodedataVote.filtered('serverNodedataId == $0', nodedataId);

        for (const vote of localVotes) {
            const existIndex = result.findIndex(x => x.nodedataId === vote.serverNodedataId);
            if (existIndex !== -1) {
                result[existIndex].value = vote.value;
            }
        }

        return result;
    }, [nodeDataVotes, localNodedataVote, nodedataId]);

    return (
        <View tw="">
            <Text tw="text-sm text-left text-s-500 pt-2 pb-1">{t('general:historyLikeNodedata')}</Text>
            {!isLoading
                ? votes.map(el => (
                      <View key={el.id} tw="flex flex-row items-center py-2 border-t border-s-100 dark:border-s-800">
                          <View tw="flex-auto">
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
                              <Text tw="text-xs text-s-500">{dayjs(el?.updatedAt).fromNow()}</Text>
                          </View>
                          {/* <Text tw="text-base text-s-900 dark:text-s-300">{JSON.stringify(nodeDataVotes)}</Text> */}
                      </View>
                  ))
                : null}
        </View>
    );
};

export default WidgetNodedataVoteHistory;
