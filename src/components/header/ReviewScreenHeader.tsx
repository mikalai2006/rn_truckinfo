import {useColorScheme} from 'nativewind';
import React, {useMemo, useState} from 'react';
import {Alert, Modal, Text, TouchableOpacity, View} from 'react-native';
import FocusStatusBar from '~components/FocusStatusBar';
import SIcon from '~components/ui/SIcon';
import {IAmenity, activeNode, amenities} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';
import {iChevronDown, iDotsHorizontal} from '~utils/icons';
const ReviewScreenHeader = ({navigation, route, options, back}) => {
    const {colorScheme} = useColorScheme();
    const nodeStore = useAppSelector(activeNode);
    const amenityStore = useAppSelector(amenities);

    const amenity: IAmenity | null = useMemo(() => {
        return nodeStore ? amenityStore[nodeStore.type] : null;
    }, [amenityStore, nodeStore]);

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <FocusStatusBar
                barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
                translucent
                backgroundColor="transparent"
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View>
                    <View>
                        <Text>Hello World!</Text>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                            <Text>Hide Modal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View tw="bg-s-100 dark:bg-s-800 pt-6 px-4 pb-2 flex flex-row items-center space-x-4">
                <View>
                    <TouchableOpacity onPress={navigation.goBack} tw="rounded-md overflow-hidden">
                        <View tw="transform rotate-90 p-2">
                            <SIcon path={iChevronDown} size={25} tw="text-s-500" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View tw="flex-auto">
                    <Text numberOfLines={2} ellipsizeMode="tail" tw="text-xl text-black dark:text-s-200 font-bold">
                        {amenity?.title} - {nodeStore?.name}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} tw="rounded-md overflow-hidden">
                        <View tw="transform rotate-90 p-2">
                            <SIcon path={iDotsHorizontal} size={25} tw="text-s-500" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default ReviewScreenHeader;
