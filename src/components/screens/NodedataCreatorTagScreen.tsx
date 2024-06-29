import React, {useMemo, useRef, useState} from 'react';

import {Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ITagopt, TTagoptInput} from '~store/appSlice';
import {useObject, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import BottomSheet from '@gorhom/bottom-sheet';
import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';
import SIcon from '~components/ui/SIcon';
import UIButton from '~components/ui/UIButton';
import InputField from '~components/form/InputField';
import WidgetNodedataPrice from '~components/widgets/nodedata/WidgetNodedataPrice';
import WidgetNodedataNumber from '~components/widgets/nodedata/WidgetNodedataNumber';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodedataCreatorTagScreen'>;

const NodedataCreatorTagScreen = (props: Props) => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const tag = props.route.params.tag;

    const lid = props.route.params.lid;
    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const realm = useRealm();

    const allowTagopts = useMemo(() => {
        const result: TTagoptInput[] = [];

        if (tag?.options?.length) {
            result.push(...tag.options);
        } else if (tag?.type === 'checkone') {
            result.push({
                id: '000000000000000000000000',
                tagId: tag.id,
                value: 'yes',
                title: 'Yes',
            });
        }

        return result;
    }, [tag.id, tag.options]);

    const onAddTagopt = async (tagopt: ITagopt | null, value: any) => {
        if (!localNode) {
            return;
        }

        // console.log('node=>', localNode);

        const newData: NodeDataSchema = {
            _id: new BSON.ObjectId(),
            sid: '',
            nlid: localNode._id.toHexString(),
            nsid: localNode?.sid || '',
            // tagId: tag.id || tagopt?.tagId,
            tagoptId: tagopt?.id || '000000000000000000000000',
            value: value || tagopt?.value,
            isLocal: true,
        };
        if (tagopt) {
            newData.tagId = tagopt.tagId;
        } else {
            newData.tagId = tag.id;
        }

        realm.write(() => {
            realm.create('NodeDataSchema', newData);
        });
        // console.log('new NodeDataSchema: ', newData);

        navigation.goBack();

        // const newData: TNodedataInput = {
        //     nid: node.sid,
        //     tagId: tagopt.tagId,
        //     tagoptId: tagopt.id,
        //     data: {
        //         value: tagopt.value,
        //     },
        // };
        // await fetch(`${HOST_API}/nodedata`, {
        //     method: 'POST',
        //     headers: {
        //         'Access-Control-Allow-Origin-Type': '*',
        //         Authorization: `Bearer ${tokenStore.access_token}`,
        //     },
        //     body: JSON.stringify(newData),
        // })
        //     .then(r => r.json())
        //     .then(response => {
        //         if (response.message && response?.code === 401) {
        //             dispatch(setTokenAccess({access_token: 'refresh' + new Date().getTime()}));
        //         }

        //         if (response.id || response._id) {
        //             // nodeStore.data.push(response);
        //             onGetNode(activeLanguageFromStore?.code || 'en', {lat: node.lat, lon: node.lon})
        //                 .then(response => {
        //                     if (response?.message && response?.code === 401) {
        //                         console.log('401 marker');
        //                     }

        //                     dispatch(setActiveNode(response.data.node));
        //                 })
        //                 .catch(e => {
        //                     throw e;
        //                 });
        //         }
        //         return response;
        //     })
        //     .catch(e => {
        //         console.log('e=', e);

        //         throw e;
        //     })
        //     .finally(() => {
        //         // setLoading(false);
        //         navigation.goBack();
        //     });
    };

    const [listOptions, setListOptions] = useState<NodeDataSchema[]>([]);
    const onAddTagoptToList = async (tagopt: ITagopt | null, value: any) => {
        if (!localNode) {
            return;
        }

        const existIndex = listOptions.findIndex(x => x.tagoptId === tagopt?.id);
        console.log(existIndex, listOptions, tagopt);

        if (existIndex === -1) {
            const newData: NodeDataSchema = {
                _id: new BSON.ObjectId(),
                sid: '',
                nlid: localNode._id.toHexString(),
                nsid: localNode?.sid || '',
                // tagId: tag.id || tagopt?.tagId,
                tagoptId: tagopt?.id || '000000000000000000000000',
                value: value || tagopt?.value,
                isLocal: true,
            };
            if (tagopt) {
                newData.tagId = tagopt.tagId;
            } else {
                newData.tagId = tag.id;
            }
            setListOptions([...listOptions, newData]);
        } else {
            const cacheList = [...listOptions];
            cacheList.splice(existIndex, 1);
            setListOptions(cacheList);
        }
    };

    const onSave = () => {
        realm.write(() => {
            for (const item of listOptions) {
                realm.create('NodeDataSchema', item);
            }
        });
    };

    const ref = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '100%'], []);
    const closeSheet = () => {
        navigation && navigation.goBack();
    };
    const activeIndex = React.useRef(0);

    return (
        <UIBottomSheetScrollView
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
                <View tw="flex flex-row px-6 pt-6">
                    <View tw="pr-4">
                        {tag.props?.icon && <SIcon path={tag.props.icon} tw="text-s-800 dark:text-s-300" size={50} />}
                    </View>
                    <View tw="flex-auto">
                        <Text tw="text-xl leading-6 font-bold text-black dark:text-s-300">
                            {t('general:tagCreateTitle')} - {tag?.title}
                        </Text>
                        <Text tw="mt-1 text-base leading-5 text-black dark:text-s-400">{tag?.description}</Text>
                    </View>
                </View>
            }>
            <View tw="flex-1 px-6 mt-4">
                <View>
                    <Text tw="mt-1 text-base leading-5 text-s-800 dark:text-s-200">
                        {t('general:tagCreateDescription')}
                    </Text>
                    {/* <Text tw="text-black dark:text-white text-lg">{tag?.title}</Text>
                    <Text tw="text-black">{tag?.description}</Text>
                    <Text tw="text-black">{JSON.stringify(tag)}</Text> */}
                </View>
                {tag.type === 'checkone'
                    ? allowTagopts?.map((el, i) => (
                          <View key={i.toString()} tw="py-2">
                              <UIButton type="default" onPress={() => onAddTagopt(el, null)}>
                                  <View tw="px-3">
                                      <Text tw="text-lg font-bold text-s-800 dark:text-s-200">{el?.title}</Text>
                                      {el?.description && (
                                          <Text tw="text-base leading-5 text-s-800 dark:text-s-200">
                                              {el.description}
                                          </Text>
                                      )}
                                  </View>
                              </UIButton>
                          </View>
                      ))
                    : null}
                {tag.type === 'checkmany' ? (
                    <View>
                        {allowTagopts?.map((el, i) => {
                            const exist = listOptions.find(x => x.tagoptId === el.id);
                            return (
                                <View key={i.toString()} tw="py-2">
                                    <UIButton
                                        type={exist ? 'primary' : 'default'}
                                        onPress={() => onAddTagoptToList(el, null)}>
                                        <View tw="px-3">
                                            <Text
                                                tw={`text-lg font-bold ${
                                                    exist ? 'text-white dark:text-white' : 'text-s-800 dark:text-s-200'
                                                }`}>
                                                {el?.title}
                                            </Text>
                                            {el?.description && (
                                                <Text
                                                    tw={`text-base leading-5 ${
                                                        exist
                                                            ? 'text-white dark:text-white'
                                                            : 'text-s-800 dark:text-s-200'
                                                    }`}>
                                                    {el.description}
                                                </Text>
                                            )}
                                        </View>
                                    </UIButton>
                                </View>
                            );
                        })}
                        <UIButton
                            type="default"
                            disabled={listOptions.length === 0}
                            onPress={onSave}
                            text={t('general:save')}
                        />
                    </View>
                ) : null}
                {tag.type === 'price' ? (
                    <WidgetNodedataPrice tag={tag} onSave={value => onAddTagopt(null, value)} />
                ) : null}
                {tag.type === 'number' ? (
                    <WidgetNodedataNumber tag={tag} onSave={value => onAddTagopt(null, value)} />
                ) : null}
                <Text tw="text-black">{tag.type}</Text>
            </View>
        </UIBottomSheetScrollView>
    );
};

export default NodedataCreatorTagScreen;
