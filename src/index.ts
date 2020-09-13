import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import { ApolloServer, PubSub } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { SubscriptionResolver } from "./resolvers/resolver";
import http from "http";

const PORT = process.env.SERVER_PORT || 4000;

dotenv.config();

const main = async () => {
  const app = express();
  const pubsub = new PubSub();
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
      onConnect(connectionParams, webSocket) {},
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
