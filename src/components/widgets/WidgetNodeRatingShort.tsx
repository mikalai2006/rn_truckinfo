import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import SRateStar from '~components/ui/SRateStar';
import {useAppSelector} from '~store/hooks';
import {activeNode} from '~store/appSlice';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import SIcon from '~components/ui/SIcon';
import {iChevronDown} from '~utils/icons';

const WidgetNodeRatingShort = () => {
    const navigation = useNavigation();
    const activeNodeFromStore = useAppSelector(activeNode);
    // console.log('WidgetNodeRating: ', activeNodeFromStore?.osmId);

    const rate = useMemo(() => {
        return activeNodeFromStore && activeNodeFromStore?.reviewsInfo?.count > 0
            ? Number(activeNodeFromStore?.reviewsInfo.value / activeNodeFromStore?.reviewsInfo.count).toFixed(2)
            : 0;
    }, [activeNodeFromStore]);

    // const ratings = useMemo(() => {
    //     return activeNodeFromStore?.reviewsInfo?.ratings
    //         ? Object.fromEntries(
    //               activeNodeFromStore?.reviewsInfo.ratings?.map(x => {
    //                   return [x._id, x.count];
    //               }),
    //           )
    //         : {};
    // }, [activeNodeFromStore]);

    return (
        <View>
            {activeNodeFromStore?.osmId ? (
                <>
                    <TouchableOpacity tw="flex flex-row py-2" onPress={() => navigation.navigate('ReviewScreen')}>
                        <View tw="flex-auto flex flex-row items-center">
                            <View>
                                <Text tw="text-xl text-center text-s-800 dark:text-s-300">{rate}</Text>
                            </View>
                            <View tw="px-2">
                                <SRateStar value={rate} />
                            </View>
                            <View>
                                <Text tw="text-lg leading-5 text-center text-s-800 dark:text-s-300">
                                    (Отзывов: {activeNodeFromStore?.reviewsInfo?.count})
                                </Text>
                            </View>
                        </View>
                        <View tw="transform -rotate-90 self-end">
                            <SIcon path={iChevronDown} size={25} tw="text-s-700 dark:text-s-200" />
                        </View>
                    </TouchableOpacity>
                </>
            ) : (
                ''
            )}
        </View>
    );
};

export default WidgetNodeRatingShort;
