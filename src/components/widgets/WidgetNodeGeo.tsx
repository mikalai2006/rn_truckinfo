import {View, Text, TouchableOpacity, Linking, Platform, ToastAndroid, Share, Alert} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {activeNode} from '~store/appSlice';

import SIcon from '~components/ui/SIcon';
import {iCopy, iGeoAlt} from '~utils/icons';
import Clipboard from '@react-native-clipboard/clipboard';

const WidgetNodeGeo = () => {
    const activeNodeFromStore = useAppSelector(activeNode);
    const scheme = Platform.select({ios: 'maps://0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${activeNodeFromStore?.lat},${activeNodeFromStore?.lon}`;
    const label = 'Custom Label';
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
    });

    const copyToClipboard = (str: string) => {
        Clipboard.setString(str);
        showToast();
        onShare();
    };

    //   const fetchCopiedText = async () => {
    //     const text = await Clipboard.getString();
    //     setCopiedText(text);
    //   };
    const showToast = () => {
        ToastAndroid.showWithGravity('All Your Base Are Belong To Us', ToastAndroid.SHORT, ToastAndroid.CENTER);
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: 'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <View tw="flex flex-row items-stretch border-b border-black/10">
            <View tw="w-1/2">
                <TouchableOpacity
                    tw="p-4 flex flex-row items-center"
                    onPress={() => {
                        url && Linking.openURL(url);
                    }}>
                    <SIcon size={20} path={iGeoAlt} tw="text-s-500 mr-2" />
                    <View>
                        <Text tw="text-lg leading-5 text-s-500 dark:text-s-400">Открыть в навигаторе</Text>
                        {/* <Text tw="text-sm leading-5 text-s-400 dark:text-s-400">
                        {activeNodeFromStore?.lat},{activeNodeFromStore?.lon}
                    </Text> */}
                    </View>
                </TouchableOpacity>
            </View>
            <View tw="w-1/2">
                <TouchableOpacity
                    tw="p-4 flex flex-row items-center"
                    onPress={() => {
                        copyToClipboard(`${activeNodeFromStore?.lat},${activeNodeFromStore?.lon}`);
                    }}>
                    <SIcon size={20} path={iCopy} tw="text-s-500 mr-2" />
                    <View>
                        <Text tw="text-lg leading-5 text-s-500 dark:text-s-400">Копировать позицию</Text>
                        {/* <Text tw="text-sm leading-5 text-s-400 dark:text-s-400">
                        {activeNodeFromStore?.lat},{activeNodeFromStore?.lon}
                    </Text> */}
                        {/* <Text tw="text-sm leading-4 text-s-600 dark:text-s-400">
                            {activeNodeFromStore?.address?.dAddress}
                        </Text> */}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WidgetNodeGeo;
