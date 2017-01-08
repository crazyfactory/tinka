import {Client, IRequest, IRequestHeaders} from "./Client";
describe("Client", () => {
    it("Should be defined", () => {
        const client = new Client();
        expect(client).toBeDefined();
    });
    it("Should accept IRequest as default option", () => {
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
            headers
        };
        const client = new Client(request);
        expect(client.defaultOptions.baseUrl).toBe("http://api.example.com/v1?user=1");
        expect(client.defaultOptions.headers).toBeDefined();
        expect(client.defaultOptions.method).toBe("GET");
    });
    it("should accept a function which returns IRequest options", () => {
        const requestFunction = () => {
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
        const client = new Client(requestFunction);
        expect(client.defaultOptions.url).toBe("/products");
        expect(client.defaultOptions.baseUrl).toBe("http://api.example.com/example");
        expect(client.defaultOptions.method).toBe("POST");
    });
});
