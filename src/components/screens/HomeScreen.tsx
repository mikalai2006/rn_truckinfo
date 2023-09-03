import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
// import WebviewBlok from '../WebviewBlok';
import {useAppSelector} from '../../store/hooks';
import {tokens} from '../../store/appSlice';
import WidgetAuth from '../widgets/WidgetAuth';
import Onboarding from '../Onboarding';
import {StyledComponent} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WidgetLocation from '~components/widgets/WidgetLocation';
// import HomeTabStack from '../navigations/HomeTabStack';

const Stack = createNativeStackNavigator();

const HomeScreen = ({navigation}) => {
    const token = useAppSelector(tokens);
    const [helloScreen] = useState(false);

    return (
        <SafeAreaView tw="flex-1">
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
          uri: 'http://localhost:1111/',
          // headers: {
          //   Cookie: `jwt-handmade=${token.refresh_token};`,
          // },
        }}
      /> */}
            </StyledComponent>
        </SafeAreaView>
    );
};

export default HomeScreen;
