---
id: mock
title: MockMiddleware
sidebar_label: MockMiddleware
---

This is the most complex middleware in `tinka` right now.

A medium-sized application can grow upto quite a few endpoints, we didn't want to end up with that many middlewares doing complex mocking logic.

Hence, we created a MockMiddleware which exposes a few functionalities.

It exposes a helper method called `resolvingPromise` which resolves with given data after a certain delay:
```typescript
MockMiddleware.resolvingPromise({username: ""}, 200) // resolves after 200ms
```
It exposes another helper method called `jsonResponse` so we can mock json response inside a `Response` object.

MockMiddleware is basically a collection of handlers which user will add, here's what it might look like:

```typescript
const mockMw = new MockMiddleware();
mockMw.addHandler({
  match: (options: IFetchRequest): boolean => options.method === "GET" && options.url.includes("/user/by_id"),
  delay: 200,
  resultFactory: (options: IFetchRequest): Promise<any> => ({email: "mock@mockEmail.com", name: "mock name"}),
});
```

You can add multiple handlers each responding to different URLs,
`MockMiddleware` will go through each of them to find which Handler can handle current request,
once it finds one, it simply calls the `resultFactory` method, and you have control over what happens there,
you can simply return a dummy value, choose to treat localStorage as a datastore to store/get values.

:::tip
Keep mocks always available, simply not include the mock middleware on production environments
:::

```typescript
const mockMw = new MockMiddleware();
mockMw.addHandler();
mockMw.addHandler();
mockMw.addHandler();
mockMw.addHandler();
if (ENV === "development") { // you can have your own check
  client.addMiddleware(mockMw);
}
```
