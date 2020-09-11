# Type Graphql Subscriptions

Working demo of [GraphQL](https://graphql.org) subscriptions using [TypeGraphQL](https://typegraphql.com)

### Development

Main entry file is:

`.src/index.ts`

To compile and watch for file changes, run:

`npm run-script watch` or `yarn watch`

In a seperate terminal, to start your app, run:

`npm run-script dev` or `yarn dev`

### Use

Subscribe using:

```
subscription {
  subscription
}
```

Subscription event will be generated on `hello` query:

```
{
  hello
}
```
