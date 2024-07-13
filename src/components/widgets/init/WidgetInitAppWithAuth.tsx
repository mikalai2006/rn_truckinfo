import {useEffect} from 'react';
import {hostAPI} from '~utils/global';

import {activeLanguage, setAmenities, setTags, ITokens} from '../../../store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import useAuth from '~hooks/useAuth';
import {useFetchWithAuth} from '~hooks/useFetchWithAuth';

export const WidgetInitAppWithAuth = () => {
    const {onSyncToken, isTokenExpired} = useAuth();

    const dispatch = useAppDispatch();
    const activeLanguageFromStore = useAppSelector(activeLanguage);

    const {onFetchWithAuth} = useFetchWithAuth();
    useEffect(() => {
        const onFetching = async () => {
            try {
                const onFindAmenities = async (tokenFromStore: ITokens) => {
                    await onFetchWithAuth(
                        hostAPI +
                            '/gql/query?' +
                            new URLSearchParams({
                                lang: activeLanguageFromStore?.code || 'en',
                            }),
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${tokenFromStore.access_token}`,
                            },
                            body: JSON.stringify({
                                query: `
                                query findAmenities {
                                    amenities(limit:99) {
                                        data {
                                            id
                                            type
                                            key
                                            title
                                            description
                                            status
                                            props
                                            tags
                                        }
                                        total
                                        skip
                                        limit
                                    }
                                }
                                `,
                            }),
                        },
                    )
                        .then(r => r.json())
                        .then(r => {
                            if (r.data?.amenities?.data?.length) {
                                dispatch(setAmenities(r.data.amenities.data));
                            }
                            // console.log('r.data.amenities.data=', r.data.amenities.data);
                        })
                        .catch(e => {
                            throw e;
                        });
                };

                const onFindTags = async (tokenFromStore: ITokens) => {
                    await onFetchWithAuth(
                        hostAPI +
                            '/gql/query?' +
                            new URLSearchParams({
                                lang: activeLanguageFromStore?.code || 'en',
                            }),
                        {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${tokenFromStore.access_token}`,
                            },
                            body: JSON.stringify({
                                query: `
                                query findTags {
                                    tags(limit:100,skip:0) {
                                        total
                                        skip
                                        limit
                                        data {
                                            id
                                            key
                                            title
                                            type
                                            multiopt
                                            isFilter
                                            title
                                            description
                                            props
                                            options {
                                                id
                                                tagId
                                                value
                                                title
                                                description
                                                props
                                            }
                                        }
                                    }
                                }
                            `,
                            }),
                        },
                    )
                        .then(r => r.json())
                        .then(r => {
                            if (r.data?.tags?.data?.length) {
                                dispatch(setTags(r.data.tags.data));
                            }
                        })
                        .catch(e => {
                            throw e;
                        });
                };

                const tokenFromStore = await onSyncToken();
                if (tokenFromStore && !isTokenExpired()) {
                    await onFindAmenities(tokenFromStore);
                    await onFindTags(tokenFromStore);
                }
            } catch (e: any) {
                console.log('WidgetInitAppWithAuth error: ', e.message);
            } finally {
            }
        };

        onFetching();
    }, [activeLanguageFromStore?.code]);

    return null;
};
