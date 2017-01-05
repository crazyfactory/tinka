import * as Formatting from "./formatting";

describe("formatting", () => {
    describe("objectToQueryString()", () => {

        // Input vs Expected results.
        [
            [null, null],
            [{}, ""],
            [{a: undefined}, ""],
            [{b: null}, "b=null"],
            [{c: 0}, "c=0"],
            [{a: 0, b: "bob"}, "a=0&b=bob"],
            [{z: "last", a: "first"}, "a=first&z=last"]
        ].forEach((v) => {
            const obj: any = v[0];
            const exp = v[1];
            it("transforms `" + JSON.stringify(obj) + "` into `" + exp + "`", () => {
                expect(Formatting.objectToQueryString(obj)).toBe(exp);
            });
        });

        // Throw up cases
        [
            0,
            false,
            undefined,
            true
        ].forEach((v) => {
            it("throws TypeErrors for wrong arguments", () => {
                expect(() => Formatting.objectToQueryString(v)).toThrow();
            });
        });
    });

    describe("combineUrlWithBaseUrl()", () => {

        // url, baseUrl, expectedResult
        [
            [null, "http://api.example.com", "http://api.example.com"],
            ["/test", null, "/test"],
            ["http://api.example.com", "someOtherBase", "http://api.example.com"],
            ["/test", "http://api.example.com", "http://api.example.com/test"]
        ].forEach((v) => {
           const url: any = v[0];
           const baseUrl: any = v[1];
           const exp: any = v[2];
           it("transforms base => `" + baseUrl + "` and url => `" + url + "` into `" + exp + "`", () => {
               expect(Formatting.combineUrlWithBaseUrl(url, baseUrl)).toBe(exp);
           });
        });
    });
});
