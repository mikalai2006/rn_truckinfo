import React, {useMemo} from 'react';
import {View} from 'react-native';

import {useAppSelector} from '~store/hooks';
import {tags} from '~store/appSlice';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NodeSchema} from '~schema/NodeSchema';
import {useQuery} from '@realm/react';
import {NodeDataSchema} from '~schema/NodeDataSchema';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import WidgetNodeTagShort from './WidgetNodeTagShort';

export interface IWidgetNodeTagsShortProps {
    localNode: NodeSchema;
}

const WidgetNodeTagsShort = (props: IWidgetNodeTagsShortProps) => {
    // console.log('Render WidgetNodeTags: ');
    const {localNode} = props;
    const localNodedatas = useQuery(
        NodeDataSchema,
        nodedatas => {
            return nodedatas.filtered('nlid == $0', localNode._id.toHexString());
        },
        [localNode._id],
    );

    const navigation = useNavigation<MapLocalStackParamList>();
    const {t} = useTranslation();

    // const node = useMemo(() => serverNode || localNode, [localNode, serverNode]);
    const nodedatas = useMemo(() => {
        const result = [...(localNode?.data || [])];

        localNodedatas?.forEach(el => {
            // if (!result.find(x => x.id === el.sid)) {
            result.push({...el, id: el._id.toHexString()});
            // }
        });

        return result; //[...(serverNode?.data || []), ...(localNode.data || []), ...(localNodedatas || [])];
    }, [localNode?.data, localNodedatas]);

    const tagsFromStore = useAppSelector(tags);

    const tagGroups = useMemo(() => {
        let result: [string, NodeDataSchema[]][] = [];
        const all: {[key: string]: NodeDataSchema[]} = {};

        nodedatas?.forEach((el: NodeDataSchema) => {
            const keyTag = el.tagId;
            if (el.tagId) {
                const elData = {...el, tag: tagsFromStore[keyTag]};
                if (!all[keyTag]) {
                    all[keyTag] = [{...elData}];
                } else {
                    all[keyTag].push({...elData});
                }
            }
        });
        result = Object.entries(all);
        return result;
    }, [nodedatas, tagsFromStore]);

    return (
        <View tw="flex-1">
            <View tw="flex-1 flex flex-row flex-wrap items-center justify-center">
                {tagGroups.map(([key, el], i) => (
                    <WidgetNodeTagShort key={i.toString()} tagId={key} nodedatas={el} />
                    // <View key={i.toString()} tw="p-1 rounded-full">
                    //     <View tw="rounded-xl p-0 pt-3 bg-white dark:bg-s-900 border border-s-200 dark:border-s-900 flex-col items-center justify-end">
                    //         <View tw="flex-auto self-stretch">
                    //             <WidgetNodeTagShort tagId={key} nodedatas={el} />
                    //         </View>
                    //     </View>
                    // </View>
                ))}
            </View>
        </View>
    );
};

export default WidgetNodeTagsShort;
