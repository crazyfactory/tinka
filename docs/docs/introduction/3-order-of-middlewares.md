---
id: order-of-middlewares
title: Order of middleware
sidebar_label: Order of Middlewares
---

If we look at `Stack`'s `process` method, everything's quite clear, it simply creates a chain,
Unlike other http clients like axios, Tinka actually exposes a `next` callback.

It calls latest middleware then moves to the one before it and so on...

This opens up a world of possibilities, if you want to enable mock, simply return your mocks instead of calling `next()`,
if you couldn't find appropriate mock value, then you can still choose to call `next()`.

When you want to know how much time did a request take, then you can even measure in a middleware.

You can add a JwtMiddleware which adds JWT to request,

You can add another RefreshJwtMiddleware which checks if JWT in current request has expired, and if it is, simply make a refresh call first,
then proceed with the original request later, this way your developer only deals with expired JWT once per application.

The possibilities are truly endless.

Since they're called in a chain-like fashion, obviously the RefreshToken middleware will need to be called after JWT middleware.

```typescript
export class LogMw implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
    constructor(private message: string) {
    }

    public async process(options: IFetchRequest, next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>): Promise<IFetchResponse<any>> {
        console.log(`before: ${this.message}`);
        const response = await next(options);
        console.log(`after: ${this.message}`);
        return response;
    }
}
const client = new Client({baseUrl: "https://jsonplaceholder.typicode.com"});
client.addMiddleware(new LogMw("1."));
client.addMiddleware(new LogMw("2."));
await client.process({url: "/todos/1"});
```
The above code produces the following output:
```text
before: 2.
before: 1.
after: 1.
after: 2.
```

So if you had JWT middleware and refresh token middleware,
You want to add RefreshToken first, JWT later.

:::tip Think Dependency
You want to add the dependent middleware first and non dependent later.
:::
