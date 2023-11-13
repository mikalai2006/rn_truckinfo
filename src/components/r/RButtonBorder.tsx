import {TouchableOpacity} from 'react-native';
import React from 'react';

export default function RButtonBorder(props) {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            onPress={props.onPress}
            activeOpacity={0.6}
            tw={`border rounded-lg py-4 px-6 mb-2 ${
                props.disabled
                    ? 'bg-s-200 dark:bg-s-700 border-s-200  dark:border-s-700 opacity-50'
                    : 'bg-white dark:bg-s-800 border-s-200 dark:border-s-700'
            } ${props.twClass}`}>
            {props.children}
        </TouchableOpacity>
    );
}
