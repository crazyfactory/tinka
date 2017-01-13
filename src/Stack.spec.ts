import {IMiddleware, Stack} from "./Stack";

describe("Stack", () => {
    it("is defined", () => {
        expect(Stack).toBeDefined();
    });
    describe("construct()", () => {
        it("has a default implementation", () => {
           expect((new Stack()) instanceof Stack).toBeTruthy();
        });

        it("defaultOptions accepts a function", () => {
            const stack = new Stack(() => {
                return "check";
            });
            expect(stack.defaultOptions).toBe("check");
        });

        it("defaultOptions accepts any value", () => {
            const stack = new Stack("alice");
            expect(stack.defaultOptions).toBe("alice");
        });
    });

    describe("process()", () => {
        it("is a function", () => {
            expect(typeof (new Stack()).process === "function").toBeTruthy();
        });

        it("will pipe registered Middlewares", () => {
            const stack = new Stack({value: 0});

            // final mock middleware goes first
            stack.addMiddleware({
                process: (options, next) => {
                    return options.value * 2;
                }
            } as IMiddleware<{value: number}, number>);

            // intermediate middleware goes next
            stack.addMiddleware({
                process: (options, next) => {
                    options.value += 5;
                    return next(options);
                }
            } as IMiddleware<{value: number}, number>);

            const retVal = stack.process({value: 1});
            expect(retVal).toBe(12);
        });

        it("will pipe registered Middlewares multiple times", () => {
            const stack = new Stack<{value: number}, number>({value: 0});

            // final mock middleware goes first
            stack.addMiddleware({
                process: (options, next) => {
                    return options.value * 2;
                }
            } as IMiddleware<{value: number}, number>);

            // intermediate middleware goes next
            stack.addMiddleware({
                process: (options, next) => {
                    options.value += 5;
                    return next(options);
                }
            } as IMiddleware<{value: number}, number>);

            // Initiate process() multiple times
            const list = [
                {value: 1, exp: 12},
                {value: 1, exp: 12},
                {value: 5, exp: 20}
            ];
            const successList = list.filter((obj) => {
                return obj.exp === stack.process({value: obj.value});
            });

            // Compare success amount vs. test amount
            expect(successList.length).toBe(list.length);
        });
    });

    describe("defaultOptions", () => {
        it("is undefined by default", () => {
            expect((new Stack()).defaultOptions).toBe(undefined);
        });
    });
});
