---
id: core-concepts
title: Core Concepts
---

## Tinka's internals

The core of `tinka` is a `Stack<IN, OUT>` class, it exposes `addMiddleware()` method which simply adds middleware on top of stack,
it also exposes `process()` method which actually determines the result of whole stack.

tinka `Client` simply `extends Stack` and adds a `FetchMiddleware`, which means technically the API call is being made from a middleware.

In other words, Tinka Client is simply a `Stack` with `FetchMiddleware`

When we initialize `Client` we can add multiple middlewares, `tinka` packages a few middlewares, but you can write your own very easily.

## Client vs Service
A `Service` actually accepts `Client` | `Service` | `ServiceRequest` as a parameter, this is used when you want to generate SDK
