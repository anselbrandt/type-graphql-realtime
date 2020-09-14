"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
require("reflect-metadata");
const resolver_1 = require("./resolvers/resolver");
const http_1 = __importDefault(require("http"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const ioredis_1 = __importDefault(require("ioredis"));
const PORT = process.env.SERVER_PORT || 4000;
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    const pubsub = new graphql_redis_subscriptions_1.RedisPubSub({
        publisher: new ioredis_1.default(),
        subscriber: new ioredis_1.default(),
    });
    app.use((req, res, next) => {
        req.pubsub = pubsub;
        next();
    });
    app.get("/", (_, res) => {
        res.send("hello");
    });
    const schema = yield type_graphql_1.buildSchema({
        resolvers: [resolver_1.SubscriptionResolver],
        pubSub: pubsub,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
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
            onDisconnect() { },
        },
    });
    apolloServer.applyMiddleware({ app: app, path: "/graphql" });
    const httpServer = http_1.default.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(Number(PORT), () => {
        console.log(chalk_1.default.green(`Server started at http://localhost:${PORT}/graphql`));
    });
});
main().catch((error) => {
    console.error(error);
});
//# sourceMappingURL=index.js.map