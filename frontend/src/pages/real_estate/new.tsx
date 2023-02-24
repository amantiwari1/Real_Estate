/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { z } from "zod";
import FlowEstateForm from "~/components/FlowEstateForm";
import { FORM_ERROR } from "~/components/form/Form";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";

export const CreateNFTModelValidation = z.object({
  title: z.string().min(4),
  description: z.string().min(4),
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

  const { mutateAsync } = api.nft.createNFTModel.useMutation();

  if (!isAuth) {
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
        Create an NFT for your Property
      </Title>
      <FlowEstateForm
        className="my-4"
        submitText="Submit new campaign"
        schema={CreateNFTModelValidation}
        initialValues={{}}
        onSubmit={async (values) => {
          try {
            console.log("values", values);
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

            router.push("/");
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
