import request from "graphql-request";
import { z } from "zod";
import {} from "~/gql";
import { Status } from "~/gql/graphql";
import { createNftModelsDocument, UploadNFTContentDocument } from "~/graphql";

const URL =
  process.env.NEXT_PUBLIC_API_PATH ?? "https://graphql.api.staging.niftory.com";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const headers = {
  "X-Niftory-API-Key": "o4hB8pOhgvYXOwCEEcaf6IJBjaObAc0GPZARd4tHvVo=",
  "X-Niftory-Client-Secret": process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
};

export const nftRouter = createTRPCRouter({
  uploadfile: publicProcedure
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
  createNFTModel: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        content: z.object({
          id: z.string(),
          fileId: z.string(),
          posterId: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
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
            attributes: {},
            contentId: input.content.id,
            subtitle: "",
          },
        },
        headers
      );
    }),
});
