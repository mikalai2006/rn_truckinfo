import React, {useCallback, useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {MapMarker, WebviewOLMessage, MapMessage, WebViewOLEvents, MapLayer, IInitMessage} from './types';
import {LatLng} from './types';
import {NativeSyntheticEvent, StyleSheet, Platform} from 'react-native';
import {WebViewError, WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';
import LoadingIndicator from '../LoadingIndicator';
import {GeolocationResponse} from '@react-native-community/geolocation';

// const OL_HTML_SOURCE = Platform.select({
//     ios: require('../../android/src/main/assets/OL.html'),
//     android: {uri: 'file:///android_asset/OL.html'},
// });

// const DEFAULT_MAP_LAYERS = [
//     {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//         baseLayerIsChecked: true,
//         baseLayerName: 'OpenStreetMap.Mapnik',
//         url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     },
// ];

const DEFAULT_ZOOM = 15;
const DEFAULT_MAX_ZOOM = 16;
const DEFAULT_MIN_ZOOM = 10;

export type OLViewProps = {
    renderLoading?: () => React.ReactElement;
    onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
    onLoadEnd?: () => void;
    onLoadStart?: () => void;
    onMessageReceived?: (message: WebviewOLMessage) => void;
    mapMarkers?: MapMarker[];
    mapCenterPosition?: LatLng;
    zoom?: number;
    filePath?: string;
    source?: string;
    fileAccessPath?: string;
    maxZoom?: number;
    minZoom?: number;
    doDebug?: boolean;
    androidHardwareAccelerationDisabled?: boolean;
    bgColor?: string;
    theme?: string;
    amenity?: any[];
    activeNode?: any;
    showCross?: boolean;
    typeNewNode?: string;
    initMarkers?: any[];
    myPosition?: GeolocationResponse | null;
    gyroscope?: number;
    myPositionToCenter?: LatLng | null;
    enableMagnet: boolean;
    allowDistance: number;
    pointsAllowArea: [];
};

const OLView: React.FC<OLViewProps> = ({
    renderLoading,
    onError,
    onLoadEnd,
    onLoadStart,
    onMessageReceived,
    mapMarkers,
    mapCenterPosition,
    zoom,
    filePath,
    source,
    fileAccessPath,
    maxZoom,
    minZoom,
    doDebug,
    androidHardwareAccelerationDisabled,
    bgColor,
    theme,
    amenity,
    activeNode,
    showCross,
    typeNewNode,
    initMarkers,
    myPosition,
    gyroscope,
    myPositionToCenter,
    enableMagnet,
    allowDistance,
    pointsAllowArea,
}) => {
    const webViewRef = useRef<WebView>(null);
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
            webViewRef.current?.postMessage(JSON.stringify(payload));
            // webViewRef.current?.injectJavaScript(
            //   `window.postMessage(${JSON.stringify(payload)}, '*');`
            //   );
            logMessage(`sending: ${JSON.stringify(payload)}`);
        },
        [logMessage],
    );

    const sendInitialMessage = useCallback(() => {
        let startupMessage: IInitMessage = {};

        // if (mapMarkers) {
        //   startupMessage.mapMarkers = mapMarkers;
        // }
        if (mapCenterPosition) {
            startupMessage.mapCenterPosition = mapCenterPosition;
        }
        if (amenity) {
            startupMessage.amenity = amenity;
        }
        if (initMarkers) {
            startupMessage.initMarkers = initMarkers;
        }
        startupMessage.zoom = zoom;
        startupMessage.maxZoom = maxZoom;
        startupMessage.minZoom = minZoom;

        sendMessage({msg: WebViewOLEvents.INIT, ...startupMessage});
        setInitialized(true);
        logMessage('sending initial message');
    }, [logMessage, mapCenterPosition, mapMarkers, sendMessage, zoom, maxZoom, minZoom]);

    const handleMessage = useCallback(
        (event: WebViewMessageEvent) => {
            const data = event?.nativeEvent?.data;
            if (!data) {
                return;
            }

            const message: WebviewOLMessage = JSON.parse(data);
            logMessage(`received: ${JSON.stringify(message)}`);

            if (message.msg === WebViewOLEvents.MAP_READY) {
                sendInitialMessage();
            }
            if (message.event === WebViewOLEvents.ON_MOVE_END) {
                logMessage(`moved to: ${JSON.stringify(message.payload?.mapCenterPosition)}`);
            }

            onMessageReceived && onMessageReceived(message);
        },
        [logMessage, onMessageReceived, sendInitialMessage],
    );

    //Handle mapMarkers update
    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.MARKERS, mapMarkers}); //  : mapMarkers && mapMarkers.length > 0 ? mapMarkers?.join('|') : ''
        // console.log("Change markers", mapMarkers?.length);
    }, [initialized, mapMarkers, sendMessage]);

    // //Handle mapShapes update
    // useEffect(() => {
    //     if (!initialized) {
    //         return;
    //     }
    //     sendMessage({mapShapes});
    // }, [initialized, mapShapes, sendMessage]);

    //Handle show Cross
    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.SHOW_CROSS, showCross});
    }, [initialized, showCross, sendMessage]);

    //Handle type new Node
    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({
            msg: WebViewOLEvents.TYPE_NEW_NODE,
            typeNewNode,
        });
    }, [initialized, typeNewNode, sendMessage]);

    //Handle mapCenterPosition update
    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.CENTER, mapCenterPosition});
    }, [initialized, mapCenterPosition, sendMessage]);

    //Handle zoom update
    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.ZOOM, zoom, maxZoom, minZoom});
    }, [initialized, zoom, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.THEME, theme, bgColor});
    }, [initialized, theme, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        !activeNode && sendMessage({msg: WebViewOLEvents.CLEAR_ACTIVE_NODE, activeNode});
    }, [initialized, activeNode, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        amenity && sendMessage({msg: WebViewOLEvents.SEND_AMENITY, amenity});
    }, [initialized, amenity, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        myPosition && sendMessage({msg: WebViewOLEvents.MY_POSITION, myPosition});
    }, [initialized, myPosition, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        gyroscope && sendMessage({msg: WebViewOLEvents.GYROSCOPE, gyroscope});
    }, [initialized, gyroscope, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        myPositionToCenter && sendMessage({msg: WebViewOLEvents.MY_POSITION_TO_CENTER, myPositionToCenter});
    }, [initialized, myPositionToCenter, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.ENABLE_MAGNET, enableMagnet});
    }, [initialized, enableMagnet, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.ALLOW_DISTANCE, allowDistance});
    }, [initialized, allowDistance, sendMessage]);

    useEffect(() => {
        if (!initialized) {
            return;
        }
        sendMessage({msg: WebViewOLEvents.POINTS_ALLOW_AREA, pointsAllowArea});
    }, [initialized, pointsAllowArea, sendMessage]);

    return (
        <WebView
            containerStyle={{...styles.container, backgroundColor: bgColor}}
            style={{backgroundColor: theme === 'dark' ? bgColor : 'white'}}
            // containerStyle={styles.container}
            ref={webViewRef}
            javaScriptEnabled={true}
            onLoadEnd={onLoadEnd}
            onLoadStart={onLoadStart}
            onMessage={handleMessage}
            domStorageEnabled={true}
            startInLoadingState={true}
            onError={onError}
            originWhitelist={['*']}
            renderLoading={renderLoading}
            source={filePath ? {uri: filePath} : source} //? source : OL_HTML_SOURCE
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            androidHardwareAccelerationDisabled={androidHardwareAccelerationDisabled}
            allowingReadAccessToURL={fileAccessPath}
        />
    );
};

OLView.defaultProps = {
    renderLoading: () => <LoadingIndicator />,
    zoom: DEFAULT_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    minZoom: DEFAULT_MIN_ZOOM,
    doDebug: __DEV__,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
});

export default OLView;
