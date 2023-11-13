// import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';

import WidgetFeature from '../widgets/WidgetFeature';
import SBottomSheet, {BottomSheetRefProps} from '../ui/SBottomSheet';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {feature, setActiveNode, setFeature} from '~store/appSlice';
// import WidgetNodeRating from './WidgetNodeRating';
// import WidgetNodeTags from '../widgets/WidgetNodeTags';
// import RButton from '~components/r/RButton';
// import {Text, View} from 'react-native';
import WidgetNodeRatingShort from './WidgetNodeRatingShort';
import {ScrollView} from 'react-native-gesture-handler';
import WidgetNodeTagsLine from './WidgetNodeTagsLine';
// import WidgetNodeButtons from './WidgetNodeButtons';
// import WidgetNodeImagesLine from './WidgetNodeImagesLine';
import WidgetNodeLikes from './WidgetNodeLikes';
import WidgetNodeVisited from './WidgetNodeVisited';
import WidgetNodeVisitedTime from './WidgetNodeVisitedTime';
import RButton from '~components/r/RButton';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import WidgetNodeGeo from './WidgetNodeGeo';
import RImage from '~components/r/RImage';
import SIcon from '~components/ui/SIcon';
import {iCamera, iChevronDown, iHeart, iWarning} from '~utils/icons';

const WidgetMapBottomSheet = ({onClose}) => {
    console.log('WidgetMapBottomSheet');

    const {t} = useTranslation();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const closeSheet = () => {
        //     webviewRef.current?.injectJavaScript(
        //         `(function() {
        //     document.dispatchEvent(new MessageEvent('message',
        //       ${JSON.stringify({
        //           data: {
        //               event: 'closenode',
        //               status: false,
        //           },
        //       })}));
        //   })();
        //   `,
        //     );
        onClose && onClose();
        dispatch(setFeature(null));
        dispatch(setActiveNode(null));
        navigation && navigation.goBack();
    };

    const featureFromStore = useAppSelector(feature);
    // const activeNodeData = useAppSelector(activeNode);
    const ref = useRef<BottomSheetRefProps>(null);
    const snapPoints = [0, -300, -600];
    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(snapPoints[1]);
        }
    }, []);

    useEffect(() => {
        if (featureFromStore?.id) {
            console.log('Change feature', featureFromStore?.id);
            // navigation.navigate('PointStack');
            // bottomSheetModalRef.current?.present();
            onPress();
        }
    }, [featureFromStore, onPress]);

    return (
        <SBottomSheet
            ref={ref}
            // key={featureData?.id}
            onClose={() => {
                closeSheet();
            }}
            snapPoints={snapPoints}
            topheader={
                <View tw="relative flex-1">
                    <RImage
                        classString="absolute h-full w-full"
                        uri={
                            'https://lh5.googleusercontent.com/p/AF1QipO8MMrx4AwWQxTgESA_-vCaKbovWqUcofLPn1eG=w408-h306-k-no'
                        }
                    />
                    <View tw="p-2 px-4 absolute bottom-0 flex flex-row gap-x-2">
                        <View>
                            <RButton customClass="bg-white dark:bg-black/60 p-3 rounded-full">
                                <SIcon path={iCamera} size={20} tw="text-black dark:text-white" />
                            </RButton>
                        </View>
                        <View tw="flex-auto self-start" />
                        <View>
                            <RButton customClass="bg-white dark:bg-black/60 p-3 rounded-full rotate-90">
                                <SIcon path={iChevronDown} size={20} tw="text-black dark:text-white" />
                            </RButton>
                        </View>
                        <View>
                            <RButton customClass="bg-white dark:bg-black/60 p-3 rounded-full -rotate-90">
                                <SIcon path={iChevronDown} size={20} tw="text-black dark:text-white" />
                            </RButton>
                        </View>
                    </View>
                </View>
            }>
            {featureFromStore?.id ? (
                <>
                    {/* <View tw="p-2 flex flex-row gap-x-2">
                        <View>
                            <RButton customClass="bg-s-700 p-3 rounded-full">
                                <SIcon path={iCamera} size={25} tw="text-white" />
                            </RButton>
                        </View>
                        <View tw="flex-auto self-start" />
                        <View>
                            <RButton customClass="bg-s-800 p-3 rounded-full">
                                <SIcon path={iHeart} size={25} tw="text-white" />
                            </RButton>
                        </View>
                        <View>
                            <RButton customClass="bg-s-800 p-3 rounded-t-md">
                                <SIcon path={iWarning} size={25} tw="text-white" />
                            </RButton>
                        </View>
                    </View> */}
                    <WidgetFeature />
                    {/* <Text>translateY={ref.current?.translateY?.value}</Text> */}
                    <View tw="py-1 px-4">
                        <WidgetNodeRatingShort />
                    </View>
                    {/* <WidgetNodeLikes /> */}
                    <ScrollView tw="flex-1">
                        <WidgetNodeTagsLine />
                        {/* <WidgetNodeImagesLine /> */}
                        <WidgetNodeVisited />
                        <WidgetNodeVisitedTime />
                        {/* <WidgetNodeButtons /> */}
                    </ScrollView>
                    <View tw="border-y border-black/10">
                        <WidgetNodeGeo />
                    </View>
                    {/* <WidgetNodeRating /> */}
                    {/* <ScrollView>
                            <WidgetAddReview />
                            <WidgetListReview />
                        </ScrollView> */}
                    {/* <PointStack navigation={false} index={1} /> */}
                    <View tw="px-4">
                        <RButton onPress={() => navigation.navigate('PointStack')}>
                            <Text tw="text-xl text-white">{t('general:more')}</Text>
                        </RButton>
                    </View>
                </>
            ) : (
                ''
            )}
        </SBottomSheet>
    );
};

export default WidgetMapBottomSheet;
