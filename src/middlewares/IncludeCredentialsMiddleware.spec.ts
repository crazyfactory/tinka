import {IFetchRequest, IFetchResponse} from "./FetchMiddleware";
import {IncludeCredentialsMiddleware} from "./IncludeCredentialsMiddleware";

describe("IncludeCredentialsMiddleware", () => {
    it("should be defined", () => {
        expect(IncludeCredentialsMiddleware).toBeDefined();
    });
    describe("process", () => {
        it("should be defined", () => {
            const middleware = new IncludeCredentialsMiddleware();
            expect(middleware.process).toBeDefined();
        });
        it("should set request.credentials to include", () => {
            const middleware = new IncludeCredentialsMiddleware();
            const spy = jest.fn((options: IFetchRequest) => {
                expect(options.credentials).toBe("include");
                return null as any as Promise<IFetchResponse<any>>;
            });
            middleware.process({}, spy);
        });
        it("should be able to set value of credentials via constructor", () => {
            const middleware = new IncludeCredentialsMiddleware("omit");
            const spy = jest.fn((options: IFetchRequest) => {
                expect(options.credentials).toBe("omit");
                return null as any as Promise<IFetchResponse<any>>;
            });
            middleware.process({}, spy);
        });
    });
});
