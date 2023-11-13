import {Text, View} from 'react-native';
import React from 'react';
import {useAppSelector} from '~store/hooks';
import {activeNode, tags} from '~store/appSlice';

// import {
//     iBarrier,
//     iVideo,
//     iShower,
//     iRestaurant,
//     iWc,
//     iFitness,
//     iLampPost,
//     iCart,
//     iTruckRepair,
//     iFuel,
//     iCarWash,
//     iATM,
//     iInternet,
//     iHotel,
//     iGuard,
//     iWater,
//     iKitchen,
//     iADR,
//     iWashingMachine,
//     iCurrencyExchange,
//     iChargingStation,
//     iAutohof,
//     iMedicalCare,
// } from '../../utils/icons';
import SIcon from '~components/ui/SIcon';
import {ScrollView} from 'react-native-gesture-handler';
// const keysAmenity = {
//     floodlight: iLampPost,
//     toilet: iWc,
//     shop: iCart,
//     restaurant: iRestaurant,
//     shower: iShower,
//     monitoring: iVideo,
//     water: iWater,
//     carRepair: iTruckRepair,
//     fuel: iFuel,
//     carWash: iCarWash,
//     atm: iATM,
//     wifi: iInternet,
//     hotel: iHotel,
//     fence: iBarrier,
//     guard: iGuard,
//     kitchen: iKitchen,
//     dangerousGoods: iADR,
//     laundry: iWashingMachine,
//     currencyExchange: iCurrencyExchange,
//     electricity: iChargingStation,
//     autohof: iAutohof,
//     // palletsTradings:
//     gym: iFitness,
//     medical: iMedicalCare,
// };

const WidgetNodeTagsLine = () => {
    const activeMarkerData = useAppSelector(activeNode);
    const tagsStore = useAppSelector(tags);

    return (
        <>
            <View tw="px-2 flex flex-row flex-wrap">
                {activeMarkerData?.data?.map((el, i) => (
                    <View key={i.toString()} tw="basis-[33.3%]">
                        <View tw="relative m-1 p-0 pb-2 pt-4 bg-black/5 dark:bg-white/5 rounded-lg flex-1 flex-col items-center justify-end">
                            {el.tag.props?.icon && (
                                <SIcon path={el.tag.props.icon} tw="text-s-800 dark:text-s-300" size={40} />
                            )}
                            <View
                                tw={
                                    (el.value === 'no' ? 'bg-red-500 ' : 'bg-green-500 ') +
                                    'p-1 absolute right-2 top-2 rounded-md'
                                }>
                                <Text tw={(el.value === 'no' ? '' : '') + 'text-xs text-white dark:text-black'}>
                                    {el.tagopt?.title || el.value}
                                </Text>
                            </View>
                            <View key={i}>
                                {/* <Text tw="text-s-800 dark:text-s-300">{el.tag.key}</Text> */}
                                <Text
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    tw="text-center text-xs text-s-800 dark:text-s-300">
                                    {el.tag.title}
                                </Text>
                                {/* <Text tw="text-s-800 dark:text-s-300">{el.value}</Text> */}
                                {/* {el.options?.length
                                ? el.options.map(x => (
                                      <>
                                          <Text>{x.value}</Text>
                                      </>
                                  ))
                                : ''} */}
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </>
    );
};

export default WidgetNodeTagsLine;
