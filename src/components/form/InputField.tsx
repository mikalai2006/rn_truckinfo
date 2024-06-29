import {useColorScheme} from 'nativewind';
import React from 'react';
import {View, Text, TouchableOpacity, TextInput, KeyboardType} from 'react-native';
import colors from '~utils/colors';

export default function InputField({
    label,
    value,
    inputType,
    keyboardType,
    fieldButtonLabel,
    fieldButtonFunction,
    setValue,
}: {
    label?: string;
    inputType?: string;
    keyboardType?: KeyboardType;
    fieldButtonLabel?: string;
    fieldButtonFunction?: () => {};
    setValue?: () => {};
}) {
    const {colorScheme} = useColorScheme();
    return (
        <>
            <Text tw="text-s-500 text-lg p-2">{label}</Text>
            <View tw="flex-auto flex flex-row items-center border-2 rounded-xl border-s-200 dark:border-s-700 focus:border-p-500 bg-white dark:bg-s-800 px-4 py-3 mb-4">
                {inputType === 'password' ? (
                    <TextInput
                        value={value}
                        onChangeText={newText => {
                            setValue && setValue(newText);
                        }}
                        placeholder={label}
                        keyboardType={keyboardType}
                        tw="flex-1 p-0 text-lg text-s-500 dark:text-s-300"
                        secureTextEntry={true}
                        placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    />
                ) : (
                    <TextInput
                        value={value}
                        onChangeText={newText => {
                            setValue && setValue(newText);
                        }}
                        placeholder={label}
                        keyboardType={keyboardType}
                        tw="flex-1 p-0 text-lg text-s-500 dark:text-s-300"
                        placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    />
                )}
                <TouchableOpacity onPress={fieldButtonFunction}>
                    <Text tw="text-p-500 dark:text-p-400 font-bold">{fieldButtonLabel}</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
