

export interface IRoleList {
    roleName: string;
    roleId: string | number;
}

export interface IDataList {
    basedOnRole: string | number;
    bron: string | null;
    createdDate: string;
    lastUpdated: string;
    localMessage?: string | null;
    roleId: string | number;
    roleIdName: string;
    roleName: string;
    status: string;
    typeOfRecord: string;
    is_operational?: string | number;
}

export interface IUserRoleResponse {
    data: IDataList[]
    message: string;
    status: string;
    statusCode: number
}