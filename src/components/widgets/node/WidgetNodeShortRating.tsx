import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import SRateStar from '~components/ui/SRateStar';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import SIcon from '~components/ui/SIcon';
import {iChevronDown} from '~utils/icons';
import {NodeSchema} from '~schema/NodeSchema';
import {INode} from '~store/appSlice';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import {useQuery} from '@realm/react';
import {ReviewSchema} from '~schema/ReviewSchema';
import {useTranslation} from 'react-i18next';

type Props = {
    localNode: NodeSchema | null;
    serverNode: INode | null;
    isRemovedNode: boolean;
};

const WidgetNodeShortRating = (props: Props) => {
    const {localNode, serverNode, isRemovedNode} = props;
    const {t} = useTranslation();
    const navigation = useNavigation<MapLocalStackParamList>();

    const localReviews = useQuery(ReviewSchema, items => {
        return items.filtered('nlid == $0 OR nodeId == $1', localNode?._id.toHexString(), serverNode?.id);
    });
    // const activeNodeFromStore = useAppSelector(activeNode);
    // console.log('localReviews: ', localReviews);

    const count = useMemo(() => {
        return serverNode?.reviewsInfo?.count || localReviews.length;
    }, [localReviews.length, serverNode?.reviewsInfo?.count]);

    // const rate = useMemo(() => {
    //     return serverNode && serverNode?.reviewsInfo?.count > 0
    //         ? Number(serverNode?.reviewsInfo.value / serverNode?.reviewsInfo.count).toFixed(2)
    //         : localReviews.reduce((ac, el) => ac + el.rate, 0);
    // }, [localReviews, serverNode]);
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

    return (
        <View>
            <>
                <View tw="flex-auto flex flex-row items-center">
                    <View>
                        <Text tw="text-xl text-center text-s-800 dark:text-s-300">{rate}</Text>
                    </View>
                    <View tw="px-2">
                        <SRateStar value={rate} />
                    </View>
                    <View>
                        <Text tw="text-lg leading-5 text-center text-s-800 dark:text-s-300">
                            ({t('general:reviewTotal')}: {count})
                        </Text>
                    </View>
                </View>
            </>
        </View>
    );
};

export default WidgetNodeShortRating;
