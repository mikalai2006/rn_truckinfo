import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import SIcon from '~components/ui/SIcon';
import {iList} from '~utils/icons';
// import HeaderUserInfo from '~components/HeaderUserInfo';

const WidgetHeaderApp = () => {
    const navigation = useNavigation();
    return (
        <View tw="">
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} activeOpacity={0.8} tw="py-2 px-2">
                <SIcon path={iList} size={32} tw="text-black dark:text-white" />
            </TouchableOpacity>

            {/* <View tw="mr-2 flex flex-row">
                <TouchableOpacity onPress={() => navigation.toggleDrawer()} activeOpacity={0.8} tw="p-3">
                    <SIcon path={iHeart} size={20} tw="text-black dark:text-white" />
                </TouchableOpacity>
            </View> */}
            {/* <HeaderUserInfo /> */}
        </View>
    );
};

export default WidgetHeaderApp;
