import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {IMarkerConfig} from '~utils/markerdata';
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
    osmId: string;
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

export interface ITagData {
    id: string;
    nodeId: string;
    tagId: string;
    tagoptId: string;
    value: string;
    tag: ITag;
    updatedAt: string;
    createdAt: string;
}

export interface ITag {
    id: string;
    userId: string;
    key: string;
    title: string;
    type: string;
    description: string;
    props: {[key: string]: any};
    options: ITagopt[];
    multiopt: number;
    isFilter: boolean;
    // tagoptId: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IAddressProps {
    title: string;
    subtitle: string;
    name: string;
    lat: string;
    lon: string;
    class: string;
    addresstype: string;
}

export interface IAddress {
    _id: string;
    userId: string;
    osmId: string;
    dAddress: string;
    props: IAddressProps;
}

export interface IReviewsInfo {
    count: number;
    value: number;
    ratings: {
        _id: number;
        count: number;
    }[];
}

export interface IReview {
    _id: string;
    userId: string;
    osmId: string;
    rate: number;
    review: string;
    updatedAt: string;
    createdAt: string;
}

export interface ILike {
    _id: string;
    nodeId: string;
    userId: string;
    status: number;
    updatedAt: string;
    createdAt: string;
}

export interface ILikeNode {
    like: number;
    dlike: number;
    ilike: ILike;
}

// export interface IActiveNode {
//     _id: string;
//     osmId: string;
//     type: string;
//     lat: number;
//     lon: number;
//     props: any;
//     address: IAddress;
//     data: ITagData[];
//     reviews: IReview[];
//     reviewsInfo: IReviewsInfo;
//     like: ILikeNode;

//     updatedAt: string;
//     createdAt: string;
// }
export interface ITagopt {
    id: string;
    userId: string;
    tagId: string;
    // osmId: string;
    // name: string;
    value: any;
    title: string;
    description: string;
    locale: {[key: string]: string};
    props: {[key: string]: string};
    createdAt: Date;
    updatedAt: Date;
}

export type TTagoptInput = {
    [Property in keyof ITagopt]?: ITagopt[Property];
};

export interface INodedata {
    id: string;
    userId: string;
    nodeId: string;
    tagId: string;
    tagoptId: string;
    value: string;
    data: {
        value?: any;
    };
    user: IUser;
    title: string;
    description: string;
    options: ITagopt[];
    locale: {[key: string]: string};
    tag: ITag;
    tagopt: ITagopt;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

export type TNodedataInput = {
    [Property in keyof INodedata]?: INodedata[Property];
};

// export interface IReviewsInfo {
//     count: number;
//     value: number;
// }

export interface INode {
    id: string;
    userId: string;
    user: IUser;
    tags: string[];
    data: INodedata[];
    type: string;
    name: string;
    osmId: string;
    reviews: IReview[];
    reviewsInfo: IReviewsInfo;
    address: IAddress;
    props: any;
    lon: number;
    lat: number;
    createdAt: Date;
    updatedAt: Date;
}

export type TNodeInput = {
    [Property in keyof INode]?: INode[Property];
};

export interface IAmenity {
    id: string;
    userId: string;
    key: string;
    title: string;
    description: string;
    props: {[key: string]: string};
    locale: {[key: string]: string};
    type: string;
    status: number;
    tags: string[];

    createdAt: Date;
    updatedAt: Date;
}

export type TAmenityInput = {
    [Property in keyof IAmenity]?: IAmenity[Property];
};

export interface AppState {
    dark: boolean;
    drawer: boolean;
    tokens: ITokens;
    langCode: string;
    user: IUser | null;
    feature: IFeature | null;
    positions: any[];
    activeNode: INode | null;
    markerConfig: IMarkerConfig | null;
    amenities: {
        [key: string]: IAmenity;
    };
    tags: {
        [key: string]: ITag;
    };
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
    activeNode: null,
    markerConfig: null,
    amenities: {},
    tags: {},
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
        setFeature: (state, action: PayloadAction<IFeature | null>) => {
            console.log('setFeature: ', JSON.stringify(action?.payload?.osmId));
            state.feature = action.payload ? {...action.payload} : action.payload;
        },
        setDark: (state, action: PayloadAction<boolean>) => {
            console.log('setDark: ', action.payload);
            state.dark = action.payload;
        },
        setActiveNode: (state, action: PayloadAction<INode | null>) => {
            console.log('setActiveNode', action.payload?.osmId);

            state.activeNode = action.payload;
        },
        setActiveMarkerConfig: (state, action: PayloadAction<IMarkerConfig | null>) => {
            console.log('setActiveMarkerConfig', action.payload?.type);

            state.markerConfig = action.payload;
        },
        setLangCode: (state, action: PayloadAction<string>) => {
            console.log('setLangCode', action.payload);
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
        clearPositions: state => {
            console.log('clearPositions');
            state.positions = [];
        },
        setAmenities: (state, action: PayloadAction<IAmenity[]>) => {
            console.log('setAmenities');
            state.amenities = Object.fromEntries(action.payload.map(x => [x.type, x]));
        },
        setTags: (state, action: PayloadAction<ITag[]>) => {
            console.log('setTags');
            state.tags = Object.fromEntries(action.payload.map(x => [x.id, x]));
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

export const {
    setDark,
    setDrawer,
    setTokenAccess,
    setActiveNode,
    setActiveMarkerConfig,
    setLangCode,
    setUser,
    setFeature,
    setPositions,
    clearPositions,
    setAmenities,
    setTags,
} = uiSlice.actions;
// Функция ниже называется селектором и позволяет нам выбрать значение из
// штат. Селекторы также могут быть определены встроенными, где они используются вместо
// в файле среза. Например: `useSelector((состояние: RootState) => состояние.счетчик.значение)`
export const isOpenDrawer = (state: RootState) => state.ui.drawer;
export const isDark = (state: RootState) => state.ui.dark;
export const tokens = (state: RootState) => state.ui.tokens;
export const langCode = (state: RootState) => state.ui.langCode;
export const user = (state: RootState) => state.ui.user;
export const feature = (state: RootState) => state.ui.feature;
export const activeNode = (state: RootState) => state.ui.activeNode;
export const positions = (state: RootState) => state.ui.positions;
export const markerConfig = (state: RootState) => state.ui.markerConfig;
export const amenities = (state: RootState) => state.ui.amenities;
export const tags = (state: RootState) => state.ui.tags;

export default uiSlice.reducer;
