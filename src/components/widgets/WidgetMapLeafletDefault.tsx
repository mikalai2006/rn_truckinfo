import {View, Text, ActivityIndicator, NativeSyntheticEvent, StyleSheet} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
// import {LatLng, LeafletView, WebviewLeafletMessage} from 'react-native-leaflet-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RButton from '~components/r/RButton';
import WebView from 'react-native-webview';
import {WebViewError} from 'react-native-webview/lib/WebViewTypes';
// import RTNReactNativeLeafletjs from 'rtn-react-native-leafletjs';

const LEAFLET_HTML_SOURCE = Platform.select({
    ios: require('../../../android/app/src/main/assets/leaflet.html'),
    android: {uri: 'file:///android_asset/leaflet.html'},
});

const DEFAULT_ZOOM = 15;

const DEFAULT_MAP_LAYERS = [
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        baseLayerIsChecked: true,
        baseLayerName: 'OpenStreetMap.Mapnik',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
];

export type LeafletViewProps = {
    renderLoading?: () => React.ReactElement;
    onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
    onLoadEnd?: () => void;
    onLoadStart?: () => void;
    onMessageReceived?: (message: WebviewLeafletMessage) => void;
    mapLayers?: MapLayer[];
    mapMarkers?: MapMarker[];
    mapShapes?: MapShape[];
    mapCenterPosition?: LatLng;
    ownPositionMarker?: OwnPositionMarker;
    zoom?: number;
    doDebug?: boolean;
    androidHardwareAccelerationDisabled?: boolean;
};

const WidgetMapLeafletDefault = ({
    renderLoading,
    onError,
    onLoadEnd,
    onLoadStart,
    onMessageReceived,
    mapLayers,
    mapMarkers,
    mapShapes,
    mapCenterPosition,
    ownPositionMarker,
    zoom,
    doDebug,
    androidHardwareAccelerationDisabled,
}: LeafletViewProps) => {
    const [result, setResult] = useState<string | null>(null);

    let webviewRef = useRef<WebView>();
    const [initialized, setInitialized] = useState(false);

    const logMessage = useCallback(
        (message: string) => {
            if (doDebug) {
                console.log(message);
            }
        },
        [doDebug],
    );
    const sendMessage = useCallback(
        (payload: MapMessage) => {
            logMessage(`sending: ${JSON.stringify(payload)}`);

            webViewRef.current?.injectJavaScript(`window.postMessage(${JSON.stringify(payload)}, '*');`);
        },
        [logMessage],
    );
    const sendInitialMessage = useCallback(() => {
        let startupMessage: MapMessage = {};

        if (mapLayers) {
            startupMessage.mapLayers = mapLayers;
        }
        if (mapMarkers) {
            startupMessage.mapMarkers = mapMarkers;
        }
        if (mapCenterPosition) {
            startupMessage.mapCenterPosition = mapCenterPosition;
        }
        if (mapShapes) {
            startupMessage.mapShapes = mapShapes;
        }
        if (ownPositionMarker) {
            startupMessage.ownPositionMarker = {
                ...ownPositionMarker,
                id: OWN_POSTION_MARKER_ID,
            };
        }
        startupMessage.zoom = zoom;

        sendMessage(startupMessage);
        setInitialized(true);
        logMessage('sending initial message');
    }, [logMessage, mapCenterPosition, mapLayers, mapMarkers, mapShapes, ownPositionMarker, sendMessage, zoom]);

    return (
        <View tw="flex-1">
            {/* <LeafletView
            // The rest of your props, see the list below
            /> */}
            <WebView
                ref={webviewRef}
                sharedCookiesEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccessFromFileURLs={true}
                originWhitelist={['*']}
                setDomStorageEnabled={true}
                source={LEAFLET_HTML_SOURCE}
                onMessage={event => {}}
                onLoadEnd={onLoadEnd}
                onLoadStart={onLoadStart}
                //   onMessage={handleMessage}
                onError={onError}
                renderLoading={renderLoading}
                style={{flex: 1, ...StyleSheet.absoluteFillObject}}
            />
            <View tw="absolute right-0 top-0 p-2">
                {/* <RButton
                    tw="bg-p-500 rounded-full"
                    onPress={async () => {
                        const value = await RTNReactNativeLeafletjs?.getDeviceModel();
                        setResult(value ?? null);
                    }}>
                    <Icon name="layers-outline" size={32} />
                </RButton> */}
            </View>
        </View>
    );
};

WidgetMapLeafletDefault.defaultProps = {
    renderLoading: () => <ActivityIndicator />,
    mapLayers: DEFAULT_MAP_LAYERS,
    zoom: DEFAULT_ZOOM,
    doDebug: true, //__DEV__,
};

export default WidgetMapLeafletDefault;
