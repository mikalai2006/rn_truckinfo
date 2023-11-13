import {View, ActivityIndicator} from 'react-native';
import React, {useCallback, useImperativeHandle, useRef} from 'react';
import WebView from 'react-native-webview';
import {useColorScheme} from 'nativewind';
import useOnMessage from '~hooks/useOnMessage';
import WidgetHeaderApp from './WidgetHeaderApp';
// import {useAppDispatch, useAppSelector} from '~store/hooks';
// import {activeNode, feature, setActiveNode, setFeature} from '~store/appSlice';
// // import PointStack from '~components/navigations/PointStack';
// import WidgetFeature from './WidgetFeature';
// // import colors from '~utils/colors';
// import WidgetBottomSheet, {BottomSheetRefProps} from './WidgetBottomSheet';
// import WidgetAddReview from './WidgetAddReview';
// import WidgetNodeTags from './WidgetNodeTags';
// import WidgetListReview from './WidgetListReview';
// import {ScrollView} from 'react-native-gesture-handler';

type MapBottomSheetProps = {
    children?: React.ReactNode;
    onClose?: () => void;
};
export type MapBottomSheetRefProps = {
    onCloseBottomSheet: () => void;
};

const WidgetMapFromSite = React.forwardRef<MapBottomSheetRefProps, MapBottomSheetProps>(({children, onClose}, ref) => {
    // const [result, setResult] = useState<string | null>(null);
    // const dispatch = useAppDispatch();
    console.log('WidgetMapFromSite');
    const {onMessage} = useOnMessage();

    let webviewRef = useRef<WebView>();

    const {colorScheme} = useColorScheme();
    React.useEffect(() => {
        webviewRef.current?.injectJavaScript(
            `(function() {
        document.dispatchEvent(new MessageEvent('message',
          ${JSON.stringify({
              data: {
                  event: 'dark',
                  dark: colorScheme === 'dark',
              },
          })}));
      })();
      `,
        );
        return () => {};
    }, [colorScheme]);

    const onCloseBottomSheet = useCallback(() => {
        webviewRef.current?.injectJavaScript(
            `(function() {
        document.dispatchEvent(new MessageEvent('message',
          ${JSON.stringify({
              data: {
                  event: 'closenode',
                  status: false,
              },
          })}));
      })();
      `,
        );
    }, []);

    useImperativeHandle(ref, () => ({onCloseBottomSheet}), [onCloseBottomSheet]);

    // // callbacks
    // const handleSheetChanges = useCallback((index: number) => {
    //     console.log('handleSheetChanges', index);
    // }, []);
    // const [index, setIndex] = useState(0);
    // const handleSheetChanges = useCallback((index: number) => {
    //     // console.log('handleSheetChanges', index);
    //     setIndex(index);
    // }, []);

    // const featureData = useAppSelector(feature);
    // const activeNodeData = useAppSelector(activeNode);
    // const ref = useRef<BottomSheetRefProps>(null);
    // const onPress = useCallback(() => {
    //     const isActive = ref?.current?.isActive();
    //     if (isActive) {
    //         ref?.current?.scrollTo(0);
    //     } else {
    //         ref?.current?.scrollTo(-200);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (featureData?.osmId) {
    //         console.log('Change feature', featureData?.osmId);
    //         // navigation.navigate('PointStack');
    //         // bottomSheetModalRef.current?.present();
    //         onPress();
    //     }
    // }, [featureData, onPress]);

    // const closeSheet = () => {
    //     webviewRef.current?.injectJavaScript(
    //         `(function() {
    //     document.dispatchEvent(new MessageEvent('message',
    //       ${JSON.stringify({
    //           data: {
    //               event: 'closenode',
    //               status: false,
    //           },
    //       })}));
    //   })();
    //   `,
    //     );
    //     dispatch(setActiveNode(null));
    //     dispatch(setFeature(null));
    // };

    return (
        <View tw="flex-1 relative">
            <View tw="absolute top-8 left-0 z-10 bg-transparent">
                <WidgetHeaderApp />
            </View>
            <WebView
                ref={webviewRef}
                sharedCookiesEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccessFromFileURLs={true}
                originWhitelist={['*']}
                onLoadProgress={() => <ActivityIndicator size={50} />}
                setDomStorageEnabled={true}
                source={{
                    uri: 'http://localhost:3000/ru/mapmobile',
                    headers: {
                        Cookie: 'dark=${true}',
                    },
                }}
                onMessage={event => {
                    onMessage(event);
                }}
                tw="flex-1"
            />
            <View tw="absolute right-0 top-0 p-2"></View>
        </View>
    );
});

export default WidgetMapFromSite;
