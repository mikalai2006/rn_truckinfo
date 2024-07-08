import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
// import {IMarkerConfig} from '~utils/markerdata';
export interface ILang {
    id: string;
    locale: string;
    code: string;
    name: string;
    localization: {
        [key: string]: any;
    };
    flag: string;
    publish: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: string;
}

export interface ICurrency {
    id: string;
    status: boolean;
    title: string;
    code: string;
    symbolLeft: string;
    symbolRight: string;
    decimalPlaces: number;
    value: number;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface ITokens {
    access_token: string | null;
    refresh_token: string | null;
    expires_in: number;
}
export type TTokenInput = {
    [Property in keyof ITokens]?: ITokens[Property];
};

export interface IUserStat {
    node: number;
    nodeLike: number;
    nodeDLike: number;
    nodeAuthorLike: number;
    nodeAuthorDLike: number;
    nodedata: number;
    nodedataLike: number;
    nodedataDLike: number;
    nodedataAuthorLike: number;
    nodedataAuthorDLike: number;
    review: number;
}
export interface IUser {
    id: string;
    userId: string;
    name: string;
    login: string;
    lang: string;
    avatar: string;
    roles: ['admin', 'user'];
    md: number;
    images: IImage[];
    online: boolean;
    userStat: IUserStat;
    createdAt: string;
    updatedAt: string;
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
    updatedAt: string;
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
    id: string;
    userId: string;
    nodeId: string;
    rate: number;
    review: string;
    user: IUser;
    updatedAt: string;
    createdAt: string;
}
export type TReviewInput = {
    [Property in keyof IReview]?: IReview[Property];
};

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
    updatedAt: string;
}

export type TTagoptInput = {
    [Property in keyof ITagopt]?: ITagopt[Property];
};

export interface INodedataVote {
    id: string;
    userId: string;
    nodeId: string;
    nodedataId: string;
    nodedataUserId: string;
    value: number;
    user?: IUser;
    owner?: IUser;
    createdAt: string;
    updatedAt: string;
}
export type TNodedataVoteInput = {
    [Property in keyof INodedataVote]?: INodedataVote[Property];
};

export interface ICountryStat {
    idCountry: string;
    code: string;
    count: number;
    size: number;
    lastUpdatedAt: string;
    createdAt: string;
}

export interface ICountry {
    id: string;
    code: string;
    name: string;
    flag: string;
    image: string;
    publish: boolean;
    sortOrder: number;
    stat: ICountryStat;
    createdAt: string;
    updatedAt: string;
}

export type TCountryInput = {
    [Property in keyof ICountry]?: ICountry[Property];
};

export interface INodedata {
    id: string;
    userId: string;
    nodeId: string;
    tagId: string;
    tagoptId: string;
    value: string;
    like: number;
    dlike: number;
    votes: INodedataVote[];
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
    createdAt: string;
    updatedAt: string;
}

export type TNodedataInput = {
    [Property in keyof INodedata]?: INodedata[Property];
};

// export interface IReviewsInfo {
//     count: number;
//     value: number;
// }
export interface IImage {
    id: string;
    userId: string;
    service: string;
    serviceId: string;
    ext: string;
    path: string;
    dir: string;
    user: IUser;
    createdAt: string;
    updatedAt: string;
}

export interface INodeAudit {
    id: string;
    userId: string;
    user: IUser;
    message: string;
    status: number;
    props: any;
}
export interface INodeVote {
    id: string;
    userId: string;
    user: IUser;
    value: number;
    createdAt: string;
    updatedAt: string;
}

export interface IMagnitData {
    angle: number;
    status: boolean;
}

export interface INode {
    id: string;
    userId: string;
    user: IUser;
    tags: string[];
    data: INodedata[];
    type: string;
    name: string;
    osmId: string;
    ccode: string;
    reviews: IReview[];
    reviewsInfo: IReviewsInfo;
    address: IAddress;
    images: IImage[];
    audits: INodeAudit[];
    votes: INodeVote[];
    props: any;
    lon: number;
    lat: number;
    createdAt: Date;
    updatedAt: string;
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
    updatedAt: string;
}

export interface ILatLng {
    lat: number;
    lng: number;
}

