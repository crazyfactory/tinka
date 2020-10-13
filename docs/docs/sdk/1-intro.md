---
id: sdk
title: Generating Sdk
---

Tinka is built for generated SDK, this is where it really shines.

With the help of middlewares, your SDK remains simple, easy to use and saves a lot of developer's time (because of types).

Recommended structure of a Sdk is to create multiple nodes like the following:
```typescript
export class UserNode extends Service {
  @autobind
  public signUp(request: User): Promise<IFetchResponse<UserCreatedResponse | ErrorResponse>> {
    return this.client.process({url: "/user/create", method: "POST", body: JSON.stringify(request)});// you can do more here
  }
  public findById(id: number): Promise<IFetchResponse<User>> {
    return this.client.process({url: `/user/${id}`});
  }
}
```
Each node is a domain which contains multiple methods, we suggest using `@autobind` decorator to deal with JavaScript `this`.

once you have multiple nodes, create a Sdk class like so:
```typescript
export class Sdk extends Service {
  public static instance: Sdk = null;
  public static getInstance(baseUrl: string): Sdk {
    if (Sdk.instance === null) {
      Sdk.instance = Sdk.createSdk(baseUrl);
    }
    return Sdk.instance;
  }

  public static createSdk(baseUrl: string): Sdk {
    const client = new Client({ baseUrl });
    client.addMiddleware(new ContentTypeMiddleware());
    return new Sdk(client);
  }

  public get user(): UserNode {
    return new FeatureRuns(this.client);
  }
}
```

Now the consumer of this library will get a fully typed experience while consuming your API
