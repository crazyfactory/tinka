/**
 * Converts an object into a query string with sorted keys.
 *
 * e.g. {a: "alice", c: true, b: 5} becomes "a=alice&b=5&c=true"
 */
export function objectToQueryString(obj?: any): string|null {

    if (obj !== null && typeof obj !== "object") {
        throw new TypeError("obj must be object or null.");
    }

    return obj && Object
        .keys(obj)
        .sort()
        .map((key) => obj[key] === undefined
            ? undefined
            : encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
        )
        .join("&");
}

/**
 * Combines a url with a baseUrl.
 */
export function combineUrlWithBaseUrl(url: string|null|undefined, baseUrl: string|null|undefined): string {
    return url && url.indexOf("://") > -1
        ? url
        : (baseUrl || "") + (url || "");
}
