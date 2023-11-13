/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    ActivityIndicator,
    // SafeAreaView,
    // ScrollView,
    View,
    StatusBar,
    LogBox,
} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // TODO
import {useColorScheme} from 'nativewind';

import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import colors from './src/utils/colors';
import HelloScreen from '~components/screens/HelloScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): JSX.Element {
    const {colorScheme} = useColorScheme();

    const backgroundStyle = {
        backgroundColor: colorScheme === 'dark' ? colors.s[800] : colors.s[100],
        flex: 1,
    };

    return (
        <Provider store={store}>
            <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
                <GestureHandlerRootView style={{flex: 1, paddingTop: 0}}>
                    <View style={{flex: 1}}>
                        {/* <StatusBar
                            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                            // backgroundColor={backgroundStyle.backgroundColor}
                            backgroundColor="transparent"
                        /> */}
                        <NavigationContainer>
                            <HelloScreen />
                        </NavigationContainer>
                        {/* <SafeAreaView style={backgroundStyle}> */}
                        {/* <DrawerSimple /> */}
                        {/* <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{title: 'My home'}}
          component={HomeScreen}
        />
        <Stack.Screen
          name="Details"
          options={({navigation, route}) => ({
            title: 'My Details',
            headerRight: () => <Button title="Update count" />,
          })}
          component={DetailsScreen}
        />
      </Stack.Navigator> */}
                        {/*<DrawerTest />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}> */}
                        {/* <Header /> */}
                        {/* <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View> */}
                        {/* </ScrollView> */}
                        {/* </SafeAreaView> */}
                    </View>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}

export default App;
