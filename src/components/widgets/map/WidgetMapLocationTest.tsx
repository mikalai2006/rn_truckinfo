import {View, Text, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';

import LocationEnabler from 'react-native-location-enabler';
import LocationModule from '../../../../LocationModule';
import UIButton from '~components/ui/UIButton';

const {
    PRIORITIES: {HIGH_ACCURACY},
    addListener,
    checkSettings,
    // useLocationSettings,
} = LocationEnabler;

const config = {
    priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
    alwaysShow: true, // default false
    needBle: true, // default false
};

checkSettings(config);

const LocationStatus = (props: {enabled: boolean | undefined}) => (
    <Text style={styles.status}>
        Location : [{' '}
        {props.enabled !== undefined && props.enabled ? (
            <Text style={styles.enabled}>Enabled</Text>
        ) : props.enabled !== undefined && !props.enabled ? (
            <Text style={styles.disabled}>Disabled</Text>
        ) : (
            <Text style={styles.undefined}>Undefined</Text>
        )}{' '}
        ]
    </Text>
);

// const RequestResolutionSettingsBtn = (props: {onPress: any}) => (
//     <Button color="red" title="Request Resolution Location Settings" onPress={props.onPress} />
// );

const WidgetMapLocationTest = () => {
    const [enabled, setEnabled] = useState(false);
    // const [enabled, requestResolution] = useLocationSettings({
    //     priority: HIGH_ACCURACY,
    //     alwaysShow: true,
    //     needBle: true,
    // });

    const listener = addListener(({locationEnabled}) => {
        console.log(`Location are ${locationEnabled ? 'enabled' : 'disabled'}`);
        setEnabled(locationEnabled);

        // onEnableLocation && onEnableLocation(locationEnabled);
    });
    useEffect(() => {
        return () => {
            listener.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View tw="">
            <LocationStatus enabled={enabled} />
            {/* {!enabled && <RequestResolutionSettingsBtn onPress={requestResolution} />} */}
            {!enabled && <Text>enabled={enabled}</Text>}
            <UIButton type="default" text="go" onPress={() => LocationModule.startLocationReceiver()} />
            <UIButton type="default" text="stop" onPress={() => LocationModule.stopLocationReceiver()} />
        </View>
    );
};

const colors = {
    red: '#b90707',
    green: '#03b503',
    blue: '#0000f7',
};

const styles = StyleSheet.create({
    disabled: {
        color: colors.red,
    },
    enabled: {
        color: colors.green,
    },
    status: {
        fontSize: 20,
        margin: 20,
    },
    undefined: {
        color: colors.blue,
    },
});

export default WidgetMapLocationTest;
