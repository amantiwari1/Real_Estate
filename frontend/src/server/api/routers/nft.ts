import { TRPCError } from "@trpc/server";
import request from "graphql-request";
import { z } from "zod";
import { Status } from "~/gql/graphql";
import {
  CheckoutWithDapperWalletDocument,
  CompleteCheckoutWithDapperWallet,
  createNftModelsDocument,
  getWalletDocument,
  NftModelDocument,
  readyWalletDocument,
  registerWalletDocument,
  SignTransactionForDapperWallet,
  TransferNftToWalletDocument,
  UpdateNFTModelDocument,
  UploadNFTContentDocument,
  verifyWalletDocument,
  mintNFTModel,
} from "~/graphql";

const URL =
  process.env.NEXT_PUBLIC_API_PATH ?? "https://graphql.api.staging.niftory.com";

import { createTRPCRouter, privateProedure } from "~/server/api/trpc";

const headers = {
  "X-Niftory-API-Key": "o4hB8pOhgvYXOwCEEcaf6IJBjaObAc0GPZARd4tHvVo=",
  "X-Niftory-Client-Secret": process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
};

export const nftRouter = createTRPCRouter({
  uploadfile: privateProedure
    .input(
      z.object({
        description: z.string(),
        contentType: z.string(),
        posterContentType: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await request(URL, UploadNFTContentDocument, input, headers);
    }),
  createNFTModel: privateProedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        attributes: z.object({
          location: z.string(),
          age: z.number(),
          size: z.number(),
          bhk: z.number(),
          is_repair: z.boolean(),
          price: z.number(),
        }),
        content: z.object({
          id: z.string(),
          fileId: z.string(),
          posterId: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await request(
        URL,
        createNftModelsDocument,
        {
          setId: "11e39381-a415-43e9-920b-3b6ace796148",
          data: {
            title: input.title,
            description: input.description,
            tags: [],
            quantity: 1,
            status: Status.Done,
            content: {
              fileId: input.content.fileId,
              posterId: input.content.posterId,
            },
            metadata: {},
            attributes: { ...input.attributes, address: ctx.address },
            contentId: input.content.id,
            subtitle: "",
          },
        },
        headers
      );
    }),
  updateNFTModel: privateProedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        attributes: z.object({
          location: z.string(),
          age: z.number(),
          size: z.number(),
          bhk: z.number(),
          is_repair: z.boolean(),
          price: z.number(),
        }),
        content: z.object({
          id: z.string(),
          fileId: z.string(),
          posterId: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await request(
        URL,
        NftModelDocument,
        {
          id: input.id,
        },
        headers
      );

      if (data.nftModel?.attributes.address !== ctx.address) {
        throw new TRPCError({
          message: "You are not the owner of this NFT",
          code: "UNAUTHORIZED",
        });
      }

      return await request(
        URL,
        UpdateNFTModelDocument,
        {
          updateNftModelId: input.id,
          data: {
            title: input.title,
            description: input.description,
            quantity: 1,
            status: Status.Done,
            attributes: {
              ...input.attributes,
              address: ctx.address,
            },
            contentId: input.content.id,
          },
        },
        headers
      );
    }),
  registerWallet: privateProedure.mutation(async ({ ctx }) => {
    return await request(
      URL,
      registerWalletDocument,
      {
        address: ctx.address,
      },
      headers
    );
  }),
  getWallet: privateProedure.query(async ({ ctx }) => {
    return await request(
      URL,
      getWalletDocument,
      {
        address: ctx.address,
      },
      headers
    );
  }),
  verifyWallet: privateProedure
    .input(
      z.object({
        signedVerificationCode: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await request(
        URL,
        verifyWalletDocument,
        {
          address: ctx.address,
          signedVerificationCode: input.signedVerificationCode,
        },
        headers
      );
    }),
  readyWallet: privateProedure.mutation(async ({ ctx }) => {
    return await request(
      URL,
      readyWalletDocument,
      {
        address: ctx.address,
      },
      headers
    );
  }),
  SignTransactionForDapperWallet: privateProedure
    .input(
      z.object({
        transaction: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await request(
        URL,
        SignTransactionForDapperWallet,
        {
          transaction: input.transaction,
        },
        headers
      );
    }),
  CompleteCheckoutWithDapperWallet: privateProedure
    .input(
      z.object({
        transactionId: z.string(),
        nftDatabaseId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await request(
        URL,
        CompleteCheckoutWithDapperWallet,
        {
          transactionId: input.transactionId,
          nftDatabaseId: input.nftDatabaseId,
        },
        headers
      );
    }),

  claim: privateProedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const nftModelResponse = await request(
        URL,
        NftModelDocument,
        {
          id: input.id,
        },
        headers
      );

      // for claiming before minting in the drafts commenting this out
      // if (!nftModelResponse?.nftModel?.attributes?.claimable) {
      //   return new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "NFT is not claimable",
      //   });
      // }

      return await request(
        URL,
        TransferNftToWalletDocument,
        {
          address: ctx.address,
          nftModelId: input.id,
        },
        headers
      );
    }),

  checkoutWithDapperWallet: privateProedure
    .input(
      z.object({
        id: z.string(),
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await request(URL, NftModelDocument, input, headers);

      const price = data.nftModel?.attributes?.price ?? 0.1;

      return await request(
        URL,
        CheckoutWithDapperWalletDocument,
        {
          nftModelId: input.id,
          address: input.address,
          price: price,
          expiry: Number.MAX_SAFE_INTEGER,
        },
        headers
      );
    }),

  // mintnftmodel
  mintNFTModel: privateProedure
    .input(
      z.object({
        appId: z.string(),
        id: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await request(
        URL,
        mintNFTModel,
        {
          appId: input.appId,
          id: input.id,
          quantity: input.quantity,
        },
        headers
      );
    }),
});
