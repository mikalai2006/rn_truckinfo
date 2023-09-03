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
} from 'react-native';
import {StyledComponent, useColorScheme} from 'nativewind';

import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import colors from './src/utils/colors';
import HelloScreen from '~components/screens/HelloScreen';

function App(): JSX.Element {
    const {colorScheme} = useColorScheme();

    const backgroundStyle = {
        backgroundColor: colorScheme === 'dark' ? '#0f172a' : colors.s[100],
        flex: 1,
    };

    return (
        <Provider store={store}>
            <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
                <StyledComponent component={View} tw="flex-1 bg-s-100 dark:bg-s-800">
                    <StatusBar
                        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                        backgroundColor={backgroundStyle.backgroundColor}
                    />
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
                </StyledComponent>
            </PersistGate>
        </Provider>
    );
}

export default App;
