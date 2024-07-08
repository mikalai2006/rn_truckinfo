import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import {useAppDispatch} from '~store/hooks';
import {setActiveNode} from '~store/appSlice';

import WidgetNodeHeader from '~components/widgets/node/WidgetNodeHeader';
import WidgetNodeButtons from '~components/widgets/node/WidgetNodeButtons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import WidgetNode from '~components/widgets/node/WidgetNode';
import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodeShortScreen'>;

const NodeShortScreen = (props: Props) => {
    // console.log('NodeShortScreen render');

    const {navigation, route} = props;
    const {marker: localNode} = route.params;

    const dispatch = useAppDispatch();

    useEffect(() => {
        // 👇️ run a function when the component unmounts 👇️
        return () => {
            // console.log('Close sheet');
            // props.route.params.marker = null;
            dispatch(setActiveNode(null));
        };
    }, [dispatch]);

    // const _node = useObject(NodeSchema, new BSON.ObjectId(marker._id));
    // const localNode = useMemo(() => {
    //     console.log('get localNode');
    //     return {..._node};
    // }, []);

    const ref = useRef<BottomSheet>(null);
    const snapPoints = ['35%', '50%', '75%', '100%'];
    const closeSheet = () => {
        // dispatch(setActiveNode(null));
        navigation && navigation.goBack();
    };
    const activeIndex = React.useRef(0);

    return (
        <View tw="flex-1">
            <UIBottomSheetScrollView
                ref={ref}
                key={localNode._id}
                onClose={() => {
                    closeSheet();
                }}
                snapPoints={snapPoints}
                onAnimate={(from, to) => {
                    activeIndex.current = to;
                }}
                index={activeIndex.current}
                enablePanDownToClose={true}
                header={
                    <View tw="bg-s-100 dark:bg-s-950 rounded-xl">
                        <View tw="mx-2 px-2">
                            <WidgetNodeHeader lid={localNode._id} />
                        </View>
                        <View tw="py-3">
                            <WidgetNodeButtons id={localNode._id} />
                        </View>
                    </View>
                }>
                <WidgetNode node={localNode} />
            </UIBottomSheetScrollView>
        </View>
    );
};

export default NodeShortScreen;
