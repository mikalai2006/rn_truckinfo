import {Modal, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

import {useTranslation} from 'react-i18next';
import colors from '~utils/colors';
import UIButton from '~components/ui/UIButton';
import {useColorScheme} from 'nativewind';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {ICurrency, ITag, currencies} from '~store/appSlice';
import {useAppSelector} from '~store/hooks';

type Props = {
    onSave: (value: string) => Promise<void>;
    tag: ITag;
};

const WidgetNodedataPrice = (props: Props) => {
    const {onSave, tag} = props;

    const {colorScheme} = useColorScheme();

    const {t} = useTranslation();
    const currenciesFromStore = useAppSelector(currencies);
    const [currency, setCurrency] = useState<ICurrency | null>(null);
    const [value, setValue] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    const renderItem = ({item}: {item: ICurrency}) => {
        return (
            <ScrollView tw="pb-3">
                <UIButton
                    type="default"
                    onPress={() => {
                        setCurrency(item);
                        setShowDropdown(false);
                    }}>
                    <View tw="w-48 flex flex-row">
                        <View tw="flex-auto">
                            <Text tw="text-base text-black dark:text-s-200">{item.title}</Text>
                        </View>
                        <Text tw="text-base text-black dark:text-s-200">{item.code}</Text>
                    </View>
                </UIButton>
            </ScrollView>
        );
    };

    return (
        <View tw="">
            <View tw="flex flex-row items-center">
                <View tw="flex-auto">
                    <TextInput
                        value={value.toString()}
                        onChangeText={newText =>
                            setValue(newText.slice(-1) !== '.' ? parseFloat(newText || '0') : newText)
                        }
                        placeholder={tag.title || tag.key}
                        multiline={false}
                        // numberOfLines={1}
                        keyboardType="numeric"
                        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'}
                        textAlignVertical="top"
                        onFocus={() => {
                            if (value === 0) {
                                setValue(0);
                            }
                        }}
                        showSoftInputOnFocus={true}
                        tw="flex-1 p-4 text-base border border-s-200 dark:border-s-700 text-s-500 dark:text-s-300 bg-white dark:bg-s-950 rounded-xl"
                        placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    />
                    <View tw="absolute right-1.5 top-1.5">
                        <UIButton type="default" onPress={() => setShowDropdown(true)}>
                            <Text tw="text-base text-s-900 dark:text-s-300">{currency ? currency.code : 'Валюта'}</Text>
                        </UIButton>
                    </View>
                </View>
                <Modal visible={showDropdown} transparent animationType="none">
                    <TouchableOpacity
                        tw="flex-1 items-center justify-center bg-black/50"
                        onPress={() => setShowDropdown(false)}>
                        <View tw="absolute bg-s-100 dark:bg-s-950 rounded-lg p-6 shadow-xl shadow-black">
                            <FlatList
                                data={currenciesFromStore}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View tw="pt-3">
                <UIButton
                    type="default"
                    disabled={!currency || value === 0}
                    onPress={() => onSave(`${currency?.symbolLeft}${value}${currency?.symbolRight}`)}
                    text={t('general:save')}
                />
            </View>
        </View>
    );
};

export default WidgetNodedataPrice;
