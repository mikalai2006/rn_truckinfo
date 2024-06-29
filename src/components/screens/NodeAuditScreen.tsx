import {Modal, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
// import BottomSheet from '@gorhom/bottom-sheet';
// import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import UIButton from '~components/ui/UIButton';
import WidgetNodeAuditForm from '~components/widgets/node/WidgetNodeAuditForm';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodeAuditScreen'>;

const NodeAuditScreen = (props: Props) => {
    const {navigation, route} = props;
    const {lid, isServerNodeRemove} = route.params;
    const {t} = useTranslation();

    // const ref = useRef<BottomSheet>(null);
    // const snapPoints = useMemo(() => ['94%'], []);
    // const closeSheet = () => {
    //     navigation && navigation.goBack();
    // };
    // <UIBottomSheetScrollView
    //     ref={ref}
    //     onClose={() => {
    //         closeSheet();
    //     }}
    //     snapPoints={snapPoints}>
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View tw="flex-1 p-4 pt-12 bg-s-100 dark:bg-s-950">
            <View tw="bg-red-500/10 p-4 rounded-lg">
                <Text tw="text-xl font-bold text-s-900 dark:text-s-200">{t('general:deleteNodeTitle')}</Text>
                <Text tw="text-base leading-5 text-s-900 dark:text-s-200 pb-3">
                    {t('general:deleteNodeDescription')}
                </Text>

                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    activeOpacity={0.5}
                    tw="p-3 rounded-xl border border-red-500/20">
                    <View tw="flex flex-row items-center justify-center">
                        <Text tw="text-base text-red-500 dark:text-red-300">{t('general:deleteNode')}</Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View tw="flex-1 bg-black/50 p-3 pt-32">
                        <View tw="rounded-lg overflow-hidden bg-s-50 dark:bg-s-800">
                            <WidgetNodeAuditForm lid={lid} isServerNodeRemove={isServerNodeRemove} />
                            {/* <Text>Hello World!</Text> */}
                            <View tw="px-6 pb-6">
                                <UIButton
                                    type="default"
                                    text={t('general:cancel')}
                                    onPress={() => setModalVisible(!modalVisible)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <View tw="flex-auto pt-4">
                <UIButton type="default" text={t('general:back')} onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
};

export default NodeAuditScreen;
