// import React, {useState} from 'react';

// import UIButton from '~components/ui/UIButton';

// type Props = {
//     callback?: () => void;
//     text?: string;
//     textLoad?: string;
// };

// export const WidgetSyncSaver = (props: Props) => {
//     const {callback, text} = props;
//     console.log('Render WidgetSyncSaver');

//     const [loading, setLoading] = useState(false);

//     const onPress = async () => {
//         setLoading(true);
//         if (callback) {
//             await callback();
//         }
//         setTimeout(() => {
//             setLoading(false);
//         }, 2000);
//     };

//     return (
//         <>
//             <UIButton type="primary" loading={loading} text={text} disabled={loading} onPress={onPress} />
//         </>
//     );
// };
