import React, {useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useColorScheme} from 'nativewind';

import FocusStatusBar from '~components/FocusStatusBar';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
import WidgetAuth from '../widgets/home/WidgetAuth';
import WidgetAppInfo from '~components/widgets/home/WidgetAppInfo';
import {useAppSelector} from '~store/hooks';
import {tokens} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import WidgetHomeSync from '~components/widgets/home/WidgetHomeSync';
import {SafeAreaView} from 'react-native-safe-area-context';
import WidgetNews from '~components/widgets/help/WidgetNews';

const HelpScreen = ({}) => {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const tokensFromStore = useAppSelector(tokens);

    useEffect(() => {
        const s = async () => {};
        s();
    }, []);

    return (
        <View tw="flex-1 bg-s-100 dark:bg-s-950">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <SafeAreaView tw="flex-1 border-b border-s-200 dark:border-s-900">
                <View tw="mt-0 px-4">
                    <WidgetHeaderApp />
                </View>
                <View tw="flex-1 flex">
                    <ScrollView tw="flex-1">
                        <View tw="flex-1 lg:flex-row">
                            <View tw="lg:w-1/2 px-6 lg:pr-0 lg:pl-6 pb-6">
                                <View tw="rounded-lg bg-white dark:bg-s-900 mb-6 p-4">
                                    <WidgetAppInfo />
                                </View>
                                <Text tw="text-s-700 dark:text-s-400 text-base mb-3 px-6">
                                    {t('general:recommendations')}:
                                </Text>
                                {tokensFromStore?.access_token ? null : (
                                    <View tw="rounded-lg bg-white dark:bg-s-900 mb-3 p-6">
                                        <WidgetAuth />
                                    </View>
                                )}
                                <View tw="rounded-lg bg-white dark:bg-s-900 mb-3 p-6">
                                    <WidgetHomeSync />
                                </View>
                            </View>
                            <View tw="lg:w-1/2 px-6 pb-6">
                                <View tw="bg-white dark:bg-s-900 rounded-lg p-4">
                                    {/* <WidgetHomeStat /> */}
                                    <WidgetNews />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default HelpScreen;
