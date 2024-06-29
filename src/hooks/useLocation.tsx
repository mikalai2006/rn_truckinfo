import Geolocation from '@react-native-community/geolocation';

const useLocation = (
    enabled: boolean,
    accuracyThreshold?: number,
    accuracyThresholdWaitTime?: number,
    options?: PositionOptions,
): [ILocation | undefined, number | undefined, string | undefined] => {
    const [accuracy, setAccuracy] = React.useState<number>();
    const [location, setLocation] = React.useState<ILocation>();
    const [error, setError] = React.useState<string>();

    React.useEffect(() => {
        if (!enabled) {
            setAccuracy(undefined);
            setError(undefined);
            setLocation(undefined);
            return;
        }
        if (navigator.geolocation) {
            let timeout: NodeJS.Timeout | undefined;
            const geoId = navigator.geolocation.watchPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setAccuracy(position.coords.accuracy);

                    if (accuracyThreshold == null || position.coords.accuracy < accuracyThreshold) {
                        setLocation({lat, lng});
                    }
                },
                e => {
                    setError(e.message);
                },
                options ?? {enableHighAccuracy: true, maximumAge: 2000, timeout: 5000},
            );
            if (accuracyThreshold && accuracyThresholdWaitTime) {
                timeout = setTimeout(() => {
                    if (!accuracy || accuracy < accuracyThreshold) {
                        setError('Failed to reach desired accuracy');
                    }
                }, accuracyThresholdWaitTime * 1000);
            }
            return () => {
                window.navigator.geolocation.clearWatch(geoId);
                if (timeout) {
                    clearTimeout(timeout);
                }
            };
        }

        setError('Geolocation API not available');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, accuracyThresholdWaitTime, accuracyThreshold, options]);

    if (!enabled) {
        return [undefined, undefined, undefined];
    }

    return [location, accuracy, error];
};

export {useLocation};
