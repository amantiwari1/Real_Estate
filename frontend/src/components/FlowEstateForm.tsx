/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paper, Grid, Container } from "@mantine/core";
import { type z } from "zod";
import DropZoneForm from "./form/DropZoneForm";
import Form, { type FormProps } from "./form/Form";
import LabeledTextField from "./form/FormField";
import NumberField from "./form/NumberField";
import SelectField from "./form/SelectField";
import SwitchField from "./form/SwitchField";
import TextAreaForm from "./form/TextAreaForm";

// Location: [input field]
// Size (square footage): [input field]
// BHK: <DROPDOWN> [0.5 , 1, 1.5,2,2.5,3,4]

// Property Images:
// Upload high-quality images of the property: [file upload button]

// Property Value:
// Property value determined by appraisal or evaluation: [input field]

// Property History:
// Age of the property: [input field]
// Renovations/repairs: [bool]

// Market Trends:
// Demand for real estate in the area: [input field]

export function FlowEstateForm<S extends z.ZodType<any, any>>(
  props: FormProps<S>
) {
  return (
    <Form<S> {...props}>
      <Container>
        <Paper shadow="sm" bg="gray" radius="md" p="xl" className="space-y-10">
          <Grid>
            <Grid.Col md={6}>
              <LabeledTextField
                name="title"
                label="Your Title"
                placeholder="Flat for sale"
                required
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <LabeledTextField
                name="attributes.location"
                label="Your location"
                placeholder="Jaipur, Rajasthan"
                required
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <NumberField
                name="attributes.size"
                label="Size (square footage)"
                placeholder="1500"
                required
              />
            </Grid.Col>
            <Grid.Col md={6}>
              <SelectField
                name="attributes.bhk"
                label="Number of BHK"
                placeholder="select number of bhk"
                data={[
                  { label: "0.5", value: "0.5" },
                  { label: "1", value: "1" },
                  { label: "1.5", value: "1.5" },
                  { label: "2", value: "2" },
                  { label: "2.5", value: "2.5" },
                  { label: "3", value: "3" },
                  { label: "4", value: "4" },
                ]}
                required
              />
            </Grid.Col>

            <Grid.Col md={6}>
              <NumberField
                name="attributes.age"
                label="Age of the property"
                placeholder="5"
                required
              />
            </Grid.Col>

            <Grid.Col md={6}>
              <NumberField
                name="attributes.price"
                label="Property Value in USDC"
                placeholder="15000"
                required
              />
            </Grid.Col>

            <Grid.Col md={6}>
              <SwitchField
                name="attributes.is_repair"
                label="Renovations/repairs :"
              />
            </Grid.Col>

            <Grid.Col md={12}>
              <TextAreaForm
                name="description"
                label="description"
                placeholder="description"
                required
              />
            </Grid.Col>
            <Grid.Col md={12}>
              <DropZoneForm
                name="content"
                label="Images of the property"
                accept={["image/*"]}
              />
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Form>
  );
}

export default FlowEstateForm;
