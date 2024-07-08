import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import SRate from '~components/ui/SRate';
import SRateStar from '~components/ui/SRateStar';
import {INode} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import {ReviewSchema} from '~schema/ReviewSchema';
import {useQuery} from '@realm/react';
import {formatNum} from '~utils/utils';

const arrayIndex = [1, 2, 3, 4, 5];

type Props = {
    lid: string;
    serverNode: INode;
};

const WidgetNodeRating = (props: Props) => {
    // var testTime = window.performance.now();
    const {lid, serverNode} = props;

    const {t} = useTranslation();

    const localReviews = useQuery(ReviewSchema, items => {
        return items.filtered('nlid == $0 OR nodeId == $1', lid, serverNode?.id);
    });

    const count = useMemo(() => {
        return serverNode?.reviewsInfo?.count || localReviews.length;
    }, [localReviews.length, serverNode?.reviewsInfo?.count]);

    const rate = useMemo(() => {
        const serverCount = serverNode?.reviewsInfo?.count || 0;
        const serverRate = serverNode?.reviewsInfo.value || 0;
        const localCount = localReviews.filter(x => x.isLocal).length;
        const localOldRate = localReviews.filter(x => x.isLocal).reduce((ac, el) => ac + el.oldRate, 0);
        const localRate = localReviews.filter(x => x.isLocal).reduce((ac, el) => ac + el.rate, 0);

        const totalRate = serverRate - localOldRate + localRate;
        const totalCount = serverCount + (localOldRate === 0 ? localCount : 0);

        return serverNode && serverCount > 0
            ? Number(totalRate / totalCount).toFixed(2)
            : localReviews.reduce((ac, el) => ac + el.rate, 0);
    }, [localReviews, serverNode]);

    const ratings = useMemo(() => {
        const result = Object.fromEntries(
            arrayIndex.map(x => {
                return [x, 0];
            }),
        );

        if (serverNode?.reviewsInfo?.ratings) {
            serverNode?.reviewsInfo?.ratings.forEach(el => {
                result[el._id] = el.count;
            });
        }
        if (localReviews.length > 0) {
            localReviews.forEach(x => {
                if (x.oldRate) {
                    result[x.oldRate] -= serverNode ? 1 : 0;
                }
                result[x.rate] += 1;
            });
        }

        return result;
    }, [localReviews, serverNode]);
    // console.log('time prepair to render: ', window.performance.now() - testTime);
    // console.log('localReviews: ', localReviews);
    // console.log('ratings: ', ratings);

    return (
        <View>
            <View tw="flex flex-row">
                <View tw="w-5/12 self-center">
                    <View tw="mx-auto">
                        <SRateStar value={rate} />
                    </View>
                    <Text tw="pt-2 text-4xl text-center text-s-800 dark:text-s-300 font-bold">{rate}</Text>
                    <Text tw="text-base leading-5 text-center text-s-800 dark:text-s-300">
                        ({t('general:reviewTotal')}: {formatNum(count)})
                    </Text>
                </View>
                <View tw="w-7/12">
                    {arrayIndex.map((i, _) => (
                        <SRate
                            value={i}
                            key={i.toString()}
                            count={ratings[i]}
                            maxRate={Math.max.apply(null, Object.values(ratings))}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

export default WidgetNodeRating;
