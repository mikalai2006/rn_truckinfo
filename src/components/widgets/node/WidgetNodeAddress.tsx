import {View, Text} from 'react-native';
import React from 'react';
import {INode} from '~store/appSlice';
import {useTranslation} from 'react-i18next';

type Props = {
    serverNode: INode;
};
const WidgetNodeAddress = (props: Props) => {
    const {serverNode} = props;
    const {t} = useTranslation();

    return (
        <View>
            {serverNode?.address && (
                <View tw="px-4 flex flex-row items-center">
                    {/* <View tw="w-14 h-12">
                    <View tw="p-2 rounded-lg">
                        <SIcon tw="text-s-500" size={40} path={iGeoAltFill} />
                    </View>
                </View> */}
                    <View tw="pb-3 rounded-xl">
                        <View>
                            <Text tw="text-base leading-5 text-s-500 dark:text-s-400">{t('general:address')}:</Text>
                        </View>
                        <View tw="flex-auto">
                            <Text tw="text-base leading-5 text-s-500 dark:text-s-500">
                                {serverNode.address.dAddress}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default WidgetNodeAddress;
