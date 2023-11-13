import {useEffect, useState} from 'react';
import {IFeature, activeNode, feature, markerConfig, setActiveMarkerConfig, setActiveNode} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';

import {IMarkerConfig, markerdata} from '~utils/markerdata';

const useDataApi = (initialQuery: string) => {
    const dispatch = useAppDispatch();
    const featureFromStore = useAppSelector(feature);
    const markerConfigFromStore = useAppSelector(markerConfig);
    const activeNodeFromStore = useAppSelector(activeNode);
    // const [markerConfig, setMarkerConfig] = useState<IMarkerConfig | null>(null);

    // const [data, setData] = useState(initialData);
    // const [url, setUrl] = useState(initialUrl);
    const [query, setQuery] = useState(initialQuery);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const onGetNodeInfo = async () => {
            setIsError(false);
            setError('');
            setIsLoading(true);
            try {
                await fetch(
                    'http://localhost:8000/api/v1/gql/query?' +
                        new URLSearchParams({
                            lang: 'ru',
                        }),
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            // Authorization: `Bearer ${tokenData.access_token}`,
                        },
                        body: JSON.stringify({
                            query,
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        // console.log('activeMarker=', response);
                        const {node} = response.data;
                        const {type} = node;
                        const c = markerdata.find(x => x.type === type) || null;
                        dispatch(setActiveMarkerConfig(c));
                        dispatch(setActiveNode(response.data.node));
                    })
                    .catch(e => {
                        throw e;
                    });
            } catch (e) {
                setIsError(true);
                setError(e?.message);
            }
            setIsLoading(false);
        };
        if (featureFromStore?.osmId) {
            onGetNodeInfo();
        }
    }, [dispatch, featureFromStore?.osmId, query]);

    const data = {
        markerConfig: markerConfigFromStore,
        activeNode: activeNodeFromStore,
        feature: featureFromStore,
        isLoading,
        error,
        isError,
    };

    return [data, setQuery];
};

export default useDataApi;
