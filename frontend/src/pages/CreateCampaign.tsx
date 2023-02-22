import { Alert, Container, Grid, Paper, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { z } from "zod";
import Form, { FormProps, FORM_ERROR } from "~/components/form/Form";
import LabeledTextField from "~/components/form/FormField";
import { useConnectWallet } from "~/hooks/useConnectWallet";

export function CampaignForm<S extends z.ZodType<any, any>>(
  props: FormProps<S>
) {
  return (
    <Form<S> {...props}>
      <Container>
        <Paper shadow="sm" radius="md" p="xl" className="space-y-10">
          <Grid>
            <Grid.Col md={6}>
              <LabeledTextField
                name="name"
                label="Your Name"
                placeholder="Aman tiwari"
                required
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Form>
  );
}

export const CreateCampaignValidation = z.object({
  name: z.string().min(4),
  title: z.string().min(4),
  description: z.string().min(4),
  target: z.number().min(0.0000001),
  deadline: z.date(),
  image: z.string().url(),
});

export type CreateCampaignValidationType = z.infer<
  typeof CreateCampaignValidation
>;

const CreateCampaign = () => {
  const { isAuth } = useConnectWallet();

  if (!isAuth) {
    return (
      <div>
        <Alert color="red">
          You need to connect your wallet to create a campaign
        </Alert>
      </div>
    );
  }
  return (
    <div>
      <Title align="center" color="green" order={1}>
        Start a Campaign
      </Title>
      <CampaignForm
        submitText="Submit new campaign"
        schema={CreateCampaignValidation}
        initialValues={{}}
        onSubmit={async (values) => {
          try {
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
    </div>
  );
};

export default CreateCampaign;
