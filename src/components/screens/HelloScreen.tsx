import React, {useEffect} from 'react';

// import {useAppSelector} from '~store/hooks';
// import {langCode, tokens} from '~store/appSlice';
import AppStack from '~components/navigations/AppStack';
import HelloStack from '~components/navigations/HelloStack';
import {activeLanguage, setAmenities, setLanguages} from '~store/appSlice';
import {useAppDispatch, useAppSelector} from '~store/hooks';
// import HelloStack from '~components/navigations/HelloStack';
// import AuthStack from '~components/navigations/AuthStack';
// import {NativeModules, Platform} from 'react-native';

const HelloScreen = () => {
    console.log('Render HelloScreen');
    const dispatch = useAppDispatch();
    const activeLanguageFromStore = useAppSelector(activeLanguage);

    // useEffect(() => {
    //     const onFindAmenities = async () => {
    //         try {
    //             await fetch(
    //                 'http://localhost:8000/api/v1/gql/query?' +
    //                     new URLSearchParams({
    //                         lang: activeLanguageFromStore?.code || 'en',
    //                     }),
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         Accept: 'application/json',
    //                         'Content-Type': 'application/json',
    //                         // Authorization: `Bearer ${tokenData.access_token}`,
    //                     },
    //                     body: JSON.stringify({
    //                         query: `
    //                             query findAmenities {
    //                                 amenities(limit:99) {
    //                                     data {
    //                                         id
    //                                         type
    //                                         key
    //                                         title
    //                                         description
    //                                         status
    //                                         props
    //                                         tags
    //                                     }
    //                                     total
    //                                     skip
    //                                     limit
    //                                 }
    //                             }
    //                             `,
    //                     }),
    //                 },
    //             )
    //                 .then(r => r.json())
    //                 .then(r => {
    //                     if (r.data?.amenities?.data?.length) {
    //                         dispatch(setAmenities(r.data.amenities.data));
    //                     }
    //                     // console.log('r.data.amenities.data=', r.data.amenities.data);
    //                 })
    //                 .catch(e => {
    //                     throw e;
    //                 });
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };
    //     onFindAmenities();
    // }, [activeLanguageFromStore?.code, dispatch]);

    // useEffect(() => {
    //     const onFindLanguages = async () => {
    //         try {
    //             await fetch(
    //                 'http://localhost:8000/api/v1/lang?' +
    //                     new URLSearchParams({
    //                         lang: activeLanguageFromStore?.code || 'en',
    //                     }),
    //                 {
    //                     method: 'GET',
    //                     headers: {
    //                         Accept: 'application/json',
    //                         'Content-Type': 'application/json',
    //                     },
    //                 },
    //             )
    //                 .then(r => r.json())
    //                 .then(r => {
    //                     if (r.data?.length) {
    //                         dispatch(setLanguages(r.data));
    //                     }
    //                     // console.log('r.data=', r.data);
    //                 })
    //                 .catch(e => {
    //                     throw e;
    //                 });
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     };
    //     onFindLanguages();
    // }, [activeLanguageFromStore?.code, dispatch]);
    // const token = useAppSelector(tokens);
    // const lang = useAppSelector(langCode);

    // const deviceLanguage =
    //     Platform.OS === 'ios'
    //         ? NativeModules.SettingsManager.settings.AppleLocale ||
    //           NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    //         : NativeModules.I18nManager.localeIdentifier;

    // if (lang === '') {
    // }

    return (
        <>
            <HelloStack />
            {/* token.access_token === '' ? <AuthStack /> : */}
        </>
    );
};

export default HelloScreen;
