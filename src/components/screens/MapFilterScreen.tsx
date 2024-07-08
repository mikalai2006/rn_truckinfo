import React, {useMemo, useState} from 'react';

import {useAppDispatch, useAppSelector} from '~store/hooks';
import {IAmenity, IFilter, ITag, activeLanguage, amenities, filter, setFilter, tags} from '~store/appSlice';

import {FlatList} from 'react-native-gesture-handler';
import {Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SSkeleton} from '~components/ui/SSkeleton';
import SIcon from '~components/ui/SIcon';
import {iCheckLg, iChevronDown} from '~utils/icons';
import UIButton from '~components/ui/UIButton';
import RImage from '~components/r/RImage';

const MapFilterScreen = () => {
    console.log('Render MapFilterScreen');

    const {t} = useTranslation();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const tagFromStore = useAppSelector(tags);
    const amenityFromStore = useAppSelector(amenities);

    const amenityWithTags = useMemo(() => {
        const result: {
            amenity: IAmenity;
            tags: ITag[];
        }[] = [];

        // normalize tags.
        const tagsObj: {[k: string]: ITag} = {};
        for (const index in tagFromStore) {
            const currentTag: ITag = Object.assign({}, tagFromStore[index]);
            if (!currentTag.isFilter) {
                continue;
            }

            if (['checkone'].includes(currentTag.type) && !currentTag.options.length) {
                currentTag.options = currentTag.options.concat([
                    // @ts-ignore
                    {
                        id: '000000000000000000000000',
                        tagId: currentTag.id,
                        value: 'yes',
                        title: 'Yes',
                    },
                    // {
                    //   id: "000000000000000000000000",
                    //   tagId: currentTag.id,
                    //   value: "no",
                    //   title: "No",
                    // },
                ]);
            }
            tagsObj[currentTag.id] = currentTag;
        }
        for (const index in amenityFromStore) {
            const amenity = amenityFromStore[index];
            if (amenity.status <= 0) {
                continue;
            }

            const _tags = [];
            for (const tag of amenityFromStore[index].tags) {
                const tagData = Object.assign({}, tagsObj[tag]);
                tagData.isFilter && _tags.push(tagData);
            }

            result.push({
                amenity,
                tags: _tags,
            });
        }
        return result;
    }, [amenityFromStore, tagFromStore]);

    const filterFromStore = useAppSelector(filter);
    const [filterX, setFilterX] = useState<IFilter>(JSON.parse(JSON.stringify(filterFromStore)));
    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const onChangeAmenityFilter = (type: string) => {
        const oldFilter = Object.assign({}, filterX);
        if (oldFilter[type]) {
            delete oldFilter[type];
        } else {
            oldFilter[type] = {
                tags: {},
                show: false,
            };
        }
        setFilterX(oldFilter);
    };
    const onShowAmenityTag = (type: string) => {
        const oldFilter = Object.assign({}, filterX);
        if (!oldFilter[type]) {
            return;
        } else {
            oldFilter[type].show = !oldFilter[type]?.show;
        }
        setFilterX(oldFilter);
    };
    const onToggleYesTag = (typeAmenity: string, tag: ITag) => {
        const oldFilter = Object.assign({}, filterX);
        if (!oldFilter[typeAmenity] && !oldFilter[typeAmenity].tags) {
            return;
        } else {
            if (oldFilter[typeAmenity].tags[tag.id]) {
                delete oldFilter[typeAmenity].tags[tag.id];
            } else {
                oldFilter[typeAmenity].tags[tag.id] = ['yes'];
            }
        }
        console.log('oldFilter:', JSON.stringify(oldFilter));
        setFilterX(oldFilter);
    };
    const onToggleValueTag = (typeAmenity: string, tag: ITag, value: any = undefined) => {
        const oldFilter = Object.assign({}, filterX);
        if (!oldFilter[typeAmenity] && !oldFilter[typeAmenity].tags) {
            return;
        } else {
            if (!oldFilter[typeAmenity].tags[tag.id]) {
                oldFilter[typeAmenity].tags[tag.id] = [];
            }

            const indexExistValue = oldFilter[typeAmenity].tags[tag.id].findIndex(x => value === x);
            if (indexExistValue === -1) {
                oldFilter[typeAmenity].tags[tag.id].push(value);
            } else {
                oldFilter[typeAmenity].tags[tag.id].splice(indexExistValue, 1); // = oldFilter[typeAmenity].tags[tag.id].filter(x => x !== value);
            }
            console.log('filter:', JSON.stringify(filterX));
        }

        setFilterX(oldFilter);
    };

    const onSaveFilter = () => {
        dispatch(setFilter(filterX));
        navigation.goBack();
    };

    const renderItem = ({item}) => (
        <View key={item.id} tw={`mx-4 rounded-xl mb-2 ${filterX[item.amenity.type] ? 'bg-white dark:bg-s-950' : ''}`}>
            <View tw="flex flex-row items-center">
                <TouchableOpacity
                    onPress={() => {
                        onChangeAmenityFilter(item.amenity.type);
                    }}
                    tw={`flex-auto p-2 flex flex-row items-center space-x-3 ${filterX[item.amenity.type] ? '' : ''}`}>
                    <View
                        tw={`relative w-8 h-8 p-2 rounded-md border flex items-center justify-center ${
                            filterX[item.amenity.type]
                                ? 'border-s-100 dark:border-s-900/50'
                                : 'border-s-200 dark:border-s-700'
                        }`}>
                        {filterX[item.amenity.type] && (
                            <SIcon path={iCheckLg} size={20} tw="text-p-500 dark:text-p-300" />
                        )}
                    </View>
                    <View tw="p-2 rounded-full" style={{backgroundColor: item.amenity?.props?.bgColor || 'white'}}>
                        <SIcon
                            path={item.amenity?.props?.icon}
                            size={25}
                            style={{color: item.amenity?.props?.iconColor || 'red'}}
                        />
                    </View>
                    <View tw="flex-auto">
                        <Text
                            tw={`text-base ${
                                filterX[item.amenity.type]
                                    ? 'font-bold text-p-500 dark:text-p-300'
                                    : 'text-s-700 dark:text-s-300'
                            }`}>
                            {item.amenity.title}
                        </Text>
                    </View>
                </TouchableOpacity>
                {filterX[item.amenity.type] && (
                    <TouchableOpacity
                        onPress={() => {
                            onShowAmenityTag(item.amenity.type);
                        }}
                        tw={`self-stretch p-3 px-4 flex flex-row items-center ${filterX[item.amenity.type] ? '' : ''}`}>
                        <SIcon path={iChevronDown} size={25} tw="text-black dark:text-s-200" />
                    </TouchableOpacity>
                )}
            </View>
            {filterX && filterX[item.amenity.type]?.show && (
                <View tw="px-2 pb-3">
                    {/* <Text tw="text-black">{el.amenity.title}</Text> */}
                    {item.tags.map((tag, keyTag) =>
                        tag.options.length === 1 ? (
                            <View key={keyTag.toString()}>
                                <TouchableOpacity
                                    onPress={() => {
                                        onToggleYesTag(item.amenity.type, tag);
                                    }}
                                    tw={`flex-auto px-2 py-1 flex flex-row items-center space-x-3 ${
                                        filterX[item.amenity.type].tags[tag.id] ? 'bg-p-500/10' : ''
                                    }`}>
                                    <View
                                        tw={`relative w-8 h-8 p-2 rounded-md border flex items-center justify-center ${
                                            filterX[item.amenity.type].tags[tag.id]
                                                ? 'border-s-100 dark:border-s-900/50'
                                                : 'border-s-200 dark:border-s-700'
                                        }`}>
                                        {filterX[item.amenity.type].tags[tag.id] && (
                                            <SIcon path={iCheckLg} size={20} tw="text-p-500 dark:text-p-300" />
                                        )}
                                    </View>
                                    <View tw="p-2 rounded-full bg-s-50 dark:bg-s-900/50">
                                        {tag?.props?.icon ? (
                                            <SIcon
                                                path={tag.props.icon}
                                                size={25}
                                                tw={`${
                                                    filterX[item.amenity.type].tags[tag.id]
                                                        ? 'text-p-500 dark:text-p-300'
                                                        : 'text-s-500 dark:text-s-400'
                                                }`}
                                            />
                                        ) : null}
                                        {tag?.props?.image ? <RImage uri={tag.props.image} tw="h-8 w-8" /> : null}
                                    </View>
                                    <View tw="flex-auto">
                                        <Text
                                            tw={`text-base ${
                                                filterX[item.amenity.type].tags[tag.id]
                                                    ? 'font-bold text-p-500 dark:text-p-300'
                                                    : 'text-s-600 dark:text-s-300'
                                            }`}>
                                            {tag.title || tag.key}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View key={keyTag.toString()}>
                                <Text tw="text-base text-s-500 px-3">{tag.title || tag.key}</Text>
                                {tag.options.map((tagopt, keyTagopt) => {
                                    const isExist = filterX[item.amenity.type].tags[tag.id]?.find(
                                        x => x === tagopt.value,
                                    );
                                    return (
                                        <View key={keyTagopt.toString()}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    onToggleValueTag(item.amenity.type, tag, tagopt.value);
                                                }}
                                                tw={`flex-auto px-2 pl-4 py-1 flex flex-row items-center space-x-3 ${
                                                    isExist ? 'bg-p-500/10' : ''
                                                }`}>
                                                <View
                                                    tw={`relative w-8 h-8 p-2 rounded-md border flex items-center justify-center ${
                                                        isExist
                                                            ? 'border-s-100 dark:border-s-900/50'
                                                            : 'border-s-200 dark:border-s-700'
                                                    }`}>
                                                    {isExist && <SIcon path={iCheckLg} size={20} tw="text-p-500" />}
                                                </View>
                                                <View tw="bg-white dark:bg-s-100 rounded-md">
                                                    {tagopt?.props?.icon ? (
                                                        <SIcon
                                                            path={tagopt.props.icon}
                                                            size={25}
                                                            tw={`${
                                                                isExist
                                                                    ? 'text-p-500 dark:text-p-300'
                                                                    : 'text-s-500 dark:text-s-400'
                                                            }`}
                                                        />
                                                    ) : null}
                                                    {tagopt?.props?.image ? (
                                                        <RImage
                                                            uri={tagopt.props.image}
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
                                                    <Text
                                                        tw={`text-base ${
                                                            isExist
                                                                ? 'font-bold text-p-500 dark:text-p-300'
                                                                : 'text-s-600 dark:text-s-300'
                                                        }`}>
                                                        {tagopt?.title || tagopt.value}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        ),
                    )}
                </View>
            )}
        </View>
    );

    return (
        <View tw="flex-1 pt-12 bg-s-100 dark:bg-s-900">
            {amenityWithTags.length ? (
                <View tw="flex-1">
                    <FlatList
                        initialNumToRender={2}
                        maxToRenderPerBatch={2}
                        windowSize={2}
                        tw="flex-1"
                        data={amenityWithTags}
                        renderItem={renderItem}
                    />
                    <View tw="px-6 pb-6 pt-3">
                        <UIButton type="primary" text={t('general:save')} onPress={onSaveFilter} />
                    </View>
                </View>
            ) : (
                <View tw="pt-6 mx-2 bg-white dark:bg-s-800 rounded-xl">
                    <View tw="flex flex-row px-6">
                        <View tw="w-16">
                            <SSkeleton classString="w-12 h-12 mr-4" />
                        </View>
                        <View tw="flex-auto">
                            <SSkeleton classString="h-4" />
                            <SSkeleton classString="h-4 mt-2" width={'80%'} />
                        </View>
                    </View>
                    <View tw="px-6">
                        <SSkeleton classString="h-6 mt-2" />
                    </View>
                    <View tw="px-6 flex flex-row flex-wrap">
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2" width={'32%'} />

                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2 mr-1" width={'32%'} />
                        <SSkeleton classString="h-20 mt-2" width={'32%'} />
                    </View>
                </View>
            )}
        </View>
    );
};

export default MapFilterScreen;
