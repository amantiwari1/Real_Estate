import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProedure } from "~/server/api/trpc";
import {
  Circle,
  CircleEnvironments,
  type FiatPaymentPolymorphic,
} from "@circle-fin/circle-sdk";
import { z } from "zod";

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

  handlePaymentSuccess: privateProedure
    .input(
      z.object({
        nftModelId: z.string(),
        paymentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const getPaymentResponse = await circle.payments.getPayment(
        input.paymentId
      );

      const getPayment: FiatPaymentPolymorphic = getPaymentResponse?.data?.data;

      if (getPayment.status === "failed") {
        return new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Payment failed",
        });
      }

      if (getPayment.status === "paid") {
        // TODO: Pay this NFT model's owner
        // TODO: Transter NFT model to buyer
        // Return success or failure
      }
    }),
});
