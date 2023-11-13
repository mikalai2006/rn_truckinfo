import {View, Text, ActivityIndicator, NativeSyntheticEvent, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {LatLng, LeafletView, WebviewLeafletMessage} from 'react-native-leaflet-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RButton from '~components/r/RButton';
import WebView from 'react-native-webview';

const DEFAULT_COORDINATE: LatLng = {
    lat: 37.78825,
    lng: -122.4324,
};

const WidgetMapLeaflet = () => {
    const [markers, setMarkers] = useState([]);

    const onFindAllNodes = () => {
        // const [latA, lonA, latB, lonB] = boundsCoords.value.split(",");
        fetch('http://localhost:8000/api/v1/gql/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                //latA: ${latA}, latB: ${latB}, lonA: ${lonA}, lonB: ${lonB}
                query: `
                  query findNodes {
                    nodes(limit:10) {
                      data {
                            id
                          type
                          lon
                          lat
                          osmId
                      }
                    }
                  }
              `,
            }),
        })
            .then(r => r.json())
            .then(res => {
                // Add markers to the layer
                const edges = res.data.nodes?.data;
                const m = [];
                if (edges) {
                    for (let i = 0; i < edges.length; i++) {
                        const node = edges[i];
                        const {lat, lon} = node;

                        m.push({
                            position: {
                                lat: lat,
                                lng: lon,
                            },
                            icon: '📍',
                            size: [32, 32],
                        });
                    }
                }
                console.log('[...m].length=', [...m].length);
                setMarkers([...m]);
            });
    };

    useEffect(() => {
        onFindAllNodes();
    }, []);

    return (
        <View tw="flex-1">
            <LeafletView
                // mapMarkers={markers}
                // mapCenterPosition={markers[0].position}
                mapCenterPosition={DEFAULT_COORDINATE}
                mapMarkers={[
                    {
                        position: DEFAULT_COORDINATE,
                        icon: '📍',
                        size: [32, 32],
                    },
                ]}
                doDebug={false}
                // The rest of your props, see the list below
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

export default WidgetMapLeaflet;
