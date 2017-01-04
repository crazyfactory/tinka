import * as Formatting from "./formatting";

describe("formatting", () => {
    describe("objectToQueryString()", () => {
        const cases = [
            [null, null],
            [{}, ""],
            [{a: 0}, "a=0"],
            [{a: 0, b: "bob"}, "a=0&b=bob"],
            [{z: "last", a: "first"}, "a=first&z=last"]
        ];

        cases.forEach((v) => {
            const obj = v[0];
            const exp = v[1];
            it("transforms `" + JSON.stringify(obj) + "` into `" + exp + "`", () => {
                expect(Formatting.objectToQueryString(obj)).toBe(exp);
            });
        });
    });
});
