import React, {useEffect, useRef, useState} from 'react';
import {View, Alert, Button, Text, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';

import Geolocation from '@react-native-community/geolocation';
import {useColorScheme} from 'nativewind';

const MapArea = () => {
  let webviewRef = useRef();

  const setJWT = async value => {
    try {
      await AsyncStorage.setItem('jwt', value);

      console.log('jwt=', value);
    } catch (error) {
      console.log(error);
    }
  };
  const getJWT = async () => {
    try {
      // const userData = JSON.parse(await AsyncStorage.getItem('jwt'));
      const jwt = await AsyncStorage.getItem('jwt');
      setJwt(jwt);
    } catch (error) {
      console.log(error);
    }
  };
  getJWT();

  const watchPosition = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Location Permission',
          message: 'App Location Permission ' + ' are needed to help you',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        const watchID = Geolocation.watchPosition(
          position => {
            // webview.current.postMessage(
            //   JSON.stringify({event: 'currentPosition', data: position}),
            // );
            webviewRef.current?.injectJavaScript(
              `(function() {
                document.dispatchEvent(new MessageEvent('message',
                  ${JSON.stringify({
                    data: {
                      event: 'position',
                      position: position,
                    },
                  })}));
              })();
              `,
            );
            console.log(
              'Change position',
              position.coords.latitude,
              ',',
              position.coords.longitude,
            );
            setPosition(JSON.stringify(position));
          },
          error => Alert.alert('WatchPosition Error', JSON.stringify(error)),
          {
            // enableHighAccuracy: false,
            interval: 10,
            distanceFilter: 1,
            // distanceFilter: 250, // 100 meters
            // maximumAge: 20000,
            // timeout: 120000,
          },
        );
        setSubscriptionId(watchID);
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      Alert.alert('WatchPosition Error', JSON.stringify(error));
    }
  };

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
    setPosition(null);
  };

  const requestGeoPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'App Location Permission',
          message: 'App Location Permission ' + ' are needed to help you',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getCurrentPosition();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log('getCurrentPosition', pos);
        setPosition(JSON.stringify(pos));
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {
        enableHighAccuracy: false,
        // distanceFilter: 250, // 100 meters
        // maximumAge: 20000,
        // timeout: 120000,
      },
    );
  };

  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {colorScheme} = useColorScheme();

  React.useEffect(() => {
    webviewRef.current?.injectJavaScript(
      `(function() {
        document.dispatchEvent(new MessageEvent('message',
          ${JSON.stringify({
            data: {
              event: 'dark',
              dark: colorScheme === 'dark',
            },
          })}));
      })();
      `,
    );
    return () => {};
  }, [colorScheme]);

  return (
    <View style={{height: '100%'}}>
      <Text>
        {/* <Text>Current position: </Text>
        {position || 'unknown'} */}
        {jwt}
      </Text>
      {subscriptionId !== null ? (
        <Button title="Clear Watch" onPress={clearWatch} />
      ) : (
        <Button title="Watch Position" onPress={watchPosition} />
      )}
      {/* <Button title="Get Current Positions" onPress={requestGeoPermission} /> */}
      <WebView
        ref={webviewRef}
        sharedCookiesEnabled={true}
        // geolocationEnabled={true}
        // injectedJavaScript={}
        originWhitelist={['*']}
        source={{
          uri: 'http://localhost:1111/',
          headers: {
            Cookie: 'dark=${true}',
          },
        }}
        onMessage={event => {
          console.log('event', event);

          const data = JSON.parse(event.nativeEvent.data);

          if (data.event === 'jwt') {
            setJWT(data.data);
          }
        }}
        // startInLoadingState={true}
        javaScriptEnabled
        domStorageEnabled
        style={{height: '100%'}}
      />
    </View>
  );
};

export default MapArea;
