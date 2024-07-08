import React, {useMemo, useRef, useState} from 'react';

import {Alert, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ITagopt, TTagoptInput} from '~store/appSlice';
import {useObject, useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import BottomSheet from '@gorhom/bottom-sheet';
import UIBottomSheetScrollView from '~components/ui/UIBottomSheetScrollView';
import SIcon from '~components/ui/SIcon';
import UIButton from '~components/ui/UIButton';
import WidgetNodedataPrice from '~components/widgets/nodedata/WidgetNodedataPrice';
import WidgetNodedataNumber from '~components/widgets/nodedata/WidgetNodedataNumber';
import RImage from '~components/r/RImage';
import {LikeSchema, TLikeSchema} from '~schema/LikeSchema';

type Props = NativeStackScreenProps<MapLocalStackParamList, 'NodedataCreatorTagScreen'>;

const NodedataCreatorTagScreen = (props: Props) => {
    const {t} = useTranslation();
    const navigation = useNavigation();
    const tag = props.route.params.tag;

    const lid = props.route.params.lid;
    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const realm = useRealm();

    const localLikes = useQuery(LikeSchema);

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

        const existNodedata = localNode.data.find(x => x.tagId === tag.id && x.value === value);
        if (existNodedata) {
            Alert.alert(t('general:info'), t('general:infoExistNodedataValue'));
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
            addLikeTag(newData._id.toHexString());
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

    const addLikeTag = (localNodedataId: string) => {
        const newData: TLikeSchema = {
            localNodedataId: localNodedataId,
            serverNodedataId: '',
            value: 1,
            oldValue: 0,
            ccode: localNode?.ccode,
            nlid: localNode?._id.toHexString(),
            isLocal: true,
        };

        // realm.write(() => {
        const existLike = localLikes.filter(like => like.localNodedataId === localNodedataId);
        // console.log('existLike=', existLike);

        realm.create(
            LikeSchema,
            {
                ...newData,
                oldValue: existLike[0]?.oldValue || 0,
                _id: existLike[0]?._id || new BSON.ObjectId(),
            },
            UpdateMode.Modified,
        );
        // console.log('localLikes=', localLikes);
        // });
    };

    const [listOptions, setListOptions] = useState<NodeDataSchema[]>([]);
    const onAddTagoptToList = async (tagopt: ITagopt | null, value: any) => {
        if (!localNode) {
            return;
        }

        const existIndex = listOptions.findIndex(x => x.tagoptId === tagopt?.id);
        // console.log(existIndex, listOptions, tagopt);

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
                addLikeTag(item._id.toHexString());
            }
        });
        navigation.goBack();
    };

    const onGetTitle = (title: string) => {
        let result = title;
        if (title?.toLowerCase() === 'yes') {
            result = t('general:tagoptYes');
        }
        return result;
    };

    const ref = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '95%'], []);
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
                <View tw="flex flex-row pt-3 px-6 items-start">
                    {tag.props?.icon && (
                        <View tw="bg-s-200 dark:bg-s-900 p-3 mr-3 rounded-full">
                            <SIcon path={tag.props.icon} tw="text-s-800 dark:text-s-300" size={40} />
                        </View>
                    )}
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
                        {t(`general:tagCreate.${tag.type}`)}
                    </Text>
                    {/* <Text tw="text-black dark:text-white text-lg">{tag?.title}</Text>
                    <Text tw="text-black">{tag?.description}</Text>
                    <Text tw="text-black">{JSON.stringify(tag)}</Text> */}
                </View>
                {tag.type === 'checkone'
                    ? allowTagopts?.map((el, i) => (
                          <View key={i.toString()} tw="py-2">
                              <UIButton type="default" onPress={() => onAddTagopt(el, null)}>
                                  <View tw="px-3 flex flex-row items-center">
                                      <View tw="pr-3">
                                          {el.props?.icon ? (
                                              <SIcon path={el.props.icon} tw="text-s-800 dark:text-s-300" size={35} />
                                          ) : el.props?.image ? (
                                              <RImage
                                                  uri={el.props?.image}
                                                  classString="h-10"
                                                  style={{
                                                      width: undefined,
                                                      aspectRatio: 1,
                                                      resizeMode: 'contain',
                                                  }}
                                              />
                                          ) : null}
                                      </View>
                                      <View tw="flex-auto">
                                          <Text tw="text-lg font-bold text-s-800 dark:text-s-200">
                                              {onGetTitle(el?.title)}
                                          </Text>
                                          {el?.description && (
                                              <Text tw="text-base leading-5 text-s-800 dark:text-s-200">
                                                  {el.description}
                                              </Text>
                                          )}
                                      </View>
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
                                        <View tw="px-3 flex flex-row">
                                            <View tw="pr-2">
                                                {el.props?.icon ? (
                                                    <SIcon
                                                        path={el.props.icon}
                                                        tw="text-s-800 dark:text-s-300"
                                                        size={35}
                                                    />
                                                ) : el.props?.image ? (
                                                    <RImage
                                                        uri={el.props?.image}
                                                        classString="h-10"
                                                        style={{
                                                            width: undefined,
                                                            aspectRatio: 1,
                                                            resizeMode: 'contain',
                                                        }}
                                                    />
                                                ) : null}
                                            </View>
                                            <View>
                                                <Text
                                                    tw={`text-lg font-bold ${
                                                        exist
                                                            ? 'text-white dark:text-white'
                                                            : 'text-s-800 dark:text-s-200'
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
                                        </View>
                                    </UIButton>
                                </View>
                            );
                        })}
                        <View tw="mt-3">
                            <UIButton
                                type="default"
                                disabled={listOptions.length === 0}
                                onPress={onSave}
                                text={t('general:save')}
                            />
                        </View>
                    </View>
                ) : null}
                {tag.type === 'price' ? (
                    <WidgetNodedataPrice tag={tag} onSave={value => onAddTagopt(null, value)} />
                ) : null}
                {tag.type === 'number' ? (
                    <WidgetNodedataNumber tag={tag} onSave={value => onAddTagopt(null, value)} />
                ) : null}
                {/* <Text tw="text-black">{tag.type}</Text> */}
            </View>
        </UIBottomSheetScrollView>
    );
};

export default NodedataCreatorTagScreen;
