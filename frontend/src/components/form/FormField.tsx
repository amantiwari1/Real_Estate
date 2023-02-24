/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TextInput,
  PasswordInput,
  type TextInputProps,
  NumberInput,
} from "@mantine/core";
import {
  forwardRef,
  type PropsWithoutRef,
  type ComponentPropsWithoutRef,
} from "react";
import { useFormContext } from "react-hook-form";
import getPropertyFromString from "~/utils/errorhandleInput";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ label, outerProps, labelProps, name, ...props }, ref) => {
  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = getPropertyFromString(name, errors)?.message as string;

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

LabeledTextField.displayName = "LabeledTextField";

export default LabeledTextField;
