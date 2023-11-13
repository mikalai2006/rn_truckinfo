import React, {useCallback, useRef} from 'react';
import {View, Text, Button, NativeModules, Platform, RefreshControl, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
// import WebviewBlok from '../WebviewBlok';
import PushNotification from 'react-native-push-notification';
import RButton from '~components/r/RButton';
import {SSkeleton} from '~components/ui/SSkeleton';
import SBottomSheet, {BottomSheetRefProps} from '~components/ui/SBottomSheet';
import {useColorScheme} from 'nativewind';
import FocusStatusBar from '~components/FocusStatusBar';
import WidgetHeaderApp from '~components/widgets/WidgetHeaderApp';
import {iGlobe} from '~utils/icons';
import SIcon from '~components/ui/SIcon';
import SettingStack from '~components/navigations/SettingStack';

const SettingScreenTes = ({navigation}) => {
    const {colorScheme} = useColorScheme();

    return <SettingStack />;
};

export default SettingScreenTes;
