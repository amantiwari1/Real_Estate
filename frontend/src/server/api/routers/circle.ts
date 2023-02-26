import { createTRPCRouter, privateProedure } from "~/server/api/trpc";
import { Circle, CircleEnvironments } from "@circle-fin/circle-sdk";

const circle = new Circle(
  process.env.NEXT_PUBLIC_CIRCLE_API_KEY as string,
  CircleEnvironments.sandbox
);

export const circleRouter = createTRPCRouter({
  createCheckoutSesstion: privateProedure.query(async ({}) => {
    const data = await circle.checkoutSessions.createCheckoutSession({
      successUrl: "https://www.example.com/success",

      amount: {
        amount: "3.14",
        currency: "USD",
      },
    });
    return data.data.data;
  }),
});
