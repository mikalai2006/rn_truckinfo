import {setLangCode} from '~store/appSlice';
import {useTranslation} from 'react-i18next';
import {useAppDispatch} from '~store/hooks';
import dayjs from '~utils/dayjs';

export default function useLanguage() {
    const {i18n} = useTranslation();
    // const activeLang = useAppSelector(langCode);
    const dispatch = useAppDispatch();
    // const navigation = useNavigation();

    const onChangeLocale = (lang: string) => {
        i18n.changeLanguage(lang);
        dayjs.locale(lang);
    };

    const chooseLanguage = (lang: string) => {
        onChangeLocale(lang);
        dispatch(setLangCode(lang));
        // navigation.navigate('');
    };
    return {
        chooseLanguage,
        onChangeLocale,
    };
}
