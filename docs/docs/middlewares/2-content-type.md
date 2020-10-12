---
id: content-type
title: ContentTypeMiddleware
sidebar_label: Content Type
---
Content type middleware simply adds `content-type` header to all request.

It defaults to `application/json`, but can be configured to add anything.

```typescript
const client = new Client();
client.addMiddleware(new ContentTypeMiddleware("text/xml")); // not passing anything will default to application/json
```
