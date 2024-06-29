import AuthScreen from '../auth/AuthScreen';
import HomeScreen from '~components/screens/HomeScreen';
import LanguageScreen from '~components/screens/LanguageScreen';
import MapLocalFilterScreen from '~components/screens/MapLocalFilterScreen';
import NodeScreen from '~components/screens/NodeScreen';
import NodeAuditScreen from './NodeAuditScreen';
import NodedataCreatorScreen from '~components/screens/NodedataCreatorScreen';
import NodedataCreatorTagScreen from '~components/screens/NodedataCreatorTagScreen';
import NodedataScreen from '~components/screens/NodedataScreen';
import ReviewFormScreen from '~components/screens/ReviewFormScreen';
import ReviewScreen from '~components/screens/ReviewScreen';
import SettingScreen from './SettingScreen';
import SyncScreen from '~components/screens/SyncScreen';
import UserFormAvatarScreen from '~components/screens/UserFormAvatarScreen';
import UserFormScreen from '~components/screens/UserFormScreen';
import MapFormSearchScreen from './MapFormSearchScreen';

export {
    AuthScreen,
    HomeScreen,
    LanguageScreen,
    MapLocalFilterScreen,
    // MapScreen,
    NodeScreen,
    MapFormSearchScreen,
    NodeAuditScreen,
    NodedataCreatorScreen,
    NodedataCreatorTagScreen,
    NodedataScreen,
    ReviewFormScreen,
    ReviewScreen,
    SettingScreen,
    SyncScreen,
    UserFormAvatarScreen,
    UserFormScreen,
};

export enum ScreenKeys {
    NodeScreen = 'NodeScreen',
    NodedataScreen = 'NodedataScreen',
    AuthScreen = 'AuthScreen',
}
