import React, {useRef, useState} from 'react';
import {View, FlatList, Animated} from 'react-native';

import slides from '../utils/slides';
import OnboardingItem from './OnboardingItem';

import OnboardingPagination from './OnboardingPagination';
import OnboardingNextButton from './OnboardingNextButton';

export default function Onboarding() {
    const slidesRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({index: currentIndex + 1});
        } else {
        }
    };

    return (
        <View tw="min-h-full flex-1 bg-s-100 dark:bg-s-900">
            <FlatList
                data={slides}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                renderItem={({item}) => <OnboardingItem item={item} />}
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
            <OnboardingPagination slides={slides} scrollX={scrollX} />
            <OnboardingNextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
        </View>
    );
}
