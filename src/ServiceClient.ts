import {FetchClient} from "./FetchClient";
import {IServiceClientRequestOptions, IFetchClientRequestOptions} from "./main";
import {FetchClientResponse} from "./FetchClientResponse";


export class ServiceClient extends FetchClient {

    constructor(baseUrl: string = undefined) {
        super();

        this.configure((config) => {
            if (baseUrl) {
                config.withBaseUrl(baseUrl);
            }
        });
    }

    request(method: string, url: string, data: any, files: any[], options: IServiceClientRequestOptions) {

        if (typeof method !== "string") {
            throw new Error("method must be a string");
        }

        if (["GET", "HEAD", "DELETE", "POST", "PATCH", "PUT"].indexOf(method) < 0) {
            throw new Error("method can be one of GET, HEAD, DELETE, PATCH, POST, PUT");
        }

        if (typeof url !== "string") {
            throw new Error("url must be a string");
        }

        if (typeof files !== "object" && typeof files !== "undefined") {
            throw new Error("files must be an object or undefined");
        }

        if (typeof options !== "object" && typeof options !== "undefined") {
            throw new Error("options must be an object or undefined");
        }

        // Validate method/parameter combinations
        if (method === "GET" || method === "HEAD") {
            if (data !== undefined) {
                throw new Error(`data cannot be defined on a ${method} call`);
            }
            if (files !== undefined) {
                throw new Error(`files cannot be defined on a ${method} call`);
            }
        }
        if (method === "DELETE" && files !== undefined) {
            throw new Error("files cannot be defined on a DELETE call");
        }

        let requestOptions: IFetchClientRequestOptions = options || {};

        requestOptions.method = method;
        requestOptions.url = url;
        requestOptions.data = data;
        requestOptions.files = files;

        return this.fetch(url, requestOptions);
    }

    get<T>(url: string, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("GET", url, undefined, undefined, options);
    }

    head<T>(url: string, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("HEAD", url, undefined, undefined, options);
    }

    //noinspection ReservedWordAsName
    delete<T>(url: string, data?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("DELETE", url, data, undefined, options);
    };

    patch<T>(url: string, data?: any, files?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("PATCH", url, data, files, options);
    };

    post<T>(url: string, data?: any, files?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("POST", url, data, files, options);
    };

    put<T>(url: string, data?: any, files?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("PUT", url, data, files, options);
    };

}
