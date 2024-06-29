import {Text, View} from 'react-native';
import React from 'react';

import {useTranslation} from 'react-i18next';
import {useQuery} from '@realm/react';
import {NodeAuditSchema} from '~schema/NodeAuditSchema';
import SIcon from '~components/ui/SIcon';
import {iWarning} from '~utils/icons';
import {replaceRegexByArray} from '~utils/utils';
import {INode} from '~store/appSlice';

type Props = {
    lid: string;
    serverNode: INode;
};

const WidgetNodeAudit = (props: Props) => {
    const {lid, serverNode} = props;

    const {t} = useTranslation();

    // const localNode = useObject(NodeSchema, new BSON.ObjectId(lid));

    const localAudits = useQuery(NodeAuditSchema, items => {
        return items.filtered('nlid == $0', lid);
    });

    const serverAudits = React.useMemo(() => serverNode?.audits || [], [serverNode?.audits]);

    return localAudits.length > 0 || serverAudits.length > 0 ? (
        <View tw="px-4 pb-2">
            <View tw="bg-red-500/30 p-3 rounded-xl flex flex-row items-center">
                <SIcon path={iWarning} size={30} tw="text-s-900 dark:text-s-200" />
                <View tw="ml-3 flex-auto">
                    {serverAudits.map((item, index) => (
                        <Text key={index.toString()} tw="text-base leading-5 text-s-900 dark:text-s-200">
                            {replaceRegexByArray(t('general:auditHint'), [item.user.login])}: {item.message}
                        </Text>
                    ))}
                    {localAudits.map((item, index) => (
                        <Text key={index.toString()} tw="text-base leading-5 text-s-900 dark:text-s-200">
                            {t('general:auditHintIam')}: {item.message}
                        </Text>
                    ))}
                </View>
            </View>
        </View>
    ) : null;
};

export default WidgetNodeAudit;
