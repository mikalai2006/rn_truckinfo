import React from 'react';
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

const HomeScreen = ({}) => {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const tokensFromStore = useAppSelector(tokens);

    return (
        <View style={{flex: 1, paddingTop: 0}} tw="bg-s-200 dark:bg-s-900">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <View tw="mt-8 px-4">
                <WidgetHeaderApp />
            </View>
            <View tw="flex-1 flex">
                <ScrollView>
                    <View tw="p-6 bg-s-200 dark:bg-s-900">
                        <View tw="bg-white dark:bg-s-800 rounded-lg p-4">
                            <WidgetAppInfo />
                        </View>
                    </View>
                    <View tw="bg-s-200 dark:bg-s-900 pb-6">
                        <Text tw="text-s-700 dark:text-s-400 text-base mb-2 px-6">{t('general:recommendations')}:</Text>
                        <ScrollView horizontal tw="px-6">
                            {tokensFromStore?.access_token ? null : (
                                <View tw="rounded-lg bg-white dark:bg-s-800 max-w-[300px] mr-6">
                                    <WidgetAuth />
                                </View>
                            )}
                            <View tw="rounded-lg bg-white dark:bg-s-800 max-w-[300px] mr-6">
                                <WidgetHomeSync />
                            </View>
                        </ScrollView>
                    </View>
                    {/* <ScrollView horizontal>
                        <View tw="bg-white dark:bg-s-900 p-4 flex flex-row overflow-scroll">
                            <WidgetAuth />
                            <WidgetAuth />
                        </View>
                    </ScrollView> */}
                </ScrollView>
            </View>
        </View>
    );
};

export default HomeScreen;
