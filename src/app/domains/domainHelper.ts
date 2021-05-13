
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