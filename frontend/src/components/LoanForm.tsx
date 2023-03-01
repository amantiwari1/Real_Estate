/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, Container } from "@mantine/core";
import { type z } from "zod";
import Form, { type FormProps } from "./form/Form";
import NumberField from "./form/NumberField";

export function LoanForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
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
              name="repayment"
              label="Amount you can repay"
              placeholder="Repayment amount"
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

export default LoanForm;
