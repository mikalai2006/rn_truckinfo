import {Platform} from 'react-native';
import {setAppearanceDark, setAppearanceLight} from 'react-native-appearance-control';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import colors from './colors';

export const setMode = (mode: 'dark' | 'light' | 'system') => {
    if (Platform.OS === 'android') {
        // console.log('mode=', mode);

        if (mode === 'dark') {
            setAppearanceDark();
            SystemNavigationBar.setNavigationColor(colors.s[950], 'light', 'navigation');
        } else {
            setAppearanceLight();
            SystemNavigationBar.setNavigationColor(colors.s[100], 'dark', 'navigation');
        }
    }
};
