// import {View, Text, TouchableOpacity} from 'react-native';
// import React from 'react';
// import {INode} from '~store/appSlice';
// import {useTranslation} from 'react-i18next';
// import {NodeSchema} from '~schema/NodeSchema';
// import {useNavigation} from '@react-navigation/native';

// type Props = {
//     localNode: NodeSchema | null;
//     serverNode: INode;
//     isServerNodeRemove: boolean;
// };

// const WidgetNodeButtonRemove = (props: Props) => {
//     // var testTime = window.performance.now();
//     const {localNode, serverNode, isServerNodeRemove} = props;

//     const {t} = useTranslation();
//     const navigation = useNavigation();

//     // const localNode = useQuery(NodeSchema, items => {
//     //     return items.filtered('nlid == $0', lid);
//     // });

//     const onRemoveNode = () => {
//         navigation.navigate('NodeAuditScreen', {lid: localNode?._id.toHexString(), serverNode, isServerNodeRemove});
//     };

//     return (
//         <View>
//             <TouchableOpacity
//                 onPress={onRemoveNode}
//                 activeOpacity={0.5}
//                 tw="mx-4 p-3 rounded-xl border border-red-500/20">
//                 <View tw="flex flex-row items-center justify-center">
//                     <Text tw="text-base text-red-500 dark:text-red-300">{t('general:deleteNode')}</Text>
//                 </View>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default WidgetNodeButtonRemove;
