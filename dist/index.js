"use strict";
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
    .then(({ appExpress, pubsub }) => {
    const schema = type_graphql_1.buildSchemaSync({
        resolvers: graphql_1.Resolvers(),
        pubSub: pubsub,
    });
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        context: (context) => context,
        subscriptions: {
            onConnect(connectionParams, webSocket) { },
            onDisconnect() { },
        },
    });
    server.applyMiddleware({ app: appExpress, path: "/graphql" });
    const httpServer = http_1.default.createServer(appExpress);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(Number(PORT), () => {
        console.log(chalk_1.default.green(`Server started at http://localhost:${PORT}/graphql`));
    });
})
    .catch((error) => {
    console.log(chalk_1.default.red(`Unable to start server on port ${PORT}
      Error: ${error}`));
});
//# sourceMappingURL=index.js.map