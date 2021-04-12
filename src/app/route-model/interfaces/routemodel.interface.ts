export interface Routemodel {
}

export interface IPositionType {
    label: string;
    value: string
}

export enum EPositionTypeLabel {
    b = 'BorderLinePoint',
    c = 'Circular',
    l = 'PassageLine',
    p = 'ClosedPolygon'
}

export enum EPositionTypeValue {
    b,
    c,
    l,
    p
}

export interface IGeoElementItem {
    geoPointId: string;
    geoPointName: string;
    atSea: string;
    bron: string;
    cbsEri: string;
    cbspTA: string;
    displayVoyage: string;
    exitPoint: string;
    firstBlock: string;
    firstBlockSeq: string | number;
    geoPointType: string;
    isAnchoringPoint: string;
    isBorderPoint: string;
    isEtaPoint: null | string;
    isLock: string;
    isLockComplex: string;
    isPassageListPoint: string;
    isPassagePoint: null | string;
    isPort: string;
    latitude1: number;
    latitude2: number
    localMessage: string;
    longitude1: number;
    longitude2: number;
    partOfLocakComplex: string;
    partOfLockComplex: string;
    passageListOrder: number;
    positionType: string;
    radius: number;
    secondBlock: string;
    secondBlockSeq: number;
    statusCode: string;
    statusTime: string;
    subArea: string;
    viaPoint: null
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    createdDate: string;
    lastUpdated: string;
}

export interface IPilotTrajectItem {
    bron: null | string;
    cbsLocationEnd: null | string;
    cbsLocationStart: null | string;
    createdDate: null | string;
    lastUpdated: null | string;
    statusCode: string;
    statusTime: null | string;
    trajectId: string;
    trajectName: string;
}

export interface IHydroMeteoLocation {
    bron: string;
    cbsLocationCode: string;
    centre: string;
    hydroMeteoLocationId: string;
    hydroMeteoLocationName: string;
    isManual: string;
    statusCode: string;
    createdDate: string;
    lastUpdated: string;

}

export interface IHydroMeteoList {
    bron: string;
    createdDate: string;
    hydroMeteoLocationId: string;
    hydrometeoCenter: string;
    hydrometeoId: number;
    lastUpdated: string;
    locationName: string;
    sensorText: null | string;
    ssbSensortext: string;
    ssbVisibility: string;
    ssbWaterLevel: string;
    ssbWeatherPrediction: string;
    ssbWind: null | string;
    statusCode: string;
    type: string;
}

// export interface IHydroMeteoLocationList {
//     bron: string;
//     cbsLocationCode: string;
//     centre: string;
//     createdDate: string;
//     hydroMeteoLocationId: string;
//     hydroMeteoLocationName: string;
//     isManual: string;
//     lastUpdated: string;
//     statusCode: string;
// }
