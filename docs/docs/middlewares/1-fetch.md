---
id: fetch
title: FetchMiddleware
sidebar_label: Fetch
---

This is the one and only default middleware which is added to all `Client`s, there's really no reason to initialize `Stack` without this.

This middleware invoked only if all other middleware called next and didn't do a short circuit.

Middlewares have ability to short-circuit and return something else entirely (like from a cache)

Fetch actually combines the baseUrl with relative path to form a full URL, it simply passes the options down to `fetch`.

:::caution
There's really no reason to initialize this middleware yourself.
:::
