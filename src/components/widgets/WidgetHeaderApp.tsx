import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SIcon from '~components/ui/SIcon';
import {iHeart, iList} from '~utils/icons';
import HeaderUserInfo from '~components/HeaderUserInfo';

const WidgetHeaderApp = () => {
    const navigation = useNavigation();
    return (
        <View tw="mx-4 flex flex-row items-center justify-between bg-white dark:bg-s-800 rounded-full">
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} activeOpacity={0.8} tw="p-3">
                <SIcon path={iList} size={20} tw="text-black dark:text-white" />
            </TouchableOpacity>

            <View tw="mr-2 flex flex-row">
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} activeOpacity={0.8} tw="p-3">
                    <SIcon path={iHeart} size={20} tw="text-black dark:text-white" />
                </TouchableOpacity>
                {/* <HeaderUserInfo /> */}
            </View>
        </View>
    );
};

export default WidgetHeaderApp;
