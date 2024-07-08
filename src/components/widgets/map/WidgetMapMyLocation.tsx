// import {View, NativeEventEmitter, Alert, Appearance} from 'react-native';
// import React, {useEffect, useState} from 'react';

// import TestModule from '../../../../TestModule';
// import UIButton from '~components/ui/UIButton';
// import {TextInput} from 'react-native-gesture-handler';

// const WidgetMapMyLocation = () => {
//     useEffect(() => {
//         const emitterTestModule = new NativeEventEmitter(TestModule);

//         emitterTestModule.addListener('azimut', data => {
//             console.log('azimut: ', Math.round(data.angle || 0));
//         });

//         return () => {
//             emitterTestModule.removeAllListeners('azimut');
//             TestModule.stopUpdates();
//             TestModule.stopAzimut();
//         };
//     }, []);

//     useEffect(() => {
//         const subscription = Appearance.addChangeListener(preferences => {
//             const {colorScheme: scheme} = preferences;
//             console.log('scheme: ', scheme);
//         });

//         return () => subscription?.remove();
//     }, []);

//     return (
//         <View tw="">
//             <TextInput keyboardAppearance={'dark'} />
//             <UIButton
//                 type="default"
//                 text="go"
//                 onPress={() => {
//                     Alert.alert('hello', 'Test');
//                 }}
//             />
//             <UIButton type="default" text="stop" onPress={() => TestModule.stopAzimut()} />
//         </View>
//     );
// };

// export default WidgetMapMyLocation;
