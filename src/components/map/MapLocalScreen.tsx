import React from 'react';
import {Image, View} from 'react-native';
import WidgetMap from '~components/widgets/map/WidgetMap';

const source = require('./map.html');
const webviewSource = Image.resolveAssetSource(source);

const MapLocalScreen = () => {
    console.log('MapLocalScreen');

    return (
        <View tw="flex-1 bg-white dark:bg-s-900">
            {/* <WebView ref={mapRef} source={webviewSource} /> */}
            <WidgetMap source={webviewSource} tw="z-0" />
            {/* <WidgetMapLeaflet /> */}
        </View>
    );
};

export default MapLocalScreen;
