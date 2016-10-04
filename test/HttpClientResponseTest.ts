import {HttpClientResponse} from "../app/http-client";
import {FetchResponse as IFetchResponse} from "http-client";
class MockHeaders{
    private empty:boolean;
    private key:string;
    private hide;
    private throwRubish:boolean;
    get(key:string){
        if(this.hide){
            return undefined;
        }
        if(this.empty){
            return "";
        }
        if(this.throwRubish){
            return "plain/xml";
        }
        this.key = key;
        if(key == "Content-Type"){
            return "application/json; charset=utf8"
        }
    }
    has(key:string){
        if(this.hide){
            return false;
        }
        this.key = key;
        return key === "Content-Type";
    }
    remove(){
        this.hide = true;
    }
    throwEmpty(){
        this.empty = true;
    }
    rubish(){
        this.throwRubish = true;
    }
}
class FetchResponse implements IFetchResponse{
    public body = "";
    public bodyUsed = false;
    public headers;
    public ok = true;
    public status = 200;
    public statusText = "ok";
    public type = "cors";
    public url = "https://api.crazy-factory.com/v2/";
    public json(){
        return new Promise((resolve, reject) => {
            resolve({status:'ok'});
        });
    }
    public text(){
        return new Promise((resolve, reject) => {
            resolve("{status:'ok'}");
        });
    };
    constructor(){
        this.headers = new MockHeaders();
    }
}
describe("HttpClientResponse", () => {
    let response:FetchResponse;
    beforeEach(() => {
        response = new FetchResponse();
    });
    it('should be defined', () => {
        expect(HttpClientResponse).toBeDefined();
    });
    it('should reflect status from response.status', () => {
        let http = new HttpClientResponse(response, "");
        expect(http.status).toBe(200);
        response.status = 500;
        http = new HttpClientResponse(response, "");
        expect(http.status).toBe(500);
    });
    it("should reflect status text from response", () => {
        let http = new HttpClientResponse(response, "");
        expect(http.statusText).toBeDefined();
        expect(http.statusText).toBe("ok");
    });
    it("should define hasError", () => {
        let http = new HttpClientResponse(response, "");
        expect(http.hasError).toBeDefined();
    });
    it("should reflect hasError from response", () => {
        let http = new HttpClientResponse(response, "");
        let error = http.hasError;
        expect(error).toBeFalsy();
        response.ok = false;
        http = new HttpClientResponse(response, "");
        expect(http.hasError).toBeTruthy();
    });
    it("should populate hasData according to status code", () => {
        let http = new HttpClientResponse(response, "");
        expect(http.hasData).toBeTruthy();
        response.status = 204;
        http = new HttpClientResponse(response, "");
        expect(http.hasData).toBeFalsy();
    });
    it("should populate isSuccess according to 'ok'", () => {
        let http = new HttpClientResponse(response, "");
        expect(http.ok).toBeTruthy();
        response.ok = false;
        expect(new HttpClientResponse(response, "").ok).toBeFalsy();
    });
    it('should populate contentType property', () => {
        let http = new HttpClientResponse(response, "");
        expect(http.contentType).toBe("application/json");
    });

    it('should make use of has', () => {
        response.headers.remove();
        let http = new HttpClientResponse(response, "");
        expect(http.contentType).toBeUndefined();
    });
    describe("test http.data", () => {
        it("", () => {
            let http = new HttpClientResponse(response, "");
            expect(() => {http.data}).toThrowError();
        });
        it("data undefined when headers doesn't exist", () => {
            response.headers.throwEmpty();
            let http = new HttpClientResponse(response, "");
            expect(http.data).toBeUndefined();
        });
        it("should handle", () => {
            response.headers.rubish();
            let http = new HttpClientResponse(response, "");
            expect(() => {http.data}).toThrowError();
        });

    });

});