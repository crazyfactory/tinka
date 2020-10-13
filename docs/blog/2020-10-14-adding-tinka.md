---
slug: hello-world-welcome-tinka
title: Hello world, welcome Tinka
author: Nishchal Gautam
author_title: Managing Complexity in code (Software Engineering)
author_url: https://github.com/cyberhck
author_image_url: https://avatars1.githubusercontent.com/u/3640284?v=4
tags: [API, SDK, Swagger, Tinka, REST, Swagger]
---

Hello world, I'm introducing tinka to the mix.

Few years ago [@wmathes](https://github.com/wmathes) asked me to find a http client which was similar to aurelia http client (this was before angularjs)

I did a lot of research and found axios, and a few others whose name weren't even heard of.

At that point, axios didn't include any type definitions, it didn't have middleware functionality, basically the set of requirements I was given simply wasn't done by axios (I don't think it still does).

After not finding anything worth it's salt, we decided to roll our own: `tinka`, it's fetch http client, which has no dependency (really, check out [package.json](https://github.com/crazyfactory/tinka/blob/master/package.json)) and would be as close to fetch as we could possibly make.

The best decision for `tinka` was to make middleware it's first class citizen, literally everything's a middleware (the part of code which makes the actual fetch call, is also a middleware)

I've been using tinka for a long time now, and I must say it's been great so far. Because the way middleware works, it's made my development so easy.

Adding response time, doing refresh tokens on expired jwt, automatically adding jwt to all requests etc are all done through this middleware.

Last time I checked, axios now has middleware support I think it's called interceptors. And here's what it looks like

```typescript
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(config);
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
```

My first problem would be, how do I log time taken for a particular request to my server for analytics purpose, monitoring SLAs etc, (remember, you can't only measure response time on server side, you must also do it on client side)

Here's how you do it with tinka:
```typescript
import {IMiddleware} from "../Stack";
import {IFetchRequest, IFetchResponse} from "./FetchMiddleware";

export class LogResponseTime implements IMiddleware<IFetchRequest, Promise<IFetchResponse<any>>> {
    public async process(options: IFetchRequest, next: (nextOptions: IFetchRequest) => Promise<IFetchResponse<any>>): Promise<IFetchResponse<any>> {
        const start = performance.now();
        const response = await next(options);
        const timeTaken = performance.now() - start;
        // push time taken to localStorage and serviceWorker will send it to our servers
        return response;
    }
}
```

Tinka shines when Sdk is provided for a while API with all types, the perfect setup would be to have a npm package which you install when you want to consume a particular API.

You can also look at a usage example here: https://github.com/fossapps/Feature.Manager.Ui/tree/master/src/Sdk
