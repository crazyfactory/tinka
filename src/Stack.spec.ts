import {IRequest, IRequestHeaders} from "./Client";
import {IMiddleware, Stack} from "./Stack";

it("Stack should be defined", () => {
    expect(Stack).toBeDefined();
});
describe("Stack", () => {
        it("accepts function which returns defaultOptions", () => {
            const def = () => {
                const headers: IRequestHeaders = {
                    "Accept": "",
                    "Authorization": "",
                    "Content-Type": "application/json",
                    "Accept-Language": "en"
                };
                return {
                    baseUrl: "http://api.example.com/example",
                    body: JSON.stringify({user: 1}),
                    method: "POST",
                    queryParameters: {user: "1", id: "2"},
                    url: "/products",
                    headers
                } as IRequest;
            };
            const stack = new Stack(def);
            expect(stack.defaultOptions.baseUrl).toBe("http://api.example.com/example");
            expect(stack.defaultOptions.method).toBe("POST");
            expect(stack.defaultOptions.url).toBe("/products");
        });
        it("accepts defaultOptions as parameter", () => {
            const headers: IRequestHeaders = {
                "Accept": "",
                "Authorization": "",
                "Content-Type": "application/json",
                "Accept-Language": "en"
            };
            const defaultOption: IRequest = {
                baseUrl: "api.example.com/example",
                body: JSON.stringify({user: 1}),
                method: "POST",
                queryParameters: {user: "1", id: "2"},
                url: "/products",
                headers
            };

            const stack = new Stack(defaultOption);
            expect(stack.defaultOptions).toBeDefined();
            expect(stack.defaultOptions.baseUrl).toBe("api.example.com/example");
            expect(stack.defaultOptions.method).toBe("POST");
            expect(stack.defaultOptions.url).toBe("/products");
        });
        describe("process()", () => {
            it("should be able to process()", () => {
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

                const retVal = stack.process({value: 1});
                expect(retVal).toBe(12);
            });
    });
});
