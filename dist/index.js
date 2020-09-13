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
const server_config_1 = __importDefault(require("./src/configs/server.config"));
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
require("reflect-metadata");
const graphql_1 = require("./src/graphql");
const http_1 = __importDefault(require("http"));
const PORT = process.env.SERVER_PORT || 4000;
dotenv_1.default.config();
server_config_1.default.getExpress()
    .then(({ app, pubsub }) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = yield type_graphql_1.buildSchema({
        resolvers: graphql_1.Resolvers(),
        pubSub: pubsub,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema,
        context: (context) => context,
        subscriptions: {
            onConnect(connectionParams, webSocket) { },
            onDisconnect() { },
        },
    });
    apolloServer.applyMiddleware({ app: app, path: "/graphql" });
    const httpServer = http_1.default.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(Number(PORT), () => {
        console.log(chalk_1.default.green(`Server started at http://localhost:${PORT}/graphql`));
    });
}))
    .catch((error) => {
    console.log(chalk_1.default.red(`Unable to start server on port ${PORT}
      Error: ${error}`));
});
//# sourceMappingURL=index.js.map