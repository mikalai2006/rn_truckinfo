import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {useColorScheme} from 'nativewind';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../utils/colors';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const WidgetShortInfoMarker = ({navigation}) => {
    const {colorScheme} = useColorScheme();

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

    // // callbacks
    // const handleSheetChanges = useCallback((index: number) => {
    //     console.log('handleSheetChanges', index);
    // }, []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}>
                    <View tw="bg-s-50 flex-1 items-center">
                        <Text>Awesome 🎉</Text>
                    </View>
                </BottomSheetModal>
                {/* <TouchableOpacity activeOpacity={0.7} tw="p-4 " onPress={() => navigation.goBack()}>
                <Icon
                    name="keyboard-backspace"
                    color={colorScheme === 'dark' ? colors.s[300] : colors.s[800]}
                    size={32}
                />
            </TouchableOpacity>
            <View tw="p-2 flex-auto">
                <Text tw="text-s-800 dark:text-s-300">
                    Szkoła Podstawowa w Dzierzgówku, Autostrada Wolności, Filipówka, Dzierzgówek, gmina Nieborów, powiat
                    łowicki, województwo łódzkie, 99-416, Polska
                </Text>
            </View>
            <View tw="p-2">
                <TouchableOpacity activeOpacity={0.7} tw="p-2 rounded-lg bg-p-500 text-white" onPress={() => {}}>
                    <Icon
                        name="map-marker-radius-outline"
                        color={colorScheme === 'dark' ? colors.s[300] : colors.s[100]}
                        size={32}
                    />
                </TouchableOpacity>
            </View> */}
            </View>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
    },
});

export default WidgetShortInfoMarker;
