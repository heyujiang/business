import { defHttp } from '@/utils/http';
enum Api {
    report = '/api/report',
}
export interface ReportSearch {
    userId?: number;
    timeRange?: number[];
}

export interface basicProject {
    id:number,
    name:string,
    state:number,
    star:number,
    type:number,
    capacity:number,
    description:string,
    createdAt:string,
}

export interface reportNode {
    id:number,
    nodeId:number,
    name:string,
    state:number,
    children:reportNode[],
}

export interface reportRecord {
    id:number,
    nodeName:string,
    overview:string,
    state:number,
    createdAt:string,
}

export interface reportAttached {
    id:number,
    filename:string,
    url:string,
    mime:string,
    size:number,
    createdAt:string,
}

export interface ReportResponseData {
    basic:basicProject,
    recordTotal:number,
    attachedTotal:number,
    nodes:reportNode[],
    records:reportRecord[],
    attached:reportAttached[],
}

// 周报日报数据
export function Report(params : any) {
    return defHttp.get<ReportResponseData[]>({ url:Api.report , params:params}, { errorMessageMode: 'message' });
}