
export interface IFetchResponse {
    body: string;
    bodyUsed: boolean;
    headers: any;
    ok: boolean;
    status: number;
    statusText: string;
    type: string;
    url: string;
    json: () => Promise<any>;
    text: () => Promise<string>;
}

