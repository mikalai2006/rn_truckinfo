import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import SRate from '~components/ui/SRate';
import SRateStar from '~components/ui/SRateStar';
import {useAppSelector} from '~store/hooks';
import {activeNode} from '~store/appSlice';

const WidgetNodeRating = () => {
    const activeNodeFromStore = useAppSelector(activeNode);
    // console.log('WidgetNodeRating: ', activeNodeFromStore?.osmId);

    const rate = useMemo(() => {
        return activeNodeFromStore && activeNodeFromStore?.reviewsInfo?.count > 0
            ? Number(activeNodeFromStore?.reviewsInfo.value / activeNodeFromStore?.reviewsInfo.count).toFixed(2)
            : 0;
    }, [activeNodeFromStore]);

    const ratings = useMemo(() => {
        return activeNodeFromStore?.reviewsInfo?.ratings
            ? Object.fromEntries(
                  activeNodeFromStore?.reviewsInfo.ratings?.map(x => {
                      return [x._id, x.count];
                  }),
              )
            : {};
    }, [activeNodeFromStore]);

    return (
        <View>
            {activeNodeFromStore?.osmId ? (
                <>
                    <View tw="flex flex-row">
                        <View tw="w-5/12 self-center">
                            <View tw="mx-auto">
                                <SRateStar value={rate} />
                            </View>
                            <Text tw="pt-2 text-5xl text-center text-s-800 dark:text-s-300 font-bold">{rate}</Text>
                            <Text tw="text-lg leading-5 text-center text-s-800 dark:text-s-300">
                                (Отзывов: {activeNodeFromStore?.reviewsInfo?.count})
                            </Text>
                        </View>
                        <View tw="w-7/12">
                            {[1, 2, 3, 4, 5].map((i, _) => (
                                <SRate
                                    value={i}
                                    key={i.toString()}
                                    count={ratings[i]}
                                    maxRate={Math.max.apply(null, Object.values(ratings))}
                                />
                            ))}
                        </View>
                    </View>
                </>
            ) : (
                ''
            )}
        </View>
    );
};

export default WidgetNodeRating;
