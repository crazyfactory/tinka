import {Client, IRequest} from "./Client";

describe("Client", () => {
    it("is defined", () => {
        expect(Client).toBeDefined();
    });
    describe("construct()", () => {
        it("has a default implementation", () => {
           expect(new Client() instanceof Client).toBeTruthy();
        });
        it("accepts as defaultOptions-object", () => {
            const options: IRequest = {
                baseUrl: "http://api.example.com",
                method: "POST",
                queryParameters: {
                    user: "1",
                    id: "2"
                },
                headers: {
                    "Accept": "",
                    "Authorization": "",
                    "Content-Type": "application/json",
                    "Accept-Language": "en"
                }
            };

            const client = new Client(options);

            expect(client.defaultOptions.baseUrl).toBe("http://api.example.com");
            expect(client.defaultOptions.headers["Accept-Language"]).toBe("en");
            expect(client.defaultOptions.method).toBe("POST");
        });
        it("accepts a defaultOptions-function", () => {
            const fn = () => {
                return {
                    baseUrl: "http://api.example.com",
                    method: "POST",
                    queryParameters: {
                        user: "1",
                        id: "2"
                    },
                    headers: {
                        "Accept": "",
                        "Authorization": "",
                        "Content-Type": "application/json",
                        "Accept-Language": "en"
                    }
                } as IRequest;
            };
            const client = new Client(fn);

            expect(client.defaultOptions.baseUrl).toBe("http://api.example.com");
            expect(client.defaultOptions.headers["Accept-Language"]).toBe("en");
            expect(client.defaultOptions.method).toBe("POST");
        });
    });
});
