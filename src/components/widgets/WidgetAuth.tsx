import React from 'react';
import {StyledComponent, styled, useColorScheme} from 'nativewind';
import {Pressable, Text, TextInput, View} from 'react-native';

import colors from '../../utils/colors';

const StyledView = styled(View, 'flex p-4 rounded-md bg-s-50 dark:bg-s-800 mr-4');
// const StyledTextInput = styled(
//   TextInput,
//   'flex p-4 rounded-md bg-s-200 dark:bg-s-800',
// );
const StyledLabel = styled(Text, 'text-s-500 dark:text-s-400 pb-1 text-lg');
const StyledInput = styled(
    TextInput,
    'self-stretch bg-s-100 dark:bg-s-700 text-s-500 dark:text-s-300 rounded-md py-2 px-4 text-lg',
);

export default function WidgetAuth() {
    const {colorScheme} = useColorScheme();
    return (
        <StyledView>
            <View tw="flex">
                <StyledLabel>Login</StyledLabel>
                <StyledInput
                    placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    placeholder="useless placeholder"
                    tw=""
                />
                <StyledLabel tw="pt-4">Password</StyledLabel>
                <StyledInput
                    placeholderTextColor={colorScheme === 'dark' ? colors.s[500] : colors.s[400]}
                    placeholder="useless placeholder"
                />
                <StyledComponent
                    component={Pressable}
                    tw="self-end mt-6 p-4 bg-p-500 dark:bg-p-700 hover:bg-p-300 dark:hover:bg-p-300 rounded-xl w-auto">
                    <StyledComponent component={Text} tw="text-white dark:text-p-100 text-xl">
                        Send
                    </StyledComponent>
                </StyledComponent>
            </View>
            <Text tw="text-s-500 dark:text-s-300">Widget2 auth</Text>
        </StyledView>
    );
}
