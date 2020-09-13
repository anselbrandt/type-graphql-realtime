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
    await ctx.req.pubsub.publish("MESSAGES");
    return "Hello World";
  }

  @Subscription(() => String, {
    topics: "MESSAGES",
  })
  async subscription(@Ctx() ctx: any): Promise<any> {
    const date = new Date();
    const time = date.toISOString();
    return time;
  }
}
