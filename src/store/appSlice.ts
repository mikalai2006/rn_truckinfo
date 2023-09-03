import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
export interface ITokens {
    access_token: string | null;
    refresh_token: string | null;
}
export interface IUser {
    id: string;
    userId: string;
    name: string;
    login: string;
    lang: string;
    avatar: string;
    roles: ['admin', 'user'];
    online: boolean;
}
export interface IFeature {
    type: string;
    id: string;
    properties: Properties;
    geometry: Geometry;
}
export interface Properties {
    amenity?: string;
    [key: string]: any;
    id: string;
}
export interface Geometry {
    type: string;
    coordinates?: number[] | null;
}
export type TFeatureInput = {
    [Property in keyof IFeature]?: IFeature[Property];
};

export interface IPoint {
    lat: string;
    lon: string;
}

export interface AppState {
    dark: boolean;
    drawer: boolean;
    tokens: ITokens;
    langCode: string;
    user: IUser | null;
    feature: IFeature | null;
}

const initialState: AppState = {
    dark: false,
    drawer: false,
    tokens: {
        access_token: null,
        refresh_token: null,
    },
    langCode: 'en',
    user: null,
    feature: null,
    positions: [],
};

// Приведенная ниже функция называется thunk и позволяет нам выполнять асинхронную логику. Это
// можно отправить как обычное действие: `dispatch(incrementAsync(10))`. Этот
// вызовет преобразователь с функцией `dispatch` в качестве первого аргумента. Асинхронный
// затем код может быть выполнен и другие действия могут быть отправлены. Преобразователи
// обычно используется для выполнения асинхронных запросов.
export const incrementAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
});
export function fetchCount(amount = 1) {
    return new Promise<{data: number}>(resolve => setTimeout(() => resolve({data: amount}), 500));
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    // Поле `reducers` позволяет нам определять редьюсеры и генерировать связанные действия
    reducers: {
        // Используйте тип PayloadAction для объявления содержимого `action.payload`
        setTokenAccess: (state, action: PayloadAction<ITokens>) => {
            state.tokens = {...action.payload};
            console.log('setTokenAccess:::', state.tokens);
        },
        setUser: (state, action: PayloadAction<IUser>) => {
            console.log('setUser: ', JSON.stringify(action.payload));
            state.user = {...action.payload};
        },
        setFeature: (state, action: PayloadAction<IFeature> | PayloadAction<null>) => {
            console.log('setFeature: ', JSON.stringify(action?.payload));
            state.feature = action.payload ? {...action.payload} : action.payload;
        },
        setDark: (state, action: PayloadAction<boolean>) => {
            state.dark = action.payload;
        },
        setLangCode: (state, action: PayloadAction<string>) => {
            state.langCode = action.payload;
        },
        setDrawer: (state, action: PayloadAction<boolean>) => {
            console.log('Set drawer: ', action.payload);

            state.drawer = action.payload;
        },
        setPositions: (state, action: PayloadAction<any>) => {
            console.log('Set positions: ', action.payload);

            state.positions = [...state.positions];
            state.positions.push(action.payload);
        },
    },
    // Поле `extraReducers` позволяет срезу обрабатывать действия, определенные в другом месте,
    // включая действия, сгенерированные createAsyncThunk или другими слайсами.
    // extraReducers: builder => {
    //     // builder
    //     //   .addCase(incrementAsync.pending, state => {
    //     //     state.status = 'loading';
    //     //   })
    //     //   .addCase(incrementAsync.fulfilled, (state, action) => {
    //     //     state.status = 'idle';
    //     //     state.value += action.payload;
    //     //   })
    //     //   .addCase(incrementAsync.rejected, state => {
    //     //     state.status = 'failed';
    //     //   });
    // },
});

export const {setDark, setDrawer, setTokenAccess, setLangCode, setUser, setFeature, setPositions} = uiSlice.actions;
// Функция ниже называется селектором и позволяет нам выбрать значение из
// штат. Селекторы также могут быть определены встроенными, где они используются вместо
// в файле среза. Например: `useSelector((состояние: RootState) => состояние.счетчик.значение)`
export const isOpenDrawer = (state: RootState) => state.ui.drawer;
export const isDark = (state: RootState) => state.ui.dark;
export const tokens = (state: RootState) => state.ui.tokens;
export const langCode = (state: RootState) => state.ui.langCode;
export const user = (state: RootState) => state.ui.user;
export const feature = (state: RootState) => state.ui.feature;
export const positions = (state: RootState) => state.ui.positions;

export default uiSlice.reducer;
