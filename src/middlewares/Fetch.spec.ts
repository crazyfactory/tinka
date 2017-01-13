import {IRequest, IRequestHeaders} from "../Client";
import {Fetch} from "./Fetch";

it("Fetch should be defined", () => {
    expect(Fetch).toBeDefined();
});

describe("Fetch", () => {
    describe("process()", () => {
        it("is defined", () => {
            const obj = new Fetch();
            expect(obj.process).toBeDefined();
        });

        describe("throws", () => {
            it("on non-object options", () => {
                const obj = new Fetch();
                expect(() => obj.process(false as any, null as any)).toThrow();
            });
            it("on null options", () => {
                const obj = new Fetch();
                expect(() => obj.process(null as any, null as any)).toThrow();
            });
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
            expect(obj.process(request, undefined as any) instanceof Promise).toBeTruthy();

        });

        describe("honours queryString properly,", () => {
            it("use queryString when queryString is defined", () => {
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
                const res = (new Fetch()).process(request, undefined as any);
                expect(res instanceof Promise).toBeTruthy();
            });
            it("use & when url already has a ? sign", () => {
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
                expect(obj.process(request, undefined as any) instanceof Promise).toBeTruthy();
            });
        });
    });
});
