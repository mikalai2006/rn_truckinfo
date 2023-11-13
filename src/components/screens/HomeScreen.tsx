import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
// import WebviewBlok from '../WebviewBlok';
import {useAppSelector} from '../../store/hooks';
import {tokens} from '../../store/appSlice';
import WidgetAuth from '../widgets/WidgetAuth';
import Onboarding from '../Onboarding';
import {StyledComponent, useColorScheme} from 'nativewind';
// import {SafeAreaView} from 'react-native-safe-area-context';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WidgetLocation from '~components/widgets/WidgetLocation';
import FocusStatusBar from '~components/FocusStatusBar';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
// import HomeTabStack from '../navigations/HomeTabStack';

const Stack = createNativeStackNavigator();

const HomeScreen = ({}) => {
    const token = useAppSelector(tokens);
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
            </View>
            <StyledComponent component={View} tw="flex-1 flex bg-s-100 dark:bg-s-900">
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
                {/* <Text className="font-bold">{token.refresh_token}</Text> */}
                {/* <WebviewBlok
        source={{
          uri: 'http://localhost:3000/',
          // headers: {
          //   Cookie: `jwt-handmade=${token.refresh_token};`,
          // },
        }}
      /> */}
            </StyledComponent>
        </View>
    );
};

export default HomeScreen;
