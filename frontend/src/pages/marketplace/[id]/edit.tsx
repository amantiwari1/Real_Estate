/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { z } from "zod";
import FlowEstateForm from "~/components/FlowEstateForm";
import { FORM_ERROR } from "~/components/form/Form";
import { NftModelDocument } from "~/graphql";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import { useGraphQL } from "~/hooks/useGraphql";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";

export const CreateNFTModelValidation = z.object({
  id: z.string(),
  title: z.string().min(4),
  description: z.string().min(4),
  preview_url: z.string().url(),
  attributes: z.object({
    location: z.string(),
    age: z.number(),
    size: z.number(),
    bhk: z.string(),
    is_repair: z.boolean(),
    price: z.number(),
  }),
  content: z.object({
    id: z.string(),
    fileId: z.string(),
    posterId: z.string(),
  }),
});

export type CreateNFTModelValidationType = z.infer<
  typeof CreateNFTModelValidation
>;

const CreateNFTModel = () => {
  const { isAuth } = useConnectWallet();
  const router = useRouter();

  const id = router.query["id"]?.toString();

  const { data, isLoading: isLoadingNftModel } = useGraphQL(
    NftModelDocument,
    {},
    {
      id: id as string,
    }
  );

  const { mutateAsync } = api.nft.updateNFTModel.useMutation();

  if (!isAuth || isLoadingNftModel) {
    return (
      <Layout>
        <Alert color="red">
          You need to connect your wallet to create an NFT
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Title align="center" color="green" order={1}>
        Edit the NFT for your Property
      </Title>
      <FlowEstateForm
        className="my-4"
        submitText="Submit NFT"
        schema={CreateNFTModelValidation}
        initialValues={{
          id: data?.nftModel?.id,
          title: data?.nftModel?.title,
          description: data?.nftModel?.description,
          attributes: {
            ...data?.nftModel?.attributes,
            bhk: data?.nftModel?.attributes?.bhk?.toString(),
          },
          preview_url: data?.nftModel?.content?.poster?.url,
          content: {
            id: data?.nftModel?.content?.id,
            fileId: data?.nftModel?.content?.files?.[0]?.id,
            posterId: data?.nftModel?.content?.poster?.id,
          },
        }}
        onSubmit={async (values) => {
          try {
            await mutateAsync({
              ...values,
              attributes: {
                ...values.attributes,
                bhk: parseFloat(values.attributes.bhk),
              },
            });

            showNotification({
              title: "Success",
              message:
                "nft created successfully and please wait to apearing soon up to 5 minutes",
              color: "green",
            });

            router.push("/marketplace");
          } catch (error: any) {
            console.error(error);
            showNotification({
              title: "Something went wrong",
              message: "Failed to create campaign",
              color: "red",
            });
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />
    </Layout>
  );
};

export default CreateNFTModel;
