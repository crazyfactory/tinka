import {FetchClient} from "./FetchClient";
import {FetchClientResponse} from "./FetchClientResponse";
import {IFetchClientRequestOptions} from "./data/IFetchClientRequestOptions";
import {IServiceClientRequestOptions} from "./data/IServiceClientRequestOptions";

export class ServiceClient extends FetchClient {

    public static get allowedMethods(): string[] {
        return ["GET", "HEAD", "DELETE", "POST", "PATCH", "PUT"];
    }

    constructor(baseUrl: string = undefined) {
        super();

        this.configure((config) => {
            if (baseUrl) {
                config.withBaseUrl(baseUrl);
            }
        });
    }

    public request(method: string, url: string, data: any, files: any[], options: IServiceClientRequestOptions) {

        if (typeof method !== "string") {
            throw new Error("method must be a string");
        }

        if (ServiceClient.allowedMethods.indexOf(method) < 0) {
            throw new Error("method can be one of GET, HEAD, DELETE, PATCH, POST, PUT");
        }

        if (typeof url !== "string") {
            throw new Error("url must be a string");
        }

        if (typeof files !== "object" && files !== undefined) {
            throw new Error("files must be an object or undefined");
        }

        if (typeof options !== "object" && options !== undefined) {
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

        const requestOptions: IFetchClientRequestOptions = options || {};

        requestOptions.method = method;
        requestOptions.url = url;
        requestOptions.data = data;
        requestOptions.files = files;

        return this.fetch(url, requestOptions);
    }

    public get<T>(url: string, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("GET", url, undefined, undefined, options);
    }

    public head<T>(url: string, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("HEAD", url, undefined, undefined, options);
    }

    //noinspection ReservedWordAsName
    public delete<T>(url: string, data?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("DELETE", url, data, undefined, options);
    };

    public patch<T>(url: string, data?: any, files?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("PATCH", url, data, files, options);
    };

    public post<T>(url: string, data?: any, files?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("POST", url, data, files, options);
    };

    public put<T>(url: string, data?: any, files?: any, options?: IServiceClientRequestOptions): Promise<FetchClientResponse<T>> {
        return this.request("PUT", url, data, files, options);
    };

}
