import React from 'react';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {View, StyleSheet} from 'react-native';
import WidgetUserInfoDrawer from '~components/widgets/user/WidgetUserInfoDrawer';
import SwitchMode from '~components/SwitchMode';
import {SafeAreaView} from 'react-native-safe-area-context';

export function CustomDrawer(props) {
    // const {t} = useTranslation();
    // const {colorScheme} = useColorScheme();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
            <SafeAreaView tw="flex-1 bg-s-200 dark:bg-s-800 border-b border-s-200 dark:border-s-900">
                <View tw="relative p-4">
                    <WidgetUserInfoDrawer />
                    <View tw="absolute right-4 top-0 z-10">
                        <SwitchMode />
                    </View>
                </View>
                <View tw="flex-1 flex bg-s-100 dark:bg-s-800">
                    <View tw="flex-auto m-0 p-0">
                        <DrawerItemList {...props} />
                    </View>
                </View>
            </SafeAreaView>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawer: {
        height: '100%',
        paddingTop: 0,
        shadowColor: 'red',
    },
});
