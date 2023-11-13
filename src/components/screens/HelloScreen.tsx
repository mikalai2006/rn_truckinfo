import React from 'react';

// import {useAppSelector} from '~store/hooks';
// import {langCode, tokens} from '~store/appSlice';
import AppStack from '~components/navigations/AppStack';
import {setAmenities} from '~store/appSlice';
import {useAppDispatch} from '~store/hooks';
// import HelloStack from '~components/navigations/HelloStack';
// import AuthStack from '~components/navigations/AuthStack';
// import {NativeModules, Platform} from 'react-native';

const HelloScreen = () => {
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        const onFindAmenities = async () => {
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
            } catch (e) {
                console.log(e);
            }
        };
        onFindAmenities();
    }, [dispatch]);
    // const token = useAppSelector(tokens);
    // const lang = useAppSelector(langCode);

    // const deviceLanguage =
    //     Platform.OS === 'ios'
    //         ? NativeModules.SettingsManager.settings.AppleLocale ||
    //           NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    //         : NativeModules.I18nManager.localeIdentifier;

    // if (lang === '') {
    // }

    return <AppStack />; // token.access_token === '' ? <AuthStack /> :
};

export default HelloScreen;
