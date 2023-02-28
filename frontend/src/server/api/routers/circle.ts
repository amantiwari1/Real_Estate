/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, privateProedure } from "~/server/api/trpc";
import {
  Circle,
  CircleEnvironments,
  type FiatPaymentPolymorphic,
} from "@circle-fin/circle-sdk";
import { z } from "zod";
import request from "graphql-request";
import { NftModelDocument, TransferNftToWalletDocument } from "~/graphql";

const circle = new Circle(
  process.env.NEXT_PUBLIC_CIRCLE_API_KEY as string,
  CircleEnvironments.sandbox
);

const URL =
  process.env.NEXT_PUBLIC_API_PATH ?? "https://graphql.api.staging.niftory.com";

const headers = {
  "X-Niftory-API-Key": "o4hB8pOhgvYXOwCEEcaf6IJBjaObAc0GPZARd4tHvVo=",
  "X-Niftory-Client-Secret": process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
};
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
    .mutation(async ({ input, ctx }) => {
      const nftModel = await request(
        URL,
        NftModelDocument,
        {
          id: input.nftModelId,
        },
        headers
      );

      const getPaymentResponse = await circle.payments.getPayment(
        input.paymentId
      );

      const getPayment: FiatPaymentPolymorphic = getPaymentResponse?.data
        ?.data as any;

      console.log({ getPayment });

      if (getPayment?.status === "failed") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Payment failed",
        });
      }

      if (getPayment.status === "confirmed") {
        // TODO: Pay this NFT model's owner
        const createTransferResponse = await circle.transfers.createTransfer({
          amount: getPayment.amount,
          destination: {
            address: nftModel.nftModel?.attributes?.address,
            type: "blockchain",
            chain: "FLOW",
          },
          idempotencyKey: input.paymentId,
          source: {
            id: "1013850122",
            type: "wallet",
          },
        });

        const createTransfer = createTransferResponse?.data.data;

        console.log({ createTransfer });

        // Transter NFT model to buyer after pay to owner condition
        if (createTransfer?.status === "complete") {
          await request(
            URL,
            TransferNftToWalletDocument,
            {
              address: ctx.address,
              nftModelId: input.nftModelId,
            },
            headers
          );
          return {
            success: true,
          };
        }
      }

      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Payment failed",
      });
    }),
});
