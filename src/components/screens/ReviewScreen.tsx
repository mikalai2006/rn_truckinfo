import {Text, View} from 'react-native';

import React, {useMemo, useRef} from 'react';

import WidgetNodeRating from '~components/widgets/node/WidgetNodeRating';
import {iPlusLg} from '~utils/icons';
import SIcon from '~components/ui/SIcon';
import BottomSheet from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import WidgetNodeHeader from '~components/widgets/node/WidgetNodeHeader';
import UIButton from '~components/ui/UIButton';
import {useTranslation} from 'react-i18next';
import UIBottomSheet from '~components/ui/UIBottomSheet';
import WidgetReviewList from '~components/widgets/review/WidgetReviewList';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'ReviewScreen'>;

const ReviewScreen = (props: Props) => {
    // console.log('Render ReviewScreen');

    const {route, navigation} = props;
    const {lid, serverNode} = route.params;

    const {t} = useTranslation();

    // const ref = useRef<BottomSheet>(null);
    // const snapPoints = useMemo(() => ['50%', '96%'], []);
    // const closeSheet = () => {
    //     navigation && navigation.goBack();
    // };
    // const activeIndex = React.useRef(0);
    // <UIBottomSheet
    //     ref={ref}
    //     onClose={() => {
    //         closeSheet();
    //     }}
    //     snapPoints={snapPoints}
    //     onAnimate={(from, to) => {
    //         activeIndex.current = to;
    //     }}
    //     index={activeIndex.current}
    //     enablePanDownToClose={true}
    //     header={
    //         <View tw="px-6">
    //             <WidgetNodeHeader lid={lid} />
    //             {/* <Text tw="text-xl font-bold text-s-800 dark:text-s-200">{t('general:tagCreateListTitle')}</Text>
    //             <Text tw="mt-1 text-base leading-5 text-s-800 dark:text-s-200">
    //                 {t('general:tagCreateListDescription')}
    //             </Text> */}
    //             {/* <ReviewScreenHeader navigation={navigation} route={route} options={options} back={back} /> */}
    //         </View>
    //     }>

    return (
        <View tw="flex-1 pt-6 flex bg-s-100 dark:bg-s-950">
            <View tw="px-6">
                <WidgetNodeHeader lid={lid} />
                {/* <Text tw="text-xl font-bold text-s-800 dark:text-s-200">{t('general:tagCreateListTitle')}</Text>
                    <Text tw="mt-1 text-base leading-5 text-s-800 dark:text-s-200">
                        {t('general:tagCreateListDescription')}
                    </Text> */}
                {/* <ReviewScreenHeader navigation={navigation} route={route} options={options} back={back} /> */}
            </View>
            <View tw="shrink-0 grow-0">
                <View tw="mx-3 p-3 bg-white dark:bg-s-950 rounded-xl">
                    <WidgetNodeRating lid={lid} serverNode={serverNode} />
                </View>
                {/* <WidgetReviewForm />
                 */}
                <View tw="mx-3 mt-2">
                    <UIButton type="default" onPress={() => navigation.navigate('ReviewFormScreen', {lid: lid})}>
                        <View tw="flex flex-row items-center justify-center">
                            <SIcon path={iPlusLg} size={25} tw="text-s-500 dark:text-s-200" />
                            <Text tw="pl-2 text-black dark:text-s-200 text-xl">{t('general:addReview')}</Text>
                        </View>
                    </UIButton>
                </View>
            </View>
            <View tw="flex-auto">
                <WidgetReviewList lid={lid} serverNode={serverNode} />
            </View>
        </View>
    );
};

export default ReviewScreen;
