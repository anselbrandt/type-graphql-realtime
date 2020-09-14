import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { SubscriptionResolver } from "./resolvers/resolver";
import http from "http";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

const PORT = process.env.SERVER_PORT || 4000;

dotenv.config();

const main = async () => {
  // const options: Redis.RedisOptions = {
  //   host: REDIS_HOST,
  //   port: REDIS_PORT,
  //   retryStrategy: times => Math.max(times * 100, 3000),
  // };
  const app = express();
  const pubsub = new RedisPubSub({
    publisher: new Redis(),
    subscriber: new Redis(),
  });
  app.use((req: any, res: any, next: any) => {
    req.pubsub = pubsub;
    next();
  });
  app.get("/", (_, res) => {
    res.send("hello");
  });
  const schema = await buildSchema({
    resolvers: [SubscriptionResolver],
    pubSub: pubsub,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: (context) => context,
    subscriptions: {
      onConnect(connectionParams, webSocket) {
        setInterval(() => {
          pubsub.publish("TIME", null);
        }, 1000);
        setInterval(() => {
          pubsub.publish("RANDOM", null);
        }, 1000);
      },
      onDisconnect() {},
    },
  });
  apolloServer.applyMiddleware({ app: app, path: "/graphql" });
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  httpServer.listen(Number(PORT), () => {
    console.log(
      chalk.green(`Server started at http://localhost:${PORT}/graphql`)
    );
  });
};

main().catch((error) => {
  console.error(error);
});
