---
id: include-credentials
title: IncludeCredentialsMiddleware
sidebar_label: IncludeCredentials
---
While making an API request using `fetch`, the cookies aren't included.

While most APIs shouldn't need cookies anyway and use headers to get some request, we want to be able to enable cookies for all requests.

```typescript
const client = new Client();
client.addMiddleware(new IncludeCredentialsMiddleware("include"));
```
This simply sets include to mode, it also defaults to `include`, and if you want to overwrite, you can pass anything you want.

Accepted values are: `omit`, `include` and `same-origin`
