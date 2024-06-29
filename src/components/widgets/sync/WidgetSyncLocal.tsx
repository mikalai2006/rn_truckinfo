import React, {useEffect} from 'react';

import {useSync} from '~hooks/useSync';

export const WidgetSyncLocal = () => {
    const {onSync} = useSync();

    useEffect(() => {
        onSync();
    }, []);

    return <></>;
};
