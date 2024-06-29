import {View} from 'react-native';
import React from 'react';
import WidgetReviewForm from '~components/widgets/review/WidgetReviewForm';
import {useTranslation} from 'react-i18next';
// import BottomSheet from '@gorhom/bottom-sheet';
// import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import UIButton from '~components/ui/UIButton';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'ReviewFormScreen'>;

const ReviewFormScreen = (props: Props) => {
    const {navigation, route} = props;
    const {lid} = route.params;
    const {t} = useTranslation();

    // const ref = useRef<BottomSheet>(null);
    // const snapPoints = useMemo(() => ['94%'], []);
    // const closeSheet = () => {
    //     navigation && navigation.goBack();
    // };
    // <UIBottomSheetScrollView
    //     ref={ref}
    //     onClose={() => {
    //         closeSheet();
    //     }}
    //     snapPoints={snapPoints}>

    return (
        <View tw="flex-1 p-4 bg-s-50 dark:bg-s-950 pt-12">
            <WidgetReviewForm lid={lid} />
            <View tw="flex-auto pt-4">
                <UIButton type="default" text={t('general:close')} onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
};

export default ReviewFormScreen;
