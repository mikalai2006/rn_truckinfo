import {Image} from 'react-native';
import React, {useMemo} from 'react';
import {useAppSelector} from '~store/hooks';
import {countries} from '~store/appSlice';

export interface ICountryProps {
    code?: string;
}

const RCountry = (props: ICountryProps) => {
    const countriesState = useAppSelector(countries);

    const country = useMemo(() => {
        return countriesState.find(x => x.code === props.code);
    }, [countriesState, props.code]);

    return (
        country && (
            <Image
                tw={'h-5 w-8'}
                source={{
                    // uri: `http://localhost:8000/images/${image.userId}/${image.service}/${image.serviceId}/320-${image.path}${image.ext}`,
                    uri: country?.flag,
                    //'https://lh5.googleusercontent.com/p/AF1QipNT1OecPHR30Vqqjo9_gB7zJc2AQkFAcfGRHOPP=w408-h306-k-no',
                }}
            />
        )
    );
};

export default RCountry;
