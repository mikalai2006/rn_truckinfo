import {TextInput, View} from 'react-native';
import React, {useState} from 'react';

import {useTranslation} from 'react-i18next';
import colors from '~utils/colors';
import UIButton from '~components/ui/UIButton';
import {useColorScheme} from 'nativewind';
import {ITag} from '~store/appSlice';

type Props = {
    onSave: (value: number) => Promise<void>;
    tag: ITag;
};

const WidgetNodedataNumber = (props: Props) => {
    const {onSave, tag} = props;

    const {colorScheme} = useColorScheme();

    const {t} = useTranslation();
    const [value, setValue] = useState(0);

    return (
        <View tw="">
            <View tw="flex flex-row items-center">
                <View tw="flex-auto">
                    <TextInput
                        value={value.toString()}
                        onChangeText={newText => setValue(parseFloat(newText || '0'))}
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
                </View>
            </View>
            <View tw="pt-3">
                <UIButton
                    type="default"
                    disabled={value === 0}
                    onPress={() => onSave(value)}
                    text={t('general:save')}
                />
            </View>
        </View>
    );
};

export default WidgetNodedataNumber;
