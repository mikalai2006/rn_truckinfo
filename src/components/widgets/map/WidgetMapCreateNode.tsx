import {Text, View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';

import {useAppSelector} from '~store/hooks';
import {IAmenity, amenities, center, user} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';
import SIcon from '~components/ui/SIcon';
import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import colors from '~utils/colors';
import {ScreenKeys} from '~components/screens';
import {useTranslation} from 'react-i18next';
import {iClose, iInfoSquare, iSave} from '~utils/icons';
import {NodeSchema} from '~schema/NodeSchema';
import UIButton from '~components/ui/UIButton';
import {useColorScheme} from 'nativewind';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

const MAX_ZOOM = 17;

type WidgetMapCreateNodeProps = {
    onSetNewNodeType: (type: string) => void;
    setShowCross: (status: boolean) => void;
    // setMyMarkers: (arrPoi: []) => void;
    zoom: number;
    includeToArea: boolean;
};
export type WidgetMapCreateNodeNodeRefProps = {
    // onSetNewNodeType: (type: string) => void;
};

const WidgetMapCreateNode = React.forwardRef<WidgetMapCreateNodeNodeRefProps, WidgetMapCreateNodeProps>(
    (props, ref) => {
        const {t} = useTranslation();

        const navigation = useNavigation();
        const {colorScheme} = useColorScheme();

        const userFromStore = useAppSelector(user);
        const centerFromStore = useAppSelector(center);
        const amenityStore = useAppSelector(amenities);

        const [currentAmenity, setCurrentAmenity] = useState(null as IAmenity | null);
        const dataNewPoint = useRef({
            name: '',
        });

        const disabled = useMemo(
            () => !props.includeToArea || !currentAmenity || props.zoom < MAX_ZOOM,
            [currentAmenity, props.includeToArea, props.zoom],
        );

        // const onSetNewNodeType = useCallback((type: string) => {
        //     'worklet';

        //     setCurrentAmenity(amenityStore[type]);
        // }, []);

        const realm = useRealm();
        const allNodes = useQuery(NodeSchema);
        const onCreateNewNode = async () => {
            try {
                if (!centerFromStore) {
                    throw new Error('Not found coordinates!');
                }

                const lat = Number(centerFromStore.lat.toFixed(7));
                const lon = Number(centerFromStore.lng.toFixed(7));
                const type = currentAmenity?.type;
                let existNearbours = allNodes.filtered(
                    'lat > $0 && lat < $1 && lon > $2 && lon < $3',
                    lat - 0.00005,
                    lat + 0.00005,
                    lon - 0.00005,
                    lon + 0.00005,
                );
                if (existNearbours.length > 0) {
                    throw new Error(t('general:existNear'));
                }
                existNearbours = allNodes.filtered(
                    'lat > $0 && lat < $1 && lon > $2 && lon < $3 && type == $4',
                    lat - 0.00015,
                    lat + 0.00015,
                    lon - 0.00015,
                    lon + 0.00015,
                    type,
                );
                if (existNearbours.length > 0) {
                    throw new Error(t('general:existNearSameType'));
                }

                const newNodeData = {
                    _id: new BSON.ObjectId(),
                    sid: '',
                    lat,
                    lon,
                    ...dataNewPoint.current,
                    type,
                    // name: name.trim(),
                    amenityId: currentAmenity?.id,
                    ccode: '',
                    my: true,
                    userId: userFromStore?.id,
                    createdAt: new Date().toISOString(),
                };
                // // alert(JSON.stringify(newNodeData));
                // const resultNewNode = await fetch(HOST_API + '/node', {
                //     method: 'POST',
                //     headers: {
                //         'Access-Control-Allow-Origin-Type': '*',
                //         Authorization: `Bearer ${tokenStore.access_token}`,
                //     },
                //     body: JSON.stringify(newNodeData),
                // }).then(res => res.json());

                // if (!resultNewNode._id) {
                //     throw resultNewNode;
                // }

                // alert(JSON.stringify(newNodeData));
                console.log(newNodeData);

                realm.write(() => {
                    realm.create('NodeSchema', newNodeData); // , Realm.UpdateMode.All
                });

                // props?.setMyMarkers(allmyPOI);
                props?.setShowCross(false);
                props?.onSetNewNodeType('');
                navigation.navigate(ScreenKeys.NodeScreen, {marker: JSON.parse(JSON.stringify(newNodeData))});
            } catch (e) {
                Alert.alert(t('error:title'), e?.message);
            }
        };

        const animationValue = useSharedValue({height: 0});
        const animationStyle = useAnimatedStyle(() => {
            return {
                height: withTiming(animationValue.value.height, {
                    duration: 200,
                }),
            };
        });

        useEffect(() => {
            animationValue.value = {height: 200};

            return () => {
                animationValue.value = {height: 0};
            };
        }, []);
        // const onSetShowCross = (status: boolean) => {
        //     setShowCross(status);
        //     animationValue.value = status ? {height: 300} : {height: 0};
        // };

        return (
            <>
                <View tw="absolute top-8 left-3 right-3">
                    {currentAmenity === null ? (
                        <View tw="bg-p-500 p-3 rounded-lg shadow-lg shadow-black flex flex-row items-start">
                            <SIcon path={iInfoSquare} size={25} tw="text-white" />
                            <View tw="flex-auto ml-3">
                                <Text tw="text-base text-white leading-5">{t('general:chooseAmenity')}</Text>
                            </View>
                        </View>
                    ) : props?.includeToArea === false ? (
                        <View tw="bg-p-500 p-3 rounded-lg shadow-lg shadow-black flex flex-row items-start">
                            <SIcon path={iInfoSquare} size={25} tw="text-white" />
                            <View tw="flex-auto ml-3">
                                <Text tw="text-base text-white leading-5">{t('general:notAllowCreateArea')}</Text>
                            </View>
                        </View>
                    ) : props?.zoom < MAX_ZOOM ? (
                        <View tw="bg-p-500 p-3 rounded-lg shadow-lg shadow-black flex flex-row items-start">
                            <SIcon path={iInfoSquare} size={25} tw="text-white" />
                            <View tw="flex-auto ml-3">
                                <Text tw="text-base text-white leading-5">
                                    {t('general:highZoomCreateArea')} {props?.zoom}
                                </Text>
                            </View>
                        </View>
                    ) : null}
                </View>

                <Animated.View tw="absolute bottom-0 z-40" style={[animationStyle]}>
                    <View tw="flex-1 items-end">
                        {/* <TouchableOpacity tw="bg-p-500 dark:bg-p-700 p-3 rounded-full shadow-md" onPress={setShowCross(!showCross)}>
                    <SIcon path={iAddMarker} size={32} tw="text-white dark:text-s-200" />
                </TouchableOpacity> */}
                        <View tw="pt-2 pb-4 w-full bg-s-100 dark:bg-s-950">
                            {Object.keys(amenityStore).length > 0 ? (
                                <>
                                    <Text tw="px-2 text-base text-s-600 dark:text-s-200">
                                        {t('general:chooseAmenityTitle')}
                                    </Text>
                                    <ScrollView horizontal tw="pb-3 pt-2 px-2">
                                        {Object.values(amenityStore).map((el, i) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setCurrentAmenity(el);
                                                        props.onSetNewNodeType(el.type);
                                                    }}
                                                    key={i.toString()}
                                                    tw={'w-24 py-3 mr-3 flex items-center rounded-lg'}
                                                    style={{
                                                        backgroundColor:
                                                            el.type === currentAmenity?.type
                                                                ? currentAmenity?.props.bgColor
                                                                : colorScheme === 'dark'
                                                                ? colors.s[800]
                                                                : colors.s[200],
                                                    }}>
                                                    <SIcon
                                                        path={el.props?.icon}
                                                        size={25}
                                                        style={{
                                                            color:
                                                                el.type === currentAmenity?.type
                                                                    ? currentAmenity?.props.iconColor
                                                                    : colorScheme === 'dark'
                                                                    ? colors.s[200]
                                                                    : colors.s[500],
                                                        }}
                                                    />
                                                    <Text
                                                        tw={`text-center leading-4 ${
                                                            el.type === currentAmenity?.type
                                                                ? 'text-white'
                                                                : 'text-s-500'
                                                        }`}>
                                                        {el.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </>
                            ) : (
                                <View tw="p-4 px-8">
                                    <Text tw="text-xl text-center mb-2 font-bold text-red-300">
                                        {t('form:amenityNullTitle')}
                                    </Text>
                                    <Text tw="text-base text-center leading-5 text-s-200">
                                        {t('form:amenityNullDescription')}
                                    </Text>
                                </View>
                            )}
                            <View tw="flex flex-row px-2">
                                <View tw="flex-auto" />
                                <View tw="mr-4">
                                    <UIButton
                                        type="default"
                                        text={t('general:cancel')}
                                        icon={iClose}
                                        onPress={() => {
                                            props?.setShowCross(false);
                                        }}
                                    />
                                </View>
                                <View>
                                    {Object.keys(amenityStore).length > 0 ? (
                                        <UIButton
                                            type="primary"
                                            text={t('general:save')}
                                            icon={iSave}
                                            disabled={disabled}
                                            onPress={async () => {
                                                await onCreateNewNode();
                                            }}
                                        />
                                    ) : (
                                        // <TouchableOpacity
                                        //     disabled={disabled}
                                        //     onPress={async () => {
                                        //         await onCreateNewNode();
                                        //     }}
                                        //     tw={`p-3 rounded-md flex flex-row items-center ${
                                        //         disabled ? 'bg-s-950' : 'bg-p-500'
                                        //     }`}>
                                        //     <SIcon
                                        //         path={iSave}
                                        //         size={20}
                                        //         tw={`mr-2 ${disabled ? 'text-s-400' : 'text-p-200'}`}
                                        //     />
                                        //     <Text tw="text-white text-xl">{t('form:button_save')}</Text>
                                        // </TouchableOpacity>
                                        <UIButton
                                            type="primary"
                                            disabled={false}
                                            text={t('form:loginTitle')}
                                            onPress={() => {
                                                //setModalVisible(!modalVisible)
                                                navigation.navigate(ScreenKeys.AuthScreen);
                                            }}
                                        />
                                    )}
                                </View>
                                <View tw="flex-auto" />
                            </View>
                            {/* <View tw="flex flex-row px-2 pb-2">
                            <TouchableOpacity
                                onPress={() => {
                                    props?.setShowCross(false);
                                }}
                                tw="p-3 bg-s-100 dark:bg-s-500 rounded-md">
                                <Text tw="text-black dark:text-s-200 text-xl">close</Text>
                            </TouchableOpacity>
                            <View tw="flex-auto" />
                            <TouchableOpacity
                                onPress={async () => {
                                    if (currentAmenity === null) {
                                        Alert.alert('Choose amenity');
                                        return;
                                    }
                                    await onCreateNewNode();
                                }}
                                tw={`p-3 rounded-md ${currentAmenity === null ? 'bg-s-500' : 'bg-p-500'}`}>
                                <Text tw="text-white text-xl">save</Text>
                            </TouchableOpacity>
                        </View> */}
                        </View>
                    </View>
                </Animated.View>
            </>
        );
    },
);

export default WidgetMapCreateNode;
