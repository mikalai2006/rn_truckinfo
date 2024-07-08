import React, {useState} from 'react';
import {HOST_API} from '@env';

import {useFetchWithAuth} from './useFetchWithAuth';
import {useAppDispatch, useAppSelector} from '~store/hooks';
import {IUser, activeLanguage, setUser, user} from '~store/appSlice';
import {useTranslation} from 'react-i18next';

export interface IUseUserProps {
    id: string;
}

const useUser = (props: IUseUserProps) => {
    // console.log('useUser---------------------->');

    const {t} = useTranslation();

    const {id} = props;

    const {onFetchWithAuth} = useFetchWithAuth();

    const activeLanguageFromStore = useAppSelector(activeLanguage);
    const userFromStore = useAppSelector(user);
    const dispatch = useAppDispatch();

    const [isLoading, setLoading] = useState(true);
    const [userFromServer, setUserFromServer] = useState<IUser | null>(null);

    React.useEffect(() => {
        let ignore = false;
        const onGetUser = async () => {
            try {
                await onFetchWithAuth(
                    HOST_API +
                        '/gql/query?' +
                        new URLSearchParams({
                            lang: activeLanguageFromStore?.code || 'en',
                        }),
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `
                                query($id:ID) {
                                    user(id: $id) {
                                        id
                                        lang
                                        name
                                        login
                                        lastTime
                                        online
                                        roles
                                        md
                                        createdAt
                                        updatedAt
                                        userStat {
                                            node
                                            nodeLike
                                            nodeDLike
                                            nodeAuthorLike
                                            nodeAuthorDLike
                                            nodedata
                                            nodedataLike
                                            nodedataDLike
                                            nodedataAuthorLike
                                            nodedataAuthorDLike
                                            review
                                        }
                                        images {
                                            id
                                            service
                                            serviceId
                                            title
                                            userId
                                            path
                                            dir
                                            ext
                                        }
                                    }
                                }
                            `,
                            variables: {
                                id,
                            },
                        }),
                    },
                )
                    .then(r => r.json())
                    .then(response => {
                        if (!ignore) {
                            console.log('onGetUser: ', response);

                            const responseUser: IUser = response.data.user;
                            if (!responseUser) {
                                setUserFromServer(null);
                                setLoading(false);
                                return;
                            }

                            if (responseUser.id === userFromStore?.id) {
                                dispatch(setUser({...responseUser}));
                            }

                            setUserFromServer(responseUser);
                            setTimeout(() => {
                                setLoading(false);
                            }, 300);
                        }
                    })
                    .catch(e => {
                        setLoading(false);
                        throw e;
                    });
            } catch (e: any) {
                // ToastAndroid.showWithGravity(
                //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
                //     ToastAndroid.LONG,
                //     ToastAndroid.TOP,
                // );
                console.log('UseUser error: ', e?.message);
            }
        };

        if (id) {
            onGetUser();
        }

        return () => {
            ignore = true;
        };
    }, []);

    return {
        isLoading,
        userFromServer,
    };
};

export default useUser;
