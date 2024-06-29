import React, {useEffect, useMemo, useRef} from 'react';
import {Text, View} from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';
import {useAppDispatch} from '~store/hooks';
import {setActiveNode} from '~store/appSlice';

import {useObject} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import WidgetNode from '../widgets/node/WidgetNode';
import WidgetNodeHeader from '~components/widgets/node/WidgetNodeHeader';
import WidgetNodeButtons from '~components/widgets/node/WidgetNodeButtons';
import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodeScreen'>;

const NodeScreen = (props: Props) => {
    // console.log('NodeScreen render');

    const {navigation} = props;

    const dispatch = useAppDispatch();

    useEffect(() => {
        // 👇️ run a function when the component unmounts 👇️
        return () => {
            // console.log('Close sheet');
            // props.route.params.marker = null;
            dispatch(setActiveNode(null));
        };
    }, [dispatch]);

    const nodeFromRoute = useMemo(() => props.route.params.marker, [props.route.params.marker]);
    const _node = useObject(NodeSchema, new BSON.ObjectId(nodeFromRoute._id));
    const localNode = {..._node};

    const ref = useRef<BottomSheet>(null);
    const snapPoints = ['25%', '50%', '75%', '100%'];
    const closeSheet = () => {
        // dispatch(setActiveNode(null));
        navigation && navigation.goBack();
    };
    const activeIndex = React.useRef(0);

    return (
        <View tw="flex-1">
            <UIBottomSheetScrollView
                ref={ref}
                key={localNode._id?.toHexString()}
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
                            <WidgetNodeHeader lid={localNode._id?.toHexString()} />
                        </View>
                        <View tw="py-3">
                            <WidgetNodeButtons id={localNode._id} />
                        </View>
                    </View>
                }>
                {<WidgetNode node={localNode} />}
            </UIBottomSheetScrollView>
        </View>
    );
};

export default NodeScreen;
