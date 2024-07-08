import {GeolocationResponse} from '@react-native-community/geolocation';

export type LatLng = {
    lat: number;
    lng: number;
};
export type Point = {};
export type LatLngBounds = {};

export const OWN_POSTION_MARKER_ID = 'OWN_POSTION_MARKER_ID';

export enum WebViewOLEvents {
    MAP_COMPONENT_MOUNTED = 'MAP_COMPONENT_MOUNTED',
    MAP_READY = 'MAP_READY',
    DOCUMENT_EVENT_LISTENER_ADDED = 'DOCUMENT_EVENT_LISTENER_ADDED',
    WINDOW_EVENT_LISTENER_ADDED = 'WINDOW_EVENT_LISTENER_ADDED',
    UNABLE_TO_ADD_EVENT_LISTENER = 'UNABLE_TO_ADD_EVENT_LISTENER',
    DOCUMENT_EVENT_LISTENER_REMOVED = 'DOCUMENT_EVENT_LISTENER_REMOVED',
    WINDOW_EVENT_LISTENER_REMOVED = 'WINDOW_EVENT_LISTENER_REMOVED',
    ON_MOVE_END = 'onMoveEnd',
    ON_MOVE_START = 'onMoveStart',
    ON_MOVE = 'onMove',
    ON_RESIZE = 'onResize',
    ON_UNLOAD = 'onUnload',
    ON_VIEW_RESET = 'onViewReset',
    ON_ZOOM_END = 'onZoomEnd',
    ON_ZOOM_LEVELS_CHANGE = 'onZoomLevelsChange',
    ON_ZOOM_START = 'onZoomStart',
    ON_ZOOM = 'onZoom',
    ON_MAP_TOUCHED = 'onMapClicked',
    ON_MAP_MARKER_CLICKED = 'onMapMarkerClicked',
    ON_MAP_SHAPE_CLICKED = 'onMapShapeClicked',

    ZOOM = 'zoom',
    THEME = 'theme',
    CENTER = 'center',
    INIT = 'init',
    SHOW_CROSS = 'showCross',
    MARKERS = 'markers',
    CLEAR_ACTIVE_NODE = 'clearActiveNode',
    MY_POSITION = 'myPosition',
    MY_POSITION_TO_CENTER = 'myPositionToCenter',
    GYROSCOPE = 'gyroscope',
    SEND_AMENITY = 'sendAmenity',
    TYPE_NEW_NODE = 'typeNewNode',
    ENABLE_MAGNET = 'enableMagnet',
    ALLOW_DISTANCE = 'allowDistance',
    POINTS_ALLOW_AREA = 'pointsAllowArea',
}

export enum AnimationType {
    BOUNCE = 'bounce',
    FADE = 'fade',
    PULSE = 'pulse',
    JUMP = 'jump',
    SPIN = 'spin',
    WAGGLE = 'waggle',
}

export enum MapLayerType {
    IMAGE_LAYER = 'ImageOverlay',
    TILE_LAYER = 'TileLayer',
    VECTOR_LAYER = 'VectorLayer',
    VIDEO_LAYER = 'VideoOverlay',
    WMS_TILE_LAYER = 'WMSTileLayer',
}

export enum MapShapeType {
    CIRCLE = 'Circle',
    CIRCLE_MARKER = 'CircleMarker',
    POLYLINE = 'Polyline',
    POLYGON = 'Polygon',
    RECTANGLE = 'Rectangle',
}

export const INFINITE_ANIMATION_ITERATIONS: string = 'infinite';

export enum AnimationDirection {
    NORMAL = 'nomal',
    REVERSE = 'reverse',
    ALTERNATE = 'alternate',
    ALTERNATE_REVERSE = 'alternate-reverse',
}
export interface MapMarkerAnimation {
    type: AnimationType;
    duration?: number;
    delay?: number;
    direction?: AnimationDirection;
    iterationCount?: number | typeof INFINITE_ANIMATION_ITERATIONS;
}

export interface MapMarker {
    animation?: MapMarkerAnimation;
    position: LatLng;
    divIcon?: L.DivIcon;
    icon: any;
    iconAnchor?: Point;
    id?: string;
    size?: Point;
    title?: string;
}

export interface MapEventMessage {
    event?: any;
    msg?: string;
    error?: string;
    payload?: any;
}

export interface MapLayer {
    attribution?: string;
    baseLayer?: boolean;
    baseLayerIsChecked?: boolean;
    baseLayerName?: string;
    bounds?: LatLngBounds;
    id?: string;
    layerType?: MapLayerType;
    opacity?: number;
    pane?: string;
    subLayer?: string;
    url?: string;
    zIndex?: number;
}

export interface MapShape {
    title?: string;
    bounds?: LatLng[];
    center?: LatLng;
    color?: string;
    id?: string;
    positions?: LatLng[] | LatLng[][];
    radius?: number;
    shapeType: MapShapeType;
}

// export interface IMyPosition {
//     coords: {
//         accuracy: number;
//         altitude: number;
//         heading: number;
//         latitude: number;
//         longitude: number;
//         speed: number;
//     };
//     timestamp: number;
// }

export interface MapMessage {
    msg: WebViewOLEvents;
    mapLayers?: MapLayer[];
    mapMarkers?: MapMarker[];
    mapShapes?: MapShape[];
    mapCenterPosition?: LatLng;
    ownPositionMarker?: OwnPositionMarker;
    zoom?: number;
    maxZoom?: number;
    minZoom?: number;
    id?: string;
    theme?: string;
    bgColor?: string;
    activeNode?: any;
    showCross?: boolean;
    typeNewNode?: string;
    amenity?: any;
    myPosition?: GeolocationResponse | null;
    myPositionToCenter?: {lat: number; lng: number};
    gyroscope?: number;
    enableMagnet?: boolean;
    allowDistance?: number;
    pointsAllowArea?: [];
}

export interface IInitMessage {
    mapLayers?: MapLayer[];
    mapMarkers?: MapMarker[];
    mapShapes?: MapShape[];
    mapCenterPosition?: LatLng;
    ownPositionMarker?: OwnPositionMarker;
    zoom?: number;
    maxZoom?: number;
    minZoom?: number;
    id?: string;
    amenity?: any[];
    initMarkers?: any[];
}

export interface WebviewOLMessagePayload {
    bounds?: LatLngBounds;
    mapCenterPosition: LatLng;
    mapMarkerID?: string;
    touchLatLng?: LatLng;
    zoom?: number;
    maxZoom?: number;
    minZoom?: number;
}

export interface WebviewOLMessage {
    event?: any;
    msg?: string;
    error?: string;
    payload?: WebviewOLMessagePayload;
}

export interface OwnPositionMarker {
    animation: MapMarkerAnimation;
    id?: string;
    icon: string;
    position: LatLng;
    size: Point;
}
