/**
 * Converts an object into a query string with sorted keys.
 *
 * e.g. {a: "alice", c: true, b: 5} becomes "a=alice&b=5&c=true"
 */
export function objectToQueryString(obj?: Object): string|null {

    if (obj !== null && typeof obj !== "object") {
        throw new TypeError("obj must be object or null.");
    }

    return obj && Object
        .keys(obj)
        .sort()
        .map((key) => (encodeURIComponent(key) + "=" + (obj[key] !== undefined ? encodeURIComponent(obj[key]) : "")))
        .join("&");
}

/**
 * Combines a url with a baseUrl.
 */
export function combineUrlWithBaseUrl(url: string, baseUrl: string): string {
    return url && url.indexOf("://") > -1
        ? url
        : (baseUrl || "") + url;
}
