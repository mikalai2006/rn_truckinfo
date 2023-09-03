import {setLangCode} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '~store/hooks';

export default function useLanguage() {
    const {t, i18n} = useTranslation();
    // const activeLang = useAppSelector(langCode);
    const dispatch = useAppDispatch();
    // const navigation = useNavigation();

    const chooseLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        dispatch(setLangCode(lang));
        // navigation.navigate('');
    };
    return {
        chooseLanguage,
    };
}
