import React, {useMemo} from 'react';
import {useColorScheme} from 'nativewind';
import {Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useNodeDataVote} from '~hooks/useNodeDataVote';
import {useAppSelector} from '~store/hooks';
import {user} from '~store/appSlice';
import {useQuery} from '@realm/react';
import {NodeSchema} from '~schema/NodeSchema';
import UIButton from '~components/ui/UIButton';

type Props = {
    item: any;
};

export default function WidgetStatItem(props: Props) {
    const {item} = props;

    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const navigation = useNavigation();

    const userFromStore = useAppSelector(user);

    const nodes = useQuery(NodeSchema);
    const node = useMemo(() => {
        return nodes.filtered('sid == $0', item?.nodeId)[0];
    }, []);

    return (
        <View tw="">
            <View tw="flex-auto">
                <Text tw="text-s-700 dark:text-s-400 text-lg leading-6">{node?.name}</Text>
                <View>
                    <Text tw="text-s-700 dark:text-s-400 text-lg leading-6">{item?.value}</Text>
                </View>
                <View>
                    <UIButton
                        type="default"
                        onPress={() => {
                            navigation.navigate('MapLocalStack', {
                                screen: 'MapLocalScreen',
                                params: {
                                    marker: JSON.parse(JSON.stringify(node)),
                                    initialCenter: {
                                        lat: node.lat,
                                        lng: node.lon,
                                    },
                                },
                                initial: true,
                            });
                        }}
                    />
                </View>
                {/* <Text tw="text-s-700 dark:text-s-400 text-lg leading-6">{JSON.stringify(node)}</Text> */}
            </View>
        </View>
    );
}
