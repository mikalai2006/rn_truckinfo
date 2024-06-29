import {View, Text, Linking, Platform, ToastAndroid, Share, Alert} from 'react-native';
import React from 'react';

import SIcon from '~components/ui/SIcon';
import {iCopy, iGeoAlt} from '~utils/icons';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';
import {useObject} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import UIButton from '~components/ui/UIButton';
import {ScrollView} from 'react-native-gesture-handler';

const ACCURACITY = 5;

const WidgetNodeButtons = props => {
    const {id} = props;
    const {t} = useTranslation();
    // const activeNodeFromStore = useAppSelector(activeNode);
    const node = useObject(NodeSchema, new BSON.ObjectId(id));
    // console.log('activeNodeFromStore: ', node);

    const scheme = Platform.select({
        ios: 'maps://0,0?q=',
        android: `geo:${node?.lat?.toFixed(ACCURACITY)},${node?.lon?.toFixed(ACCURACITY)}?q=`,
    });
    const latLng = `${node?.lat?.toFixed(ACCURACITY)},${node?.lon?.toFixed(ACCURACITY)}`;
    const label = `${node.name}`;
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
    });

    const copyToClipboard = () => {
        const str = `geo://${node.lat.toFixed(ACCURACITY)};${node.lon.toFixed(ACCURACITY)}?q=${label}`;
        Clipboard.setString(str);
        showToast();
        onShare(str);
    };

    //   const fetchCopiedText = async () => {
    //     const text = await Clipboard.getString();
    //     setCopiedText(text);
    //   };
    const showToast = () => {
        ToastAndroid.showWithGravity('All Your Base Are Belong To Us', ToastAndroid.SHORT, ToastAndroid.CENTER);
    };

    const onShare = async (str: string) => {
        try {
            const result = await Share.share({
                message: 'App name ' + str,
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
        <ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator={false}>
            <View tw="flex flex-row items-center px-3">
                <UIButton
                    type={'default'}
                    twClass="mr-2 p-2.5 px-3"
                    onPress={() => {
                        console.log(url);
                        url && Linking.openURL(url);
                    }}>
                    <View tw="flex flex-row items-center">
                        <SIcon size={20} path={iGeoAlt} tw="text-s-900 dark:text-s-500 mr-2" />
                        <View tw="flex-auto">
                            <Text numberOfLines={2} tw="text-base leading-4 text-s-900 dark:text-s-300">
                                {t('general:goNavi')}
                            </Text>
                        </View>
                    </View>
                </UIButton>
                <UIButton
                    type={'default'}
                    onPress={() => {
                        copyToClipboard();
                    }}
                    twClass="p-2.5 px-3">
                    <View tw="flex flex-row items-center">
                        <SIcon size={20} path={iCopy} tw="text-s-500 dark:text-s-500 mr-2" />
                        <View tw="flex-auto">
                            <Text tw="text-base leading-4 text-black dark:text-s-300">{t('general:copyPosition')}</Text>
                            {/* <Text tw="text-sm leading-5 text-s-400 dark:text-s-400">
                        {activeNodeFromStore?.lat},{activeNodeFromStore?.lon}
                    </Text> */}
                            {/* <Text tw="text-sm leading-4 text-s-600 dark:text-s-400">
                            {activeNodeFromStore?.address?.dAddress}
                        </Text> */}
                        </View>
                    </View>
                </UIButton>
                {/* <TouchableOpacity
                    tw="p-3 flex flex-row items-center bg-white dark:bg-s-950 rounded-lg border border-s-200 dark:border-s-900"
                    onPress={() => {
                        copyToClipboard();
                    }}>
                    <SIcon size={25} path={iCopy} tw="text-s-500 dark:text-s-400 mr-2" />
                    <View tw="flex-auto">
                        <Text tw="leading-4 text-black dark:text-s-200">{t('general:copyPosition')}</Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        </ScrollView>
    );
};

export default WidgetNodeButtons;
