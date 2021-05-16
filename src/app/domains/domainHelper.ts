export interface ICentralData {
    bron: string | null;
    centre_Id: string;
    centre_name: string;
    createdOn: string;
    default_AREA: string;
    description: string;
    is_operational: number;
    lastupdatedOn: string;
    lattitude: string;
    longitude: string;
    status: string;
}

export interface IAreaData {
    area_Id: string;
    area_name: string;
    centreID: string;
    createdOn: string;
    isDefaultAreaForCentre: string;
    is_operational: 0,
    lastupdatedOn: string;
    status: string;
    bron: string | null;

}

export interface ISuperBlockData {
    superblock_Id: string;
    superblock_name: string;
    createdOn: string;
    description: string;
    is_operational: 0,
    lastupdatedOn: string;
    status: string;
    bron: string | null;

}
export interface IStatus {
    label: string;
    value: string;
}

export const statusList = [{
    label: 'Active',
    value: 'A'
}, {
    label: 'Inactive',
    value: 'I'
}]

export enum EStatus {
    statusList = <any>[{
        label: 'Active',
        value: 'A'
    }, {
        label: 'InActive',
        value: 'I'
    }]
}