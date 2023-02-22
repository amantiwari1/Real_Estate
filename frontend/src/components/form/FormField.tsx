import {
  TextInput,
  PasswordInput,
  TextInputProps,
  NumberInput,
} from "@mantine/core";
import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";

const ListOfComponents: any = {
  text: TextInput,
  password: PasswordInput,
  number: NumberInput,
};

export interface LabeledTextFieldProps extends PropsWithoutRef<TextInputProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number" | "date";
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  labelProps?: ComponentPropsWithoutRef<"label">;
  precision?: number;
  removeTrailingZeros?: boolean;
}

export const LabeledTextField = forwardRef<
  HTMLInputElement,
  LabeledTextFieldProps
>(({ label, outerProps, labelProps, name, ...props }, ref) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  const TypedComponents = ListOfComponents[props.type ?? "text"] || TextInput;

  return (
    <div {...outerProps}>
      <label {...labelProps}>
        <TypedComponents
          error={error}
          label={label}
          disabled={isSubmitting}
          {...register(name, {
            valueAsNumber: props.type === "number",
          })}
          {...props}
        />
      </label>
    </div>
  );
});

export default LabeledTextField;
