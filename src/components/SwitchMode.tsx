import React from 'react';

import {TouchableOpacity, Text} from 'react-native';
import {styled, useColorScheme} from 'nativewind';

import {setDark} from '../store/appSlice';
import {useAppDispatch} from '../store/hooks';
import SIcon from './ui/SIcon';
import {iMoon, iSun} from '~utils/icons';

const StyledPressable = styled(TouchableOpacity);
const StyledText = styled(Text);

export default function SwitchMode() {
    const {colorScheme, toggleColorScheme} = useColorScheme();

    const dispatch = useAppDispatch();

    const onToggleDark = () => {
        toggleColorScheme();
        dispatch(setDark(colorScheme !== 'dark'));
    };

    return (
        <StyledPressable onPress={onToggleDark} className="rounded-lg p-3 bg-s-100/30 dark:bg-s-900/20">
            <StyledText selectable={false} className="text-s-900 dark:text-white text-2xl">
                {colorScheme === 'dark' ? (
                    <SIcon path={iMoon} size={32} tw="text-s-300" />
                ) : (
                    <SIcon path={iSun} size={32} tw="text-s-500" />
                )}
            </StyledText>
        </StyledPressable>
    );
}
