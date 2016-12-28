/**
 * @module tinka
 */

export interface IMiddleware<IN, OUT> {
    process(options: IN, next: (nextOptions: IN) => OUT): OUT;
}

export class Stack<IN, OUT> {

    protected middlewares: any[] = [];

    constructor(protected defaultOptions?: IN | (() => IN)) {

    }

    public addMiddleware(middleware: IMiddleware<IN, OUT>) {
        this.middlewares.push(middleware);
    }

    public process(options?: IN): OUT {

        const defaultOptions = typeof this.defaultOptions === "function"
            ? this.defaultOptions()
           : this.defaultOptions;

        const mergedOptions: IN = Object.assign(
            {},
            defaultOptions,
            options);

        const stack = this.middlewares.splice(0);

        const next = (nestedOptions: IN): OUT => {
            const nextMW: IMiddleware<IN, OUT> = stack.pop();
            return nextMW && nextMW.process(nestedOptions, next);
        };

        return next(mergedOptions);
    }
}
