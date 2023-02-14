import {sendMessage} from 'webext-bridge';

export const MSG_ID_FETCH_REQUEST = 'bgfetch-request';

export interface RequestInfo extends RequestInit {
    dataType?: 'json' | 'text' | 'formData';
}

export interface ResponseInfo {
    data: FormData | string | any;
    status: number;
    statusText: string;
    headers: any;
}

export async function bgfetch(url: string, info?: RequestInfo): Promise<ResponseInfo> {
    console.log(`sendMessage(${MSG_ID_FETCH_REQUEST}):`, url, info);
    const resp: ResponseInfo = await sendMessage(MSG_ID_FETCH_REQUEST, {url, info} as any, 'background') as any
    if (resp.status < 0) {
        throw(JSON.parse(resp.data.statusText));
    }
    return resp.data;
}
