import React from 'react';
import {styled, useColorScheme} from 'nativewind';
import {Text, TouchableOpacity, View} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import UIButton from '~components/ui/UIButton';

const StyledView = styled(View, 'flex p-4 rounded-md mr-4');

export default function WidgetAuth() {
    const {colorScheme} = useColorScheme();
    const {t} = useTranslation();
    const navigation = useNavigation();

    return (
        <StyledView>
            <View>
                <Text tw="text-s-700 dark:text-s-400 text-base leading-5">{t('general:authInvite')}</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Onboarding');
                    }}>
                    <Text tw="underline text-base text-black dark:text-white pt-2">{t('general:authBonuses')}</Text>
                </TouchableOpacity>
                <View tw="pt-6">
                    <UIButton
                        type="primary"
                        disabled={false}
                        text={t('general:loginTitle')}
                        onPress={() => {
                            //setModalVisible(!modalVisible)
                            navigation.navigate('AuthScreen');
                        }}
                    />
                </View>
            </View>
            {/* <View tw="flex">
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
            <Text tw="text-s-500 dark:text-s-300">Widget2 auth</Text> */}
        </StyledView>
    );
}
