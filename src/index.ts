import ServerConfig from "./src/configs/server.config";
import chalk from "chalk";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { Resolvers } from "./src/graphql";
import http from "http";

const PORT = process.env.SERVER_PORT || 4000;

dotenv.config();
ServerConfig.getExpress()
  .then(async ({ app, pubsub }) => {
    const schema = await buildSchema({
      resolvers: Resolvers(),
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
  })
  .catch((error) => {
    console.log(
      chalk.red(`Unable to start server on port ${PORT}
      Error: ${error}`)
    );
  });
