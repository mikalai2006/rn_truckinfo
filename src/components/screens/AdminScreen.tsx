import React, {useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useColorScheme} from 'nativewind';

import FocusStatusBar from '~components/FocusStatusBar';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
import {useAppSelector} from '~store/hooks';
import {tokens, user} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import UIButton from '~components/ui/UIButton';
import {hostAPI} from '~utils/global';

const AdminScreen = ({}) => {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const tokensFromStore = useAppSelector(tokens);
    const userFromStore = useAppSelector(user);

    const onCreateFiles = async () => {
        await fetch(hostAPI + '/file/create', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokensFromStore?.access_token}`,
            },
        }).then(r => r.json());
    };

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
                    {userFromStore?.roles.includes('admin') ? (
                        <ScrollView tw="flex-1">
                            <View tw="flex-1 lg:flex-row">
                                <View tw="lg:w-1/2 px-6 pb-6">
                                    <View tw="bg-white dark:bg-s-900 rounded-lg p-4">
                                        <UIButton
                                            text="create file"
                                            type="default"
                                            onPress={() => {
                                                onCreateFiles();
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    ) : (
                        <Text>No admin</Text>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default AdminScreen;
