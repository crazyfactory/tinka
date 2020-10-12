---
id: getting-started
title: Getting Started with Tinka
sidebar_label: Getting Started
slug: /
---

### Using NPM
```bash
npm install @crazyfactory/tinka
```

### Using yarn
```bash
yarn add @crazyfactory/tinka
```

:::tip Note on SDKs

The spirit behind using Tinka is when you create SDK for your API client,
On the API client, we install tinka as a peerDependency and maybe a devDependency if we want to test it.
However on consuming end, you install tinka as a normal dependency and pass client down to SDK

:::

---

## Initialization

```typescript
const client = new Client({baseUrl: "https://api.example.com"});
client.addMiddleware(/**/);
```

Initializing client with baseUrl allows you to not having to specify baseUrl on each call

You can also add multiple middlewares:
```typescript
client.addMiddleware(new ContentTypeMiddleware("application/json"));
```
The above will apply ContentTypeMiddleware on every request.

:::caution Order of Middleware
As in every middleware implementation, order of middleware is extremely important
:::

---
