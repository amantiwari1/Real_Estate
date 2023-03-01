  /* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Grid, Container } from "@mantine/core";
import { type z } from "zod";
import DateForm from "./form/DateForm";
import Form, { type FormProps } from "./form/Form";
import LabeledTextField from "./form/FormField";
import NumberField from "./form/NumberField";

export function RentalForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <Container>
        <Grid>
          <Grid.Col md={6}>
            <NumberField
              name="amount"
              label="Your amount"
              placeholder="Your amount"
              required
              min={0.001}
            />
          </Grid.Col>
          <Grid.Col md={6}>
            <NumberField
              name="deposit"
              label="Your deposit"
              placeholder="Your deposit"
              required
              min={0.001}
            />
          </Grid.Col>

          <Grid.Col md={12}>
            <NumberField
              name="duration"
              label="duration (in days)"
              placeholder="duration (in days)"
              required
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Form>
  );
}

export default RentalForm;
