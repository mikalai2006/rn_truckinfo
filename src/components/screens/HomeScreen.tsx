import React, {useState} from 'react';
import {Button, ScrollView, View} from 'react-native';
import WidgetAuth from '../widgets/WidgetAuth';
import Onboarding from '../Onboarding';
import {useColorScheme} from 'nativewind';

import WidgetLocation from '~components/widgets/WidgetLocation';
import FocusStatusBar from '~components/FocusStatusBar';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
// import HomeTabStack from '../navigations/HomeTabStack';

const HomeScreen = ({navigation}) => {
    const [helloScreen] = useState(false);
    const {colorScheme} = useColorScheme();

    return (
        <View style={{flex: 1, paddingTop: 0}} tw="bg-s-100 dark:bg-s-900">
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <View tw="mt-10 mb-4">
                <WidgetHeaderApp />
                <Button
                    onPress={() => {
                        navigation.navigate('AuthScreen');
                    }}
                    title="auth"
                />
            </View>
            <View tw="flex-1 flex bg-s-100 dark:bg-s-900">
                {helloScreen ? (
                    <Onboarding />
                ) : (
                    <ScrollView>
                        <View>
                            <WidgetLocation />
                        </View>
                        <ScrollView horizontal>
                            <View tw="bg-p-300 dark:bg-s-950 p-12 flex flex-row overflow-scroll">
                                <WidgetAuth />
                                <WidgetAuth />
                            </View>
                        </ScrollView>
                        <ScrollView horizontal>
                            <View tw="bg-p-500 dark:bg-s-900 p-4 flex flex-row overflow-scroll">
                                <WidgetAuth />
                                <WidgetAuth />
                            </View>
                        </ScrollView>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default HomeScreen;
