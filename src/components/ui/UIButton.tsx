import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import colors from '~utils/colors';
import SIcon from './SIcon';

export interface UIButtonProps {
    text?: string;
    disabled?: boolean;
    onPress?: () => void;
    loading?: boolean;
    icon?: string;
    twClass?: string;
    children?: any;
    customClass?: string;
    type: 'default' | 'primary' | 'link';
}

export default function UIButton(props: UIButtonProps) {
    const classBtn = React.useMemo(() => {
        let result = 'p-3 rounded-xl border ';

        const disableClass = ' bg-transparent border-s-200 dark:border-s-900 ';

        switch (props.type) {
            case 'primary':
                result += props.disabled ? disableClass : ' bg-p-500 border-p-500';
                break;
            case 'default':
                result += props.disabled ? disableClass : ' bg-s-50 dark:bg-s-800 border-s-200 dark:border-s-800';
                break;
            case 'link':
                result += props.disabled ? disableClass : ' bg-transparent border-transparent';
                break;
            default:
                result += 'bg-s-200';
                break;
        }

        return result + ` ${props.twClass}`;
    }, [props.disabled, props.twClass, props.type]);

    const classText = React.useMemo(() => {
        let result = 'text-base px-2 ';

        const disableClass = ' text-s-300 dark:text-s-500 ';

        switch (props.type) {
            case 'primary':
                result += props.disabled ? disableClass : ' text-p-50';
                break;
            case 'default':
                result += props.disabled ? disableClass : ' text-s-800 dark:text-s-50';
                break;
            default:
                result += '';
                break;
        }

        return result + ` ${props.twClass}`;
    }, [props.disabled, props.twClass, props.type]);

    const classIcon = React.useMemo(() => {
        let result = '';

        const disableClass = ' text-s-300 dark:text-s-500 ';

        switch (props.type) {
            case 'primary':
                result += props.disabled ? disableClass : ' text-p-50';
                break;
            case 'default':
                result += props.disabled ? disableClass : ' text-s-800 dark:text-s-50';
                break;
            default:
                result += '';
                break;
        }

        return result + ` ${props.twClass}`;
    }, [props.disabled, props.twClass, props.type]);

    const colorLoader = React.useMemo(() => {
        let result = '';

        const disableColor = colors.s[500];

        switch (props.type) {
            case 'primary':
                result = props.disabled ? disableColor : colors.w;
                break;
            case 'default':
                result = props.disabled ? disableColor : colors.s[600];
                break;
            default:
                result = disableColor;
                break;
        }

        return result;
    }, [props.disabled, props.type]);

    return (
        <TouchableOpacity
            disabled={props.disabled}
            onPress={props.onPress}
            activeOpacity={0.5}
            tw={props?.customClass || classBtn}>
            {props.children || (
                <View tw="flex flex-row items-center justify-center">
                    {props.loading ? (
                        <ActivityIndicator size={25} color={colorLoader} />
                    ) : props.icon ? (
                        <View>
                            <SIcon path={props.icon} size={25} tw={classIcon} />
                        </View>
                    ) : null}
                    <Text tw={classText}>{props.text}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
