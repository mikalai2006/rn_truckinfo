import {Keyboard, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import React, {useRef, useState} from 'react';

import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'nativewind';
import colors from '~utils/colors';
import {useObject, useQuery, useRealm} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON, UpdateMode} from 'realm';
import UIButton from '~components/ui/UIButton';
import {useNavigation} from '@react-navigation/native';
import {NodeAuditSchema, TNodeAuditSchema} from '~schema/NodeAuditSchema';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import {LikeSchema} from '~schema/LikeSchema';
import {ImageSchema} from '~schema/ImageSchema';
import {ReviewSchema} from '~schema/ReviewSchema';

type Props = {
    lid: string;
    isServerNodeRemove: boolean;
};

const WidgetNodeAuditForm = (props: Props) => {
    const {lid, isServerNodeRemove} = props;

    const navigation = useNavigation();
    const {t} = useTranslation();

    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const localAudits = useQuery(NodeAuditSchema, items => {
        return items.filtered('nlid == $0', lid);
    });

    const [message, setMessage] = useState(localAudits[0]?.message || '');
    const {colorScheme} = useColorScheme();

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

    const realm = useRealm();

    const allNodedatas = useQuery(NodeDataSchema);
    const likes = useQuery(LikeSchema);
    const nodeAudits = useQuery(NodeAuditSchema);
    const images = useQuery(ImageSchema);
    const reviews = useQuery(ReviewSchema);

    const onSaveAudit = () => {
        if (!localNode) {
            return;
        }

        if (localNode?.sid !== '') {
            const newData: TNodeAuditSchema = {
                message,
                nlid: localNode?._id.toHexString(),
                nodeId: localNode?.sid,
                isLocal: true,
                status: -1,
            };

            realm.write(() => {
                const existAudit = localAudits[0];

                realm.create(
                    NodeAuditSchema,
                    {
                        ...newData,
                        _id: existAudit?._id || new BSON.ObjectId(),
                    },
                    UpdateMode.Modified,
                );

                // realm.delete(localNode);

                // navigation.navigate('MapLocalScreen');
            });
        }
        // else {
        realm.write(() => {
            const existNodedatas = allNodedatas.filtered('nlid == $0', localNode._id?.toHexString());
            if (existNodedatas.length > 0) {
                realm.delete(existNodedatas);
            }

            const existLikes = likes.filtered('nlid == $0', localNode._id?.toHexString());
            if (existLikes.length > 0) {
                realm.delete(existLikes);
            }

            const existReviews = reviews.filtered('nlid == $0', localNode._id?.toHexString());
            if (existReviews.length > 0) {
                realm.delete(existReviews);
            }

            const existImages = images.filtered('nlid == $0', localNode._id?.toHexString());
            if (existImages.length > 0) {
                realm.delete(existImages);
            }

            const existAudits = nodeAudits.filtered(
                'nlid == $0 AND isLocal == $1',
                localNode._id?.toHexString(),
                false,
            );
            if (existAudits.length > 0) {
                realm.delete(existAudits);
            }

            realm.delete(localNode);

            navigation.navigate('MapLocalScreen');
        });
        //}
    };

    // const isOnlyLocalNode = React.useMemo(
    //     () => localNode?.sid !== '' && isServerNodeRemove,
    //     [isServerNodeRemove, localNode?.sid],
    // );

    return (
        <View tw="">
            {!isServerNodeRemove ? (
                <View tw="h-40">
                    <TextInput
                        ref={textInputRef}
                        value={message}
                        onChangeText={newText => setMessage(newText)}
                        placeholder={t('general:auditMessage')}
                        multiline={true}
                        numberOfLines={8}
                        autoFocus
                        onPressIn={checkKeyboards}
                        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
                        textAlignVertical="top"
                        showSoftInputOnFocus={true}
                        tw="flex-1 p-4 text-base border border-s-200 dark:border-s-700 text-s-500 dark:text-s-300 bg-white dark:bg-s-950 rounded-t-lg"
                        placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    />
                </View>
            ) : null}
            <View tw="p-6">
                <UIButton
                    type="default"
                    disabled={!isServerNodeRemove && message === ''}
                    onPress={() => onSaveAudit()}
                    text={t('general:deleteNode')}
                />
                {/* <TouchableOpacity  tw="rounded-md">
                        <View tw="mt-2 p-3 justify-center flex flex-row items-center bg-white dark:bg-s-700 rounded-md">
                            <Text tw="text-black dark:text-s-200 text-xl">{t('general:save')}</Text>
                        </View>
                    </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default WidgetNodeAuditForm;
