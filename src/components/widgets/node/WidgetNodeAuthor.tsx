import {Text, View} from 'react-native';
import React from 'react';

import {useTranslation} from 'react-i18next';
import {useObject} from '@realm/react';
import {INode} from '~store/appSlice';
import {NodeSchema} from '~schema/NodeSchema';
import {BSON} from 'realm';
import WidgetUserInfo from '../user/WidgetUserInfo';
import SIcon from '~components/ui/SIcon';
import {iChevronDown} from '~utils/icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

type Props = {
    lid: string;
    serverNode: INode;
};

const WidgetNodeAuthor = (props: Props) => {
    const {lid, serverNode} = props;

    const {t} = useTranslation();
    const navigation = useNavigation();

    const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const goToUserPage = () => {
        navigation.navigate('UserScreen', {
            userId: serverNode?.user?.id,
        });
    };

    return (
        <View tw="pb-3">
            <TouchableOpacity tw="rounded-xl flex flex-row" onPress={goToUserPage}>
                <View tw="flex-auto">
                    <View>
                        {/* <Text tw="font-bold text-lg leading-5 text-s-900 dark:text-s-200">
                                {t('general:addNodeAuthor')}
                            </Text> */}
                        <Text tw="text-base leading-5 text-s-500 dark:text-s-400">{t('general:addNodeAuthor')}:</Text>
                    </View>
                    <View tw="flex flex-row items-center">
                        <WidgetUserInfo userData={serverNode?.user} />
                    </View>
                </View>
                <View tw="self-center">
                    <View tw="transform -rotate-90">
                        <SIcon path={iChevronDown} size={25} tw="text-s-300 dark:text-s-500" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default WidgetNodeAuthor;
