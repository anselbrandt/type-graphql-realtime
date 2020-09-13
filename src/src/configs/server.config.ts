import express from "express";
import { PubSub } from "apollo-server-express";

export default class ServerConfig {
  static async getExpress() {
    const app = express();
    const pubsub = new PubSub();
    app.use((req: any, res: any, next: any) => {
      req.pubsub = pubsub;
      next();
    });
    app.get("/", (_, res) => {
      res.send("hello");
    });
    return { app, pubsub };
  }
}
