import React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

export default function FocusAwareStatusBar(props) {
  const ifFocused = useIsFocused();

  return ifFocused ? <StatusBar {...props} /> : null;
}
