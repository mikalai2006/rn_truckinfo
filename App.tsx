import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ActivityIndicator, LogBox, View} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // TODO

import {NavigationContainer} from '@react-navigation/native';

import 'react-native-get-random-values';
import {RealmProvider} from '@realm/react';

import {Provider} from 'react-redux';
import {store, persistor} from './src/store/store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HelloStack from '~components/navigations/HelloStack';

import {NodeSchema} from '~schema/NodeSchema';
import {NodeDataSchema, NodeDataSchemaEmbedded} from '~schema/NodeDataSchema';
import {ImageSchema} from '~schema/ImageSchema';
import {ImageObjectSchema} from '~schema/ImageObjectSchema';
import {CountryStat} from '~schema/CountryStat';
import {LikeSchema} from '~schema/LikeSchema';
import {ReviewSchema} from '~schema/ReviewSchema';
import {NodeAuditSchema} from '~schema/NodeAuditSchema';
import {PointSchema} from '~schema/PointSchema';

const schemas = [
    NodeSchema,
    NodeDataSchema,
    ImageSchema,
    ImageObjectSchema,
    CountryStat,
    LikeSchema,
    NodeDataSchemaEmbedded,
    ReviewSchema,
    NodeAuditSchema,
    PointSchema,
];

function App(): JSX.Element {
    return (
        <Provider store={store}>
            <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
                <GestureHandlerRootView style={styles.root}>
                    <View style={styles.view}>
                        <NavigationContainer>
                            <RealmProvider schema={schemas} deleteRealmIfMigrationNeeded={true}>
                                <HelloStack />
                            </RealmProvider>
                            {/* {type === 'none' && <WidgetNoConnect />} */}
                        </NavigationContainer>
                    </View>
                </GestureHandlerRootView>
            </PersistGate>
        </Provider>
    );
}

const styles = {
    root: {flex: 1, paddingTop: 0},
    view: {flex: 1},
};

export default App;
