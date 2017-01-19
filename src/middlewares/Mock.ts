import {IRequest, IResponse} from "../Client";
import {IMiddleware} from "../Stack";

export interface IMockHandler<IN, OUT> {
    match: (options: IN) => boolean|undefined;
    factory: (options: IN) => OUT;
    delay?: number;
}

export class Mock<IN, OUT> implements IMiddleware<IN, Promise<OUT>> {

    public defaultDelay: number = 5;

    public constructor(protected handlers: IMockHandler[] = []) {
        if (!(handlers instanceof Array)) {
            throw new TypeError("handlers must be an array.");
        }
    }

    public static jsonResponse<T>(data: T, response?: IResponse<any>): IResponse<T> {

        // Encode data
        const raw = JSON.stringify(data);

        // Create Stream
        const stream: ReadableStream = null;

        // Create Data
        const init = Object.assign(
            {},
            {
                status: data === undefined || data === null ? 204 : 200,
                headers: {
                    "content-type": "application/json; charset=UTF8"
                }
            },
            response
        );

        // Create and return response
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
        return new Response(stream, init);
    }

    public process(options: IRequest, next: (nextOptions: IRequest) => Promise<IResponse>): Promise<IResponse> {

        const handler = this.handlers.find((h) => h.match(options));

        if (!handler) {
            return next(options);
        }

        // Invoke function mock response factory
        const response = handler.factory(options);

        // Return Promises directly
        if (response instanceof Promise) {
            return response;
        }

        // Wrap result in promise and resolve after a short delay
        const promise = new Promise();

        const resolveFn = () => {
            promise.resolve(response);
        };

        const delay = handler.delay || handler.delay === 0
            ? handler.delay
            : this.defaultDelay;

        setTimeout(resolveFn, delay);

        return promise as Promise;
    }
}
