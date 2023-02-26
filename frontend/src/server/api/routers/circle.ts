import { createTRPCRouter, privateProedure } from "~/server/api/trpc";
import { Circle, CircleEnvironments } from "@circle-fin/circle-sdk";

const circle = new Circle(
  process.env.NEXT_PUBLIC_CIRCLE_API_KEY as string,
  CircleEnvironments.sandbox
);

export const circleRouter = createTRPCRouter({
  createCheckoutSesstion: privateProedure.query(async ({}) => {
    try {
      const data = await circle.checkoutSessions.createCheckoutSession({
        successUrl: "https://www.example.com/success",

        amount: {
          amount: "1",
          currency: "USD",
        },
      });

      return data.data.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  }),
});
