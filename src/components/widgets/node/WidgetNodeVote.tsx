import {Text, View} from 'react-native';
import React, {useMemo} from 'react';

import {useTranslation} from 'react-i18next';
import {useObject, useQuery, useRealm} from '@realm/react';
import SIcon from '~components/ui/SIcon';
import {iHandThumbsDown, iHandThumbsDownFill, iHandThumbsUp, iHandThumbsUpFill, iWarning} from '~utils/icons';
import {INode} from '~store/appSlice';
import {NodeVoteSchema, TNodeVoteSchema} from '~schema/NodeVoteSchema';
import UIButton from '~components/ui/UIButton';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {formatNum} from '~utils/utils';

type Props = {
    lid: string;
    serverNode: INode;
};

const WidgetNodeVote = (props: Props) => {
    const {lid, serverNode} = props;

    const {t} = useTranslation();

    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const localNodeVote = useQuery(NodeVoteSchema, items => {
        return items.filtered('nlid == $0', lid);
    });

    const serverNodeVote = React.useMemo(() => serverNode?.votes || [], [serverNode?.votes]);

    const localVotes = useMemo(() => {
        const result = {
            dlike: 0,
            like: 0,
        };
        for (const localLike of localNodeVote) {
            if (localLike.value > 0) {
                result.like += 1;
            } else if (localLike.value < 0) {
                result.dlike += 1;
            }
        }

        return result;
    }, [localNodeVote]);
    const votes = {dlike: 10002, like: 13534};

    const realm = useRealm();
    const onLike = (value: 1 | -1) => {
        // console.log('onLike=', el);

        const newData: TNodeVoteSchema = {
            value,
            oldValue: 0,
            nlid: localNode?._id.toHexString(),
            nodeId: localNode?.sid,
            isLocal: true,
        };

        realm.write(() => {
            const existLike = localNodeVote.filtered('nlid == $0', lid);
            // console.log('existLike=', existLike);

            realm.create(
                NodeVoteSchema,
                {
                    ...newData,
                    oldValue: existLike[0]?.oldValue || 0,
                    _id: existLike[0]?._id || new BSON.ObjectId(),
                },
                UpdateMode.Modified,
            );
            // console.log('localLikes=', localLikes);
        });
    };

    return (
        <View tw="px-4 pb-2">
            <View tw="p-3 rounded-xl bg-s-50">
                <View>
                    <Text tw="font-bold text-lg leading-5 text-s-900 dark:text-s-200">
                        {t('general:feedbackTitle')}
                    </Text>
                    <Text tw="text-base py-1 leading-5 text-s-900 dark:text-s-200">{t('general:didNodeHelp')}</Text>
                </View>
                <View tw="flex flex-row space-x-2 pt-1 items-center">
                    <UIButton type="default" disabled={localVotes.like > 0} twClass="py-2" onPress={() => onLike(1)}>
                        <View tw="flex flex-row items-center">
                            <SIcon
                                path={localVotes.like > 0 ? iHandThumbsUpFill : iHandThumbsUp}
                                tw={`${
                                    localVotes.like > 0
                                        ? 'text-green-600 dark:text-green-300'
                                        : 'text-s-800 dark:text-s-300'
                                }`}
                                size={25}
                            />
                            <Text tw="p-2 text-s-800 dark:text-s-300">{t('general:isTrue')}</Text>
                            <View tw="self-center">
                                {votes.like > 0 && (
                                    <Text tw="bg-s-500 text-white px-2 py-1 leading-4 rounded-full">
                                        {formatNum(votes.like)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </UIButton>
                    <UIButton
                        type="default"
                        disabled={localVotes.dlike > 0}
                        twClass="py-2 ml-3"
                        onPress={() => onLike(-1)}>
                        <View tw="flex flex-row items-center">
                            <SIcon
                                path={localVotes.dlike > 0 ? iHandThumbsDownFill : iHandThumbsDown}
                                tw={`${
                                    localVotes.dlike > 0
                                        ? 'text-red-500 dark:text-red-300'
                                        : 'text-s-800 dark:text-s-300'
                                }`}
                                size={25}
                            />
                            <Text tw="p-2 text-s-800 dark:text-s-300">{t('general:isFalse')}</Text>
                            <View tw="self-center">
                                {votes.dlike > 0 && (
                                    <Text tw="bg-s-500 text-white px-2 py-1 leading-4 rounded-full">
                                        {formatNum(votes.dlike)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </UIButton>
                </View>
            </View>
        </View>
    );
};

export default WidgetNodeVote;
