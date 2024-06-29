import React, {useMemo, useRef} from 'react';

import {Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '~store/hooks';
import {INodedata, ITag, amenities, tags} from '~store/appSlice';
import SIcon from '~components/ui/SIcon';
import {useObject, useQuery} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import UIBottomSheet from '~components/ui/UIBottomSheet';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import UIButton from '~components/ui/UIButton';
import {iPlusLg} from '~utils/icons';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodedataCreatorScreen'>;

const NodedataCreatorScreen = (props: Props) => {
    const {navigation, route} = props;
    const lid = route.params.lid;

    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));
    const localNodedatas = useQuery(NodeDataSchema, nodedatas => {
        return nodedatas.filtered('nlid == $0', lid);
    });
    // console.log('NodedataCreatorScreen render: ', lid, localNode, localNodedatas);

    const {t} = useTranslation();
    // const nodeStore = useAppSelector(activeNode);
    const amenityStore = useAppSelector(amenities);
    const amenityConfig = useMemo(() => (localNode ? amenityStore[localNode.type] : null), [amenityStore, localNode]);
    const tagStore = useAppSelector(tags);
    const tagsConfig = useMemo(() => {
        if (!amenityConfig) {
            return [];
        }

        const existNodedatas = [...(localNode?.data || []), ...(localNodedatas || [])]; //?.map(x => x.tagId);

        const objExistNodedatas: {
            [key: string]: INodedata[];
        } = {};
        existNodedatas.forEach(el => {
            if (!objExistNodedatas[el.tagId]) {
                objExistNodedatas[el.tagId] = [el];
            } else {
                objExistNodedatas[el.tagId].push(el);
            }
        });
        // console.log('objExistNodedatas=', objExistNodedatas);

        // const test = amenityConfig.tags.map(x => [x, tagStore[x]?.id]);
        // console.log(test);

        const result: ITag[] = [];
        amenityConfig.tags.forEach(tagId => {
            const tag = tagStore[tagId];
            if (!objExistNodedatas[tagId]) {
                result.push(tag);
            } else {
                const isNotCreatedOptions = tag.options.filter(el => {
                    return !objExistNodedatas[tagId].map(x => x.tagoptId).includes(el.id);
                });
                if (isNotCreatedOptions.length) {
                    //  && tag.multiopt === 2
                    //  || tag.type !== 'checkone'
                    const tagWithNotCreatedOptions = {...JSON.parse(JSON.stringify(tag)), options: isNotCreatedOptions};
                    result.push(tagWithNotCreatedOptions);
                }
            }
        });

        // amenityConfig.tags.map(x => tagStore[x]).filter(x => !objExistNodedatas[x.id]);

        return result;
    }, [amenityConfig, localNode?.data, localNodedatas, tagStore]);

    const ref = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '96%'], []);
    const closeSheet = () => {
        navigation && navigation.goBack();
    };
    const activeIndex = React.useRef(0);

    return (
        <UIBottomSheet
            ref={ref}
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
                <View tw="px-6 my-2">
                    <Text tw="text-xl font-bold text-s-800 dark:text-s-200">{t('general:tagCreateListTitle')}</Text>
                    <Text tw="mt-1 text-base leading-5 text-s-800 dark:text-s-200">
                        {t('general:tagCreateListDescription')}
                    </Text>
                </View>
            }>
            <BottomSheetFlatList
                data={tagsConfig}
                initialNumToRender={2}
                maxToRenderPerBatch={10}
                renderItem={({item, index}) => (
                    <View key={index.toString()} tw="pb-2 px-5">
                        <UIButton
                            type="default"
                            twClass=""
                            onPress={() =>
                                navigation.navigate('NodedataCreatorTagScreen', {
                                    tag: item,
                                    lid: localNode?._id.toHexString(),
                                })
                            }>
                            <View tw="flex flex-row items-center">
                                <View tw="flex-auto flex flex-row items-center">
                                    {/* <Text tw="text-black dark:text-white text-lg">
                    Добавил {dayjs(nodedata?.createdAt).fromNow()} пользователь
                </Text> */}
                                    {/* <SUser user={nodedata?.user} /> */}
                                    {item?.props?.icon && (
                                        <SIcon path={item.props.icon} size={20} tw="text-s-400 dark:text-s-500" />
                                    )}
                                    <Text tw="text-base text-s-800 dark:text-s-200 pl-2">{item?.title}</Text>
                                </View>
                                <View tw="">
                                    <SIcon path={iPlusLg} size={20} tw="text-s-400 dark:text-s-500" />
                                </View>
                                {/* <Text tw="text-black">{nodedata?.tag?.description}</Text>
                    <Text tw="text-black">{nodedata?.value}</Text> */}
                                {/* <Text tw="text-black">{JSON.stringify(tagsConfig)}</Text> */}
                            </View>
                        </UIButton>
                    </View>
                )}
                contentContainerStyle={{}}
                tw="flex-1"
            />
        </UIBottomSheet>
        //     <View tw="flex-1 p-2">
        //         <View tw="flex-1 p-2">
        //             {tagsConfig?.map((el, i) => (
        //             ))}
        //         </View>
        //     </View>
        // </UIBottomSheetFlatList>
    );
};

export default NodedataCreatorScreen;
