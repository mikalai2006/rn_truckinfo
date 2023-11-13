import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {activeNode} from '~store/appSlice';

import {
    iBarrier,
    iVideo,
    iShower,
    iRestaurant,
    iWc,
    iFitness,
    iLampPost,
    iCart,
    iTruckRepair,
    iFuel,
    iCarWash,
    iATM,
    iInternet,
    iHotel,
    iGuard,
    iWater,
    iKitchen,
    iADR,
    iWashingMachine,
    iCurrencyExchange,
    iChargingStation,
    iAutohof,
    iMedicalCare,
} from '../../utils/icons';
import SIcon from '~components/ui/SIcon';

const keysAmenity = {
    floodlight: iLampPost,
    toilet: iWc,
    shop: iCart,
    restaurant: iRestaurant,
    shower: iShower,
    monitoring: iVideo,
    water: iWater,
    carRepair: iTruckRepair,
    fuel: iFuel,
    carWash: iCarWash,
    atm: iATM,
    wifi: iInternet,
    hotel: iHotel,
    fence: iBarrier,
    guard: iGuard,
    kitchen: iKitchen,
    dangerousGoods: iADR,
    laundry: iWashingMachine,
    currencyExchange: iCurrencyExchange,
    electricity: iChargingStation,
    autohof: iAutohof,
    // palletsTradings:
    gym: iFitness,
    medical: iMedicalCare,
};

const WidgetNodeTags = () => {
    const activeMarkerData = useAppSelector(activeNode);

    return (
        <View tw="px-4 ">
            <Text tw="text-xl pb-2">Amenity</Text>
            <View tw="flex flex-row flex-wrap gap-2 items-center justify-center">
                {activeMarkerData?.tagsData.map((el, i) => (
                    <View key={i.toString()} tw="bg-s-600/10 p-2 rounded-lg">
                        <SIcon path={keysAmenity[el.key]} tw="text-s-800 dark:text-s-300" size={40} />
                        {/* <View key={i} tw="">
                        <Text tw="text-s-800 dark:text-s-300">{el.title}</Text>
                    </View> */}
                    </View>
                ))}
            </View>
        </View>
    );
};

export default WidgetNodeTags;
