import AuthScreen from '../auth/AuthScreen';
import HomeScreen from '~components/screens/HomeScreen';
import MapFilterScreen from '~components/screens/MapFilterScreen';
import NodeShortScreen from '~components/screens/NodeShortScreen';
import NodeAuditScreen from './NodeAuditScreen';
import NodedataCreatorScreen from '~components/screens/NodedataCreatorScreen';
import NodedataCreatorTagScreen from '~components/screens/NodedataCreatorTagScreen';
import NodedataScreen from '~components/screens/NodedataScreen';
import ReviewFormScreen from '~components/screens/ReviewFormScreen';
import ReviewScreen from '~components/screens/ReviewScreen';
import SettingScreen from './SettingScreen';
import SyncScreen from '~components/screens/SyncScreen';
import SettingAvatarScreen from '~components/screens/SettingAvatarScreen';
import SettingFormScreen from '~components/screens/SettingFormScreen';
import SettingLangScreen from '~components/screens/SettingLangScreen';
import MapFormSearchScreen from './MapFormSearchScreen';
import NodeMoreScreen from './NodeMoreScreen';
import UserScreen from './UserScreen';
import NodedataVoteScreen from './NodedataVoteScreen';
import HelpScreen from './HelpScreen';

export {
    AuthScreen,
    HelpScreen,
    HomeScreen,
    MapFilterScreen,
    // MapScreen,
    NodeShortScreen,
    NodeMoreScreen,
    MapFormSearchScreen,
    NodeAuditScreen,
    NodedataCreatorScreen,
    NodedataVoteScreen,
    NodedataCreatorTagScreen,
    NodedataScreen,
    ReviewFormScreen,
    ReviewScreen,
    SettingScreen,
    SyncScreen,
    SettingAvatarScreen,
    SettingFormScreen,
    SettingLangScreen,
    UserScreen,
};

export enum ScreenKeys {
    NodedataScreen = 'NodedataScreen',
    AuthScreen = 'AuthScreen',
}
