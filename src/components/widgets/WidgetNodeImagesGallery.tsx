import {Animated, FlatList, Modal, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {INode} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {iChevronDown, iCloseLg, iEye} from '~utils/icons';

import RButton from '~components/r/RButton';
import {useTranslation} from 'react-i18next';
import WidgetNodeImagesGalleryItem from './WidgetNodeImagesGalleryItem';
import SUser from '~components/ui/SUser';
import OnboardingPagination from '~components/OnboardingPagination';

import dayjs from '~utils/dayjs';

export interface IWidgetNodeImagesGalleryProps {
    node: INode;
}

const WidgetNodeImagesGallery = (props: IWidgetNodeImagesGalleryProps) => {
    const {t} = useTranslation();
    const [isModalVisible, setisModalVisible] = useState(false);

    const changeModalVisiblity = (status: boolean) => {
        setisModalVisible(status);
    };

    const slidesRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = useRef(({viewableItems}: any) => {
        setCurrentIndex(viewableItems.length && viewableItems[0]?.index);
    }).current;

    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

    const scrollTo = (index: number) => {
        let newIndex = index;
        if (newIndex < 0) {
            newIndex = props.node?.images.length - 1;
        }
        if (newIndex > props.node?.images.length - 1) {
            newIndex = 0;
        }
        slidesRef.current && slidesRef.current.scrollToIndex({index: newIndex});
    };

    return (
        <View>
            <RButton
                customClass="bg-white dark:bg-black/60 p-3 rounded-full"
                onPress={() => changeModalVisiblity(true)}>
                <SIcon path={iEye} size={20} tw="text-black dark:text-white" />
            </RButton>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isModalVisible}
                statusBarTranslucent={true}
                onRequestClose={() => changeModalVisiblity(false)}>
                <View tw="flex-1 justify-end bg-black/70">
                    <View tw="flex-auto bg-white dark:bg-s-800 rounded-t-3xl">
                        <View tw="absolute z-10 px-2 top-10">
                            <TouchableOpacity
                                onPress={() => changeModalVisiblity(false)}
                                tw="bg-white/50 dark:bg-black/50 p-4 rounded-full">
                                <SIcon path={iCloseLg} size={20} tw="text-black dark:text-white" />
                            </TouchableOpacity>
                        </View>
                        {/* <Text tw="text-black">
                            {props.node?.name}-{props.node?.id}
                        </Text> */}
                        <FlatList
                            data={props.node?.images}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            bounces={false}
                            renderItem={({item}) => <WidgetNodeImagesGalleryItem image={item} />}
                            keyExtractor={item => item.id}
                            onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                                useNativeDriver: false,
                            })}
                            scrollEventThrottle={32}
                            onViewableItemsChanged={viewableItemsChanged}
                            viewabilityConfig={viewConfig}
                            ref={slidesRef}
                            style={[{flex: 3}]}
                        />
                        {props.node?.images?.length && (
                            <>
                                <View tw="absolute bottom-20 left-0 right-0 flex items-center">
                                    <OnboardingPagination slides={props.node.images} scrollX={scrollX} />
                                </View>
                                <View tw="flex flex-row items-center gap-2 px-2 bg-white dark:bg-s-800">
                                    {/* <View>
                                    <OnboardingPagination slides={props.node.images} scrollX={scrollX} />
                                </View> */}
                                    <View>
                                        <RButton
                                            customClass="bg-s-200 dark:bg-black/60 p-3 rounded-full rotate-90"
                                            onPress={() => scrollTo(currentIndex - 1)}>
                                            <SIcon path={iChevronDown} size={20} tw="text-black dark:text-white" />
                                        </RButton>
                                    </View>
                                    <View tw="flex-auto pb-4 flex gap-x-2 items-start">
                                        {/* <Text numberOfLines={2} tw="text-black dark:text-white text-center leading-8">
                                            {dayjs(props.node.images[currentIndex].createdAt).format(
                                                'YYYY-MM-DDTHH:mm:ss',
                                            )}
                                        </Text> */}
                                        <Text numberOfLines={1} tw="text-black dark:text-white text-center leading-8">
                                            {t('general:added')}{' '}
                                            {dayjs(props.node.images[currentIndex].createdAt).fromNow()}
                                        </Text>
                                        <View>
                                            <SUser user={props.node.images[currentIndex].user} />
                                        </View>
                                    </View>
                                    <View>
                                        <RButton
                                            customClass="bg-s-200 dark:bg-black/60 p-3 rounded-full -rotate-90"
                                            onPress={() => scrollTo(currentIndex + 1)}>
                                            <SIcon path={iChevronDown} size={20} tw="text-black dark:text-white" />
                                        </RButton>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WidgetNodeImagesGallery;
