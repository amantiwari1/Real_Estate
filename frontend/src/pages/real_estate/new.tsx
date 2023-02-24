/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Container, Grid, Paper, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { z } from "zod";
import DropZoneForm from "~/components/form/DropZoneForm";
import Form, { type FormProps, FORM_ERROR } from "~/components/form/Form";
import LabeledTextField from "~/components/form/FormField";
import TextAreaForm from "~/components/form/TextAreaForm";
import { useConnectWallet } from "~/hooks/useConnectWallet";
import Layout from "~/layouts/layout";
import { api } from "~/utils/api";

export function CampaignForm<S extends z.ZodType<any, any>>(
  props: FormProps<S>
) {
  return (
    <Form<S> {...props}>
      <Container>
        <Paper shadow="sm" bg="gray" radius="md" p="xl" className="space-y-10">
          <Grid>
            <Grid.Col md={12}>
              <LabeledTextField
                name="title"
                label="Your Title"
                placeholder="Clothing"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <TextAreaForm
                name="description"
                label="Your Description"
                placeholder="Description"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <DropZoneForm name="content" accept={["image/*"]} />
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Form>
  );
}

export const CreateNFTModelValidation = z.object({
  title: z.string().min(4),
  description: z.string().min(4),
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
      <CampaignForm
        className="my-4"
        submitText="Submit new campaign"
        schema={CreateNFTModelValidation}
        initialValues={{}}
        onSubmit={async (values) => {
          try {
            await mutateAsync(values);

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
