---
id: better-typing
title: Dealing with boilerplate
---

The issue we have when we follow guideline described on the previous page is that when you actually get a data,
you'll have to deal with one more Promise:
```typescript
const sdk = Sdk.getInstance();
const userResponse = await sdk.user.findById(1);
const user = await userResponse.json();
```

Most of the time, we want the json output already.

To combat this, we have a way to do better:
```typescript
export class UserNode extends Service {
  @autobind
  public signUp(request: User): Promise<UserCreatedResponse | ErrorResponse> {
    return this.client.process({url: "/user/create", method: "POST", body: JSON.stringify(request)});// you can do more here
  }
  public findById(id: number): Promise<User> {
    return this.client.process({url: `/user/${id}`});
  }
}
```

You can then add a WrapMiddleware on your client like this:
```typescript
export class Sdk extends Service {
  public static instance: Sdk = null;
  public static createSdk(baseUrl: string): Sdk {
    const client = new Client({ baseUrl });
    client.addMiddleware(new ContentTypeMiddleware());
    client.addMiddleware(new WrapMiddleware());
    return new Sdk(client);
  }

  public get user(): UserNode {
    return new FeatureRuns(this.client);
  }
}
```
The `WrapMiddleware` can look like this:
```typescript
import { IFetchRequest, IFetchResponse, IMiddleware } from "@crazyfactory/tinka";

export class WrapMiddleware implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
  public process(
    options: IFetchRequest,
    next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>
  ): Promise<IFetchResponse<any>> {
    return next(options).then((response) => response.json());
  }
}
```
