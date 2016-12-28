/**
 * @module tinka
 */

export interface IMiddleware<IN, OUT> {
    process(options: IN, next: (nextOptions: IN) => OUT): OUT;
}

export class Stack<IN, OUT> {

    protected defaultOptionsFn: () => IN;

    public get defaultOptions(): IN {
        return this.defaultOptionsFn();
    }

    protected middlewares: IMiddleware<IN, OUT>[] = [];

    constructor(defaultOptions?: IN | (() => IN)) {
        this.defaultOptionsFn = typeof defaultOptions === "function"
            ? defaultOptions
            : () => defaultOptions;
    }

    public addMiddleware(middleware: IMiddleware<IN, OUT>): void {
        this.middlewares.push(middleware);
    }

    public process(options?: IN): OUT {

        const mergedOptions: IN = Object.assign(
            {},
            this.defaultOptions,
            options);

        const stack = this.middlewares.splice(0);

        const next = (nestedOptions: IN): OUT => {
            const nextMW: IMiddleware<IN, OUT> = stack.pop();
            return nextMW && nextMW.process(nestedOptions, next);
        };

        return next(mergedOptions);
    }
}
