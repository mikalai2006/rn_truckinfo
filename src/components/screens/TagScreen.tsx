import React, {useCallback, useEffect, useRef} from 'react';

import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import SBottomSheet, {BottomSheetRefProps} from '~components/ui/SBottomSheet';
import {SSkeleton} from '~components/ui/SSkeleton';
const TagScreen = props => {
    console.log('TagScreen render');

    const {t} = useTranslation();
    const navigation = useNavigation();
    const tag = props.route.params.tag;

    const closeSheet = () => {
        // onClose && onClose();
        navigation && navigation.goBack();
    };
    const ref = useRef<BottomSheetRefProps>(null);
    const snapPoints = [0, -200, -400, -600];
    const onPress = useCallback(() => {
        const isActive = ref?.current?.isActive();
        if (isActive) {
            ref?.current?.scrollTo(0);
        } else {
            ref?.current?.scrollTo(snapPoints[1]);
        }
    }, [snapPoints]);

    useEffect(() => {
        onPress();
    }, [onPress]);

    return (
        <SBottomSheet
            ref={ref}
            onClose={() => {
                closeSheet();
            }}
            snapPoints={snapPoints}>
            {tag?.id ? (
                <>
                    <View tw="pt-10">
                        <Text tw="text-black">{tag?.title}</Text>
                        <Text tw="text-black">{tag?.description}</Text>
                    </View>
                </>
            ) : (
                <View tw="pt-6">
                    <View tw="flex flex-row px-6">
                        <View tw="w-16">
                            <SSkeleton classString="w-12 h-12 mr-4" />
                        </View>
                        <View tw="flex-auto">
                            <SSkeleton classString="h-4" />
                            <SSkeleton classString="h-4 mt-2" width={'80%'} />
                        </View>
                    </View>
                    <View tw="px-6">
                        <SSkeleton classString="h-6 mt-2" />
                    </View>
                    <View tw="px-6 flex flex-row flex-wrap">
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2" width={'32%'} />

                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2" width={'32%'} />
                    </View>
                </View>
            )}
        </SBottomSheet>
    );
};

export default TagScreen;
