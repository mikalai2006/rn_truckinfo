import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import {MapLocalStackParamList} from '~components/navigations/MapLocalStack';
import WidgetMap from '~components/widgets/map/WidgetMap';
import WidgetMapHeading from '~components/widgets/map/WidgetMapHeading';

const source = require('./map.html');
const webviewSource = Image.resolveAssetSource(source);

type Props = NativeStackScreenProps<MapLocalStackParamList, 'MapLocalScreen'>;

const MapLocalScreen = (props: Props) => {
    const {route} = props;
    const marker = route.params?.marker;
    const initialCenter = route.params?.initialCenter;
    // console.log('MapLocalScreen: ');

    const [angleDefault, setAngleDefault] = useState(0);
    const [enableMagnet, setEnableMagnet] = useState(false);
    const angle = useMemo(() => 360 - angleDefault, [angleDefault]);

    return (
        <View tw="flex-1 bg-white dark:bg-s-900">
            <WidgetMap
                source={webviewSource}
                marker={marker}
                initialCenter={initialCenter}
                enableMagnet={enableMagnet}
                angle={angle}
                compass={
                    <WidgetMapHeading
                        onSetAngle={setAngleDefault}
                        onSetEnable={setEnableMagnet}
                        angle={angleDefault}
                        enable={enableMagnet}
                    />
                }
            />
        </View>
    );
};

export default MapLocalScreen;
