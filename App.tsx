/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ActivityIndicator, View, LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // TODO

import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HelloStack from '~components/navigations/HelloStack';

function App(): JSX.Element {
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
                            <HelloStack />
                        </NavigationContainer>
                    </View>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}

export default App;
