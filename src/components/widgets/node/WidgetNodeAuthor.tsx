import {Text, View} from 'react-native';
import React from 'react';

import {useTranslation} from 'react-i18next';
import {INode} from '~store/appSlice';
import WidgetUserLink from '../user/WidgetUserLink';

type Props = {
    lid: string;
    serverNode: INode;
};

const WidgetNodeAuthor = (props: Props) => {
    const {lid, serverNode} = props;

    const {t} = useTranslation();
    // const navigation = useNavigation();

    // const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    return (
        <View tw="pb-3">
            <View>
                {/* <Text tw="font-bold text-lg leading-5 text-s-900 dark:text-s-200">
                                {t('general:addNodeAuthor')}
                            </Text> */}
                <Text tw="text-base leading-5 text-s-500 dark:text-s-400">{t('general:addNodeAuthor')}:</Text>
            </View>
            <WidgetUserLink userData={serverNode?.user} />
        </View>
    );
};

export default WidgetNodeAuthor;
