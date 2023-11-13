import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import SIcon from '~components/ui/SIcon';
import {iHandThumbsDown, iHandThumbsUp, iHandThumbsUpFill} from '~utils/icons';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {activeNode, setActiveNode} from '~store/appSlice';

const WidgetNodeLikes = () => {
    const activeNodeFromStore = useAppSelector(activeNode);
    const dispatch = useAppDispatch();

    const maxValue = 100 / (activeNodeFromStore?.like?.like + activeNodeFromStore?.like?.dlike);

    const onLike = (status: number) => {
        let val = 0;
        if (status === 1) {
            val = activeNodeFromStore.like.like + 1;
            dispatch(setActiveNode({...activeNodeFromStore, like: {...activeNodeFromStore?.like, like: val}}));
        } else if (status === -1) {
            val = activeNodeFromStore.like.dlike + 1;
            dispatch(setActiveNode({...activeNodeFromStore, like: {...activeNodeFromStore?.like, dlike: val}}));
        }
    };

    return (
        <View tw="p-2 flex flex-row justify-center gap-x-2">
            {/* <Text>{maxValue}</Text> */}
            <TouchableOpacity activeOpacity={0.8} tw="p-2 rounded-lg bg-s-200 dark:bg-s-600" onPress={() => onLike(-1)}>
                <SIcon path={iHandThumbsDown} size={25} tw="text-red-700 dark:text-red-400" />
            </TouchableOpacity>
            <View tw="flex-auto flex flex-row items-center h-10">
                {activeNodeFromStore?.like?.dlike ? (
                    <View
                        tw="bg-red-400 rounded-l-lg flex items-center justify-center"
                        style={{width: maxValue * activeNodeFromStore?.like?.dlike - 1 + '%', height: '80%'}}>
                        {Math.round(activeNodeFromStore?.like?.dlike * maxValue) > 15 ? (
                            <Text tw="text-lg text-red-900">
                                {Math.round(activeNodeFromStore?.like?.dlike * maxValue)}%
                            </Text>
                        ) : (
                            ''
                        )}
                    </View>
                ) : (
                    ''
                )}
                {!activeNodeFromStore?.like?.dlike && !activeNodeFromStore?.like?.like ? (
                    <View
                        tw="bg-s-200 rounded-l-lg flex items-center justify-center"
                        style={{width: '49%', height: '80%'}}>
                        <Text tw="text-lg text-s-900">{activeNodeFromStore?.like?.dlike}</Text>
                    </View>
                ) : (
                    ''
                )}
                <View tw="bg-s-300 dark:bg-s-600 h-full" style={{width: '2%'}} />
                {activeNodeFromStore?.like?.like ? (
                    <View
                        tw="bg-green-600 rounded-r-lg flex items-center justify-center"
                        style={{width: maxValue * activeNodeFromStore?.like?.like - 1 + '%', height: '80%'}}>
                        {Math.round(activeNodeFromStore?.like?.like * maxValue) > 15 ? (
                            <Text tw="text-lg text-green-50">
                                {Math.round(activeNodeFromStore?.like?.like * maxValue)}%
                            </Text>
                        ) : (
                            ''
                        )}
                    </View>
                ) : (
                    ''
                )}
                {!activeNodeFromStore?.like?.dlike && !activeNodeFromStore?.like?.like ? (
                    <View
                        tw="bg-s-200 rounded-r-lg flex items-center justify-center"
                        style={{width: '49%', height: '80%'}}>
                        <Text tw="text-lg text-s-900">{activeNodeFromStore?.like?.like}</Text>
                    </View>
                ) : (
                    ''
                )}
            </View>

            <TouchableOpacity activeOpacity={0.8} tw="p-2 rounded-lg bg-s-200 dark:bg-s-600" onPress={() => onLike(1)}>
                <SIcon path={iHandThumbsUpFill} size={25} tw="text-green-700 dark:text-green-400" />
            </TouchableOpacity>
        </View>
    );
};

export default WidgetNodeLikes;
