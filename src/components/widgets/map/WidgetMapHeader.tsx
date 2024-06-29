import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import SIcon from '~components/ui/SIcon';
import {iFilterFill} from '~utils/icons';
import WidgetHeaderApp from '../WidgetHeaderApp';
import {TextInput} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';

const WidgetMapHeader = props => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    const [queryString, setQueryString] = useState('');

    return (
        <View tw="z-10 absolute top-6 w-full">
            <View tw="flex-1 flex-row m-3 items-stretch bg-white dark:bg-s-950 rounded-md shadow-lg shadow-black border-transparent">
                <WidgetHeaderApp />
                <View tw="flex-auto flex flex-row">
                    <TextInput
                        value={queryString}
                        tw="w-full py-1 text-black dark:text-s-200"
                        onChangeText={setQueryString}
                    />
                    {/* <Text tw="text-black">Header</Text>
                            <Text tw="text-black">{zoomFromStore}</Text> */}
                </View>
                <View>
                    <TouchableOpacity
                        tw="p-3 rounded-full"
                        onPress={async () => {
                            navigation.navigate('MapLocalFilterScreen');
                        }}>
                        <SIcon path={iFilterFill} size={25} tw="text-black dark:text-s-200" />
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity tw="bg-p-300 dark:bg-p-800 p-2 rounded-r-md shadow-md" onPress={() => {}}>
                    <SIcon path={iAddMarker} size={20} tw="text-black dark:text-s-200" />
                    <Text tw="text-sm text-black dark:text-s-200">Добавить точку</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default WidgetMapHeader;