export type TAmenityInput = {
    [Property in keyof IAmenity]?: IAmenity[Property];
};

export type IBounds = {
    _northEast: ILatLng;
    _southWest: ILatLng;
};

export type IFilter = {
    [key: string]: {
        tags: {
            [key: string]: any[];
        };
        show: boolean;
    };
};

export interface IAppState {}
export type TAppStateInput = {
    [Property in keyof IAppState]?: IAppState[Property];
};

export interface IHistoryQuery {
    query: string;
    createdAt: string;
}

export interface AppState {
    appState: IAppState | null;
    dark: boolean;
    drawer: boolean;
    tokens: ITokens | null;
    langCode: string;
    countryStat: ICountryStat[];
    activeLanguage: null | ILang;
    languages: ILang[];
    currencies: ICurrency[];
    countries: ICountry[];
    user: IUser | null;
    // feature: IFeature | null;
    positions: any[];
    activeNode: INode | null;
    maxDistance: number;
    // markerConfig: IMarkerConfig | null;
    bounds: IBounds;
    zoom: number;
    center: ILatLng;
    filter: IFilter;
    amenities: {
        [key: string]: IAmenity;
    };
    tags: {
        [key: string]: ITag;
    };
    nodes: INode[];
    historyQuery: IHistoryQuery[];
    magnitData: IMagnitData;
}

