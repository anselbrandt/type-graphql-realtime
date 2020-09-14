import {
  Ctx,
  Query,
  Resolver,
  Subscription,
  Field,
  ObjectType,
} from "type-graphql";

@ObjectType()
class SubscriptionReturnType {
  @Field()
  message?: string;
}

@Resolver()
export class SubscriptionResolver {
  @Query(() => String)
  async hello(@Ctx() ctx: any) {
    await ctx.req.pubsub.publish("QUERY");
    return "Hello World";
  }

  @Subscription(() => String, {
    topics: "TIME",
  })
  async time(@Ctx() ctx: any): Promise<any> {
    const date = new Date();
    const time = date.toISOString();
    return time;
  }
  @Subscription(() => String, {
    topics: "RANDOM",
  })
  async random(@Ctx() ctx: any): Promise<any> {
    return Math.random();
  }
  @Subscription(() => String, {
    topics: "QUERY",
  })
  async query(@Ctx() ctx: any): Promise<any> {
    return "user query";
  }
}
