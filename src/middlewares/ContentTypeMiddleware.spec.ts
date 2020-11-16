import {ContentTypeMiddleware} from "./ContentTypeMiddleware";
import {IFetchRequest, IFetchResponse} from "./FetchMiddleware";

describe("ContentTypeMiddleware", () => {
    it("should add a content type application/json by default", () => {
        const spy = jest.fn((options: IFetchRequest) => {
            const contentType = options.headers && options.headers["content-type"];
            expect(contentType).toBe("application/json");
            return null as any as Promise<IFetchResponse<any>>;
        });
        const mw = new ContentTypeMiddleware();
        mw.process({}, spy);
    });
    it("should accept a content type in constructor if we want to change it", () => {
        const spy = jest.fn((options: IFetchRequest) => {
            const contentType = options.headers && options.headers["content-type"];
            expect(contentType).toBe("text/plain");
            return null as any as Promise<IFetchResponse<any>>;
        });
        const mw = new ContentTypeMiddleware("text/plain");
        mw.process({}, spy);
    });
});