const initialState: AppState = {
    appState: null,
    countryStat: [],
    dark: false,
    drawer: false,
    tokens: null,
    langCode: '',
    activeLanguage: null,
    languages: [],
    countries: [],
    currencies: [],
    user: null,
    maxDistance: 1,
    bounds: {
        _northEast: {
            lat: 0,
            lng: 0,
        },
        _southWest: {
            lng: 0,
            lat: 0,
        },
    },
    magnitData: {
        status: false,
        angle: 0,
    },
    zoom: 8,
    center: {lat: 50, lng: 30},
    // feature: null,
    positions: [],
    activeNode: null,
    // markerConfig: null,
    filter: {},
    amenities: {},
    tags: {},
    nodes: [],
    historyQuery: [],
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
        setTokens: (state, action: PayloadAction<TTokenInput | null>) => {
            if (action.payload) {
                state.tokens = Object.assign({}, state.tokens, action.payload);
            } else {
                state.tokens = null;
            }
            // if (!state.tokens.access_token || state.tokens.access_token === '') {
            //     state.tokens.expires_in =
            // }
            // console.log('setTokens:::', state.tokens);
        },
        setCountryStat: (state, action: PayloadAction<ICountryStat[]>) => {
            state.countryStat = action.payload;
        },
        setMagnitData: (state, action: PayloadAction<IMagnitData>) => {
            state.magnitData = action.payload;
        },
        setHistoryQuery: (state, action: PayloadAction<IHistoryQuery[]>) => {
            state.historyQuery = action.payload?.length ? action.payload : [];
        },
        setAppState: (state, action: PayloadAction<TAppStateInput | null>) => {
            if (action.payload) {
                state.appState = Object.assign({}, state.appState, action.payload);
            } else {
                state.appState = null;
            }
            console.log('setAppState:::', state.appState, action.payload);
        },
        setUser: (state, action: PayloadAction<IUser | null>) => {
            // console.log('setUser: ', JSON.stringify(action.payload)); // JSON.stringify(action.payload)
            state.user = action.payload ? {...action.payload} : null;
            if (state.user?.md !== undefined) {
                state.maxDistance = state.user?.md || 1;
            }
        },
        // setFeature: (state, action: PayloadAction<IFeature | null>) => {
        //     console.log('setFeature: ', JSON.stringify(action?.payload?.osmId));
        //     state.feature = action.payload ? {...action.payload} : action.payload;
        // },
        setDark: (state, action: PayloadAction<boolean>) => {
            console.log('setDark: ', action.payload);
            state.dark = action.payload;
        },
        setBounds: (state, action: PayloadAction<IBounds>) => {
            state.bounds = action.payload;
        },
        setZoom: (state, action: PayloadAction<number>) => {
            state.zoom = action.payload;
        },
        setCenter: (state, action: PayloadAction<ILatLng>) => {
            state.center = action.payload;
        },
        setFilter: (state, action: PayloadAction<IFilter>) => {
            state.filter = action.payload;
        },
        setNodes: (state, action: PayloadAction<INode[]>) => {
            state.nodes = JSON.parse(JSON.stringify(action.payload));
        },
        setActiveNode: (state, action: PayloadAction<INode | null>) => {
            // console.log('setActiveNode', action.payload?.osmId);

            state.activeNode = action.payload;
        },
        // setActiveMarkerConfig: (state, action: PayloadAction<IMarkerConfig | null>) => {
        //     console.log('setActiveMarkerConfig', action.payload?.type);

        //     state.markerConfig = action.payload;
        // },
        setLangCode: (state, action: PayloadAction<string>) => {
            // console.log('setLangCode:::::', state.langCode, action.payload);
            let activeLanguage = state.languages.find(x => x.code === action.payload);
            if (!activeLanguage) {
                activeLanguage = state.languages.find(x => x.code === 'en');
                state.langCode = 'en';
            } else {
                state.langCode = action.payload;
            }

            if (activeLanguage) {
                state.activeLanguage = activeLanguage;
            }

            // console.log('activeLanguage', state.activeLanguage);
        },
        setLanguages: (state, action: PayloadAction<ILang[]>) => {
            // console.log('setLanguages:::::::::::::::::::::', action.payload); //action.payload
            state.languages = action.payload;
        },
        setCurrencies: (state, action: PayloadAction<ICurrency[]>) => {
            // console.log('setCurrencies:::::::::::::::::::::', action.payload);
            state.currencies = action.payload;
        },
        setCountries: (state, action: PayloadAction<ICountry[]>) => {
            // console.log('setCountries: ', action.payload.length); //action.payload
            state.countries = action.payload;
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
            // console.log('setAmenities');
            state.amenities = Object.fromEntries(action.payload.map(x => [x.type, x]));
        },
        setTags: (state, action: PayloadAction<ITag[]>) => {
            // console.log('setTags');
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
    setAppState,
    setCountryStat,
    setDark,
    setDrawer,
    setTokens,
    setActiveNode,
    setCurrencies,
    setLangCode,
    setUser,
    // setFeature,
    setPositions,
    clearPositions,
    setAmenities,
    setTags,
    setBounds,
    setZoom,
    setCenter,
    setLanguages,
    setCountries,
    setFilter,
    setNodes,
    setHistoryQuery,
    setMagnitData,
} = uiSlice.actions;
// Функция ниже называется селектором и позволяет нам выбрать значение из
// штат. Селекторы также могут быть определены встроенными, где они используются вместо
// в файле среза. Например: `useSelector((состояние: RootState) => состояние.счетчик.значение)`
export const appState = (state: RootState) => state.ui.appState;
export const isOpenDrawer = (state: RootState) => state.ui.drawer;
export const countryStat = (state: RootState) => state.ui.countryStat;
export const isDark = (state: RootState) => state.ui.dark;
export const maxDistance = (state: RootState) => state.ui.maxDistance;
export const tokens = (state: RootState) => state.ui.tokens;
export const langCode = (state: RootState) => state.ui.langCode;
export const activeLanguage = (state: RootState) => state.ui.activeLanguage;
export const languages = (state: RootState) => state.ui.languages;
export const user = (state: RootState) => state.ui.user;
export const magnitData = (state: RootState) => state.ui.magnitData;
// export const feature = (state: RootState) => state.ui.feature;
export const activeNode = (state: RootState) => state.ui.activeNode;
export const positions = (state: RootState) => state.ui.positions;
export const currencies = (state: RootState) => state.ui.currencies;
export const amenities = (state: RootState) => state.ui.amenities;
export const tags = (state: RootState) => state.ui.tags;
export const bounds = (state: RootState) => state.ui.bounds;
export const zoom = (state: RootState) => state.ui.zoom;
export const center = (state: RootState) => state.ui.center;
export const filter = (state: RootState) => state.ui.filter;
export const countries = (state: RootState) => state.ui.countries;
export const nodes = (state: RootState) => state.ui.nodes;
export const historyQuery = (state: RootState) => state.ui.historyQuery;

export default uiSlice.reducer;
