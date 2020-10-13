---
id: status-code
title: Dealing with status codes
---

For many applications, dealing with boilerplate and getting the user might be enough already,

In some cases we want to access headers, status code etc, the recommendation on the earlier page shallows these values.

However, there's still more we can do, instead of typing nodes, we can type in the interfaces (`IUserNode`, `IUserWrappedNode` and maybe even `IRawUserNode`)

`UserNode` does implement everything, but this.client.process just returns a `Promise<any>` it satisfies the interface.

Now we can make 3 Sdk classes: SdkRaw, SdkWrapped, SdkDefault which returns `IRawUserNode`, `IUserWrappedNode` and `IUserNode` respectively.

Or even better, you choose one of the way you want to publish your client, and include your middlewares while publishing.

:::warning
WrapMiddleware isn't included in tinka yet, but discussion is ongoing, we have yet to conclude discussion on weather or not it even belongs in this repository.
:::
