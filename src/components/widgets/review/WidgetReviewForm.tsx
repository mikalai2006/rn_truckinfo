import {Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import React, {useRef, useState} from 'react';

import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'nativewind';
import colors from '~utils/colors';
import {iStar, iStarFill} from '~utils/icons';
import SIcon from '~components/ui/SIcon';
import {useObject, useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import {ReviewSchema, TReviewSchema} from '~schema/ReviewSchema';
import UIButton from '~components/ui/UIButton';
import {useNavigation} from '@react-navigation/native';

const STAR_BOX_WIDTH = 250;

type Props = {
    lid: string;
};

const WidgetReviewForm = (props: Props) => {
    const {lid} = props;

    const navigation = useNavigation();
    const {t} = useTranslation();
    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const localReviews = useQuery(ReviewSchema, items => {
        return items.filtered('nlid == $0', lid);
    });

    const [review, setReview] = useState(localReviews[0]?.review || '');
    const [rate, setRate] = useState(localReviews[0]?.rate || 0);
    const {colorScheme} = useColorScheme();

    const width = (rate * STAR_BOX_WIDTH) / 5;

    const textInputRef = useRef<TextInput>(null);
    const [keyboardStatus, setKeyboardStatus] = useState('');
    React.useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardStatus('display'));
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardStatus('none'));
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    const checkKeyboards = () => {
        if (keyboardStatus === 'none') textInputRef.current?.blur();

        return true;
    };

    // useEffect(() => {
    //     const onGetMyReview = async () => {
    //         // setIsError(false);
    //         // setError('');
    //         // setIsLoading(true);
    //         try {
    //             await fetch(
    //                 HOST_API +
    //                     '/gql/query?' +
    //                     new URLSearchParams({
    //                         lang: activeLangStore?.code || 'en',
    //                     }),
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         Accept: 'application/json',
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({
    //                         query: `query($id:ID, $userId:String, $osmId: String) {
    //                             review(input: {
    //                                 osmId: $osmId,
    //                                 userId: $userId,
    //                                 id: $id
    //                             }) {
    //                                 id
    //                                 userId
    //                                 osmId
    //                                 rate
    //                                 review
    //                                 createdAt
    //                                 user {
    //                                     id
    //                                     lang
    //                                     name
    //                                     login
    //                                     lastTime
    //                                     online
    //                                     images {
    //                                         id
    //                                         service
    //                                         serviceId
    //                                         title
    //                                         userId
    //                                         path
    //                                         dir
    //                                         ext
    //                                     }
    //                                 }
    //                             }
    //                         }
    //                     `,
    //                         variables: {
    //                             userId: userStore?.id,
    //                             osmId: localNode?.osmId,
    //                         },
    //                     }),
    //                 },
    //             )
    //                 .then(r => r.json())
    //                 .then(response => {
    //                     // setIsLoading(false);
    //                     // console.log(response.data.review.review, response.data.review.rate);

    //                     setReview(response.data.review.review);
    //                     setRate(response.data.review.rate);
    //                 })
    //                 .catch(e => {
    //                     throw e;
    //                 });
    //         } catch (e) {
    //             // setIsError(true);
    //             // setError(e?.message);
    //         }
    //     };
    //     if (localNode?.osmId) {
    //         onGetMyReview();
    //     }
    // }, [activeLangStore?.code, localNode?.osmId, userStore?.id]);

    const realm = useRealm();
    const onSaveReview = () => {
        const newData: TReviewSchema = {
            rate,
            review,
            nlid: localNode?._id.toHexString(),
            nodeId: localNode?.sid,
            updatedAt: new Date().toISOString(),
            isLocal: true,
        };

        realm.write(() => {
            const existReview = localReviews[0];
            // console.log('existReview=', existReview);

            realm.create(
                ReviewSchema,
                {
                    ...newData,
                    _id: existReview?._id || new BSON.ObjectId(),
                    oldRate: existReview?.oldRate || 0,
                },
                UpdateMode.Modified,
            );
            navigation?.canGoBack() && navigation.goBack();
            // console.log('localLikes=', localLikes);
        });

        // fetch(HOST_API + '/review', {
        //     method: 'POST',
        //     headers: {
        //         'Access-Control-Allow-Origin-Type': '*',
        //         Authorization: `Bearer ${tokenStore.access_token}`,
        //     },
        //     body: JSON.stringify(newData),
        // })
        //     .then(r => r.json())
        //     .then((response: any) => {
        //         if (response.message && response?.code === 401) {
        //             // dispatch(setTokens({access_token: ''}));
        //         }

        //         // if ((response.id || response._id) && nodeStore) {
        //         //     // nodeStore.data.push(response);
        //         //     onGetNode(activeLanguageFromStore?.code || 'en', {lat: nodeStore.lat, lon: nodeStore.lon})
        //         //         .then(r => {
        //         //             if (r?.message && r?.code === 401) {
        //         //                 console.log('401 marker');
        //         //             }

        //         //             dispatch(setActiveNode(r.data.node));
        //         //         })
        //         //         .catch(e => {
        //         //             throw e;
        //         //         });
        //         // }
        //     });
    };

    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    return (
        <View tw="">
            <View tw="pb-2">
                <View tw="relative " style={{width: STAR_BOX_WIDTH}}>
                    <View tw="flex flex-row items-center w-full">
                        {[0, 1, 2, 3, 4].map(i => (
                            <View key={`empty_${i.toString()}`}>
                                <SIcon tw="text-s-400 dark:text-s-700" size={50} path={iStar} />
                            </View>
                        ))}
                    </View>
                    <View tw="z-10 absolute top-0 left-0 right-0 flex flex-row overflow-hidden items-center w-full">
                        {[0, 1, 2, 3, 4].map(i => (
                            <TouchableOpacity
                                onPress={() => setRate(i + 1)}
                                key={`empty_${i.toString()}`}
                                tw="flex items-center justify-center"
                                style={{width: 50, height: 50}}>
                                <Text
                                    tw={`${
                                        i + 1 <= rate ? 'text-black dark:text-white' : 'text-s-500'
                                    } text-2xl font-bold`}>
                                    {i + 1}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View tw="absolute top-0 left-0 right-0 flex flex-row overflow-hidden items-center" style={{width}}>
                        {[0, 1, 2, 3, 4].map(i => (
                            <View key={`fill_${i.toString()}`} tw="">
                                <SIcon tw="text-yellow-500 dark:text-yellow-600" size={50} path={iStarFill} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View tw="h-40">
                <TextInput
                    ref={textInputRef}
                    value={review}
                    onChangeText={newText => setReview(newText)}
                    placeholder={t('general:review')}
                    multiline={true}
                    numberOfLines={8}
                    autoFocus
                    onPressIn={checkKeyboards}
                    keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
                    textAlignVertical="top"
                    // showSoftInputOnFocus={true}
                    tw="flex-1 p-4 text-base border border-s-200 dark:border-s-700 text-s-500 dark:text-s-300 bg-white dark:bg-s-950 rounded-xl"
                    placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                />
            </View>
            <View tw="pt-3">
                <UIButton type="default" onPress={() => onSaveReview()} text={t('general:save')} />
                {/* <TouchableOpacity  tw="rounded-md">
                        <View tw="mt-2 p-3 justify-center flex flex-row items-center bg-white dark:bg-s-700 rounded-md">
                            <Text tw="text-black dark:text-s-200 text-xl">{t('general:save')}</Text>
                        </View>
                    </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default WidgetReviewForm;
