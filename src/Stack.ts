/**
 * @module tinka
 */

export interface IMiddleware<IN, OUT> {
    process(options: IN, next?: (nextOptions: IN) => OUT): OUT;
}

export class Stack<IN, OUT> {
    protected middlewares: IMiddleware<IN, OUT>[] = [];

    public addMiddleware(middleware: IMiddleware<IN, OUT>): void {
        this.middlewares.push(middleware);
    }

    public process(options: IN): OUT {

        const stack = this.middlewares.slice(0);

        const next = (nestedOptions: IN): OUT => {
            const nextMW: IMiddleware<IN, OUT> = stack.pop() as IMiddleware<IN, OUT>;
            return nextMW && nextMW.process(nestedOptions, next);
        };

        return next(options);
    }
}
