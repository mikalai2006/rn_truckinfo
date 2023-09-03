import {styled} from 'nativewind';
import React from 'react';
import {Text, View, useWindowDimensions} from 'react-native';

const StyledWrapper = styled(View);
const StyledBox = styled(View);

import {renderSVG} from '../utils/renderSVG';

export default function OnboardingItem({item}) {
  const {width} = useWindowDimensions();

  return (
    <StyledWrapper tw="items-stretch justify-center" style={[{width}]}>
      <StyledBox tw="flex-auto w-full items-center justify-center">
        {/* <Image
          source={item.image}
          tw="h-full"
          style={[{width, resizeMode: 'contain'}]}
        /> */}
        {/* <SvgXml
          width="100%"
          height="100%"
          tw="fill-white"
          xml={testSvg} //"https://www.svgrepo.com/show/483479/cute-pirate.svg"
        /> */}
        {renderSVG({item})}
      </StyledBox>
      <StyledBox tw={`justify-center items-stretch py-6 px-4`}>
        <Text tw="font-bold text-center text-4xl text-s-800 dark:text-s-100">
          {item.title}
        </Text>
        <Text tw="text-lg text-center text-s-600 dark:text-s-400">
          {item.description}
        </Text>
      </StyledBox>
    </StyledWrapper>
  );
}
