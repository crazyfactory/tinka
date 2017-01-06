import {IRequest, IRequestHeaders, IResponse} from "../Client";
import {Fetch} from "./Fetch";
//noinspection TsLint
declare const fetch: any;

describe("Fetch", () => {
    describe("process()", () => {
        it("is defined", () => {
            const obj = new Fetch();
            expect(obj.process).toBeDefined();
        });

        it("throws on non-object options", () => {
            const obj = new Fetch();
            expect(() => obj.process(false as any, null as any)).toThrow();
        });

        it("throws on null options", () => {
            const obj = new Fetch();
            expect(() => obj.process(null as any, null as any)).toThrow();
        });

        it("returns a promise", () => {
            const headers: IRequestHeaders = {
                "Accept": "",
                "Authorization": "",
                "Content-Type": "application/json",
                "Accept-Language": "en"
            };
            const request: IRequest = {
                baseUrl: "http://api.example.com/v1",
                method: "GET",
                queryParameters: undefined,
                url: "/products",
                headers
            };

            const obj = new Fetch();
            const next  = (nextOptions: IRequest): Promise<IResponse<any>> => {
                return fetch(nextOptions.url);
            };
            obj.process(request, next).then((res) => {
                expect(res).toBeDefined();
            });

        });

        describe("Should honour queryString properly,", () => {
            it("should use queryString when queryString is defined", () => {
                const headers: IRequestHeaders = {
                    "Accept": "",
                    "Authorization": "",
                    "Content-Type": "application/json",
                    "Accept-Language": "en"
                };
                const request: IRequest = {
                    baseUrl: "http://api.example.com/v1",
                    method: "GET",
                    queryParameters: {user: "1", id: "2"},
                    url: "/products",
                    headers
                };
                const obj = new Fetch();
                const next  = (nextOptions: IRequest): Promise<IResponse<any>> => {
                    return fetch(nextOptions.url);
                };
                obj.process(request, next).then((res) => {
                    expect(res).toBeDefined();
                });
            });
            it("should use & when url already has a ? sign", () => {
                const headers: IRequestHeaders = {
                    "Accept": "",
                    "Authorization": "",
                    "Content-Type": "application/json",
                    "Accept-Language": "en"
                };
                const request: IRequest = {
                    baseUrl: "http://api.example.com/v1?user=1",
                    method: "GET",
                    queryParameters: {user: "1", id: "2"},
                    url: "/products",
                    headers
                };
                const obj = new Fetch();
                const next  = (nextOptions: IRequest): Promise<IResponse<any>> => {
                    return fetch(nextOptions.url);
                };
                obj.process(request, next).then((res) => {
                    expect(res).toBeDefined();
                });
            });
        });
    });
});
