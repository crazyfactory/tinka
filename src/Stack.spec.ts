import {IRequest, IRequestHeaders} from "./Client";
import {IMiddleware, Stack} from "./Stack";
describe("Stack", () => {
    it("should be defined", () => {
        const stack = new Stack();
        expect(stack).toBeDefined();
    });
    it("Should accept function which returns defaultOptions", () => {
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
        expect(stack.defaultOptions).toBeDefined();
    });
    it("Should accept function which returns defaultOptions", () => {
        const headers: IRequestHeaders = {
            "Accept": "",
            "Authorization": "",
            "Content-Type": "application/json",
            "Accept-Language": "en"
        };
        const defaultOption: IRequest = {
            baseUrl: "http://api.example.com/example",
            body: JSON.stringify({user: 1}),
            method: "POST",
            queryParameters: {user: "1", id: "2"},
            url: "/products",
            headers
        };

        const stack = new Stack(defaultOption);
        expect(stack.defaultOptions).toBeDefined();
    });

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