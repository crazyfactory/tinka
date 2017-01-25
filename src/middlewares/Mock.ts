import {IMiddleware} from "../Stack";
import {FetchResponse} from "./Fetch";

export interface IMockHandler<IN, OUT> {
    match: (options: IN) => boolean|undefined;
    resultFactory: (options: IN) => OUT;
    delay?: number;
}

declare const Response: FetchResponse<any>;

export class Mock<IN, OUT> implements IMiddleware<IN, OUT> {

    public constructor(protected handlers: IMockHandler<IN, OUT>[] = []) { }

    public static jsonResponse<T>(data: T, response?: FetchResponse<any>): FetchResponse<T> {

        // Encode data
        const stream: string|undefined = (data === undefined || data === null)
            ? undefined
            : JSON.stringify(data);

        // Create Data
        const init = Object.assign(
            {},
            {
                status: data === undefined || data === null
                    ? 204
                    : 200,
                headers: data === undefined || data === null
                    ? undefined
                    : {
                        "content-type": "application/json; charset=UTF8"
                    }
            },
            response
        );

        // Create and return response
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
        return new Response(stream, init);
    }

    public static resolvingPromise<T>(result: T, delay: number = 5): Promise<T> {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    resolve(result);
                },
                delay
            );
        });
    }

    public addHandler(handler: IMockHandler<IN, OUT>): void {
        this.handlers.push(handler);
    }

    public process(options: IN, next: (nextOptions: IN) => OUT): OUT {
        const handler = this.handlers.find((h) => h.match(options) === true);

        return handler
            ? handler.resultFactory(options)
            : next(options);
    }
}
