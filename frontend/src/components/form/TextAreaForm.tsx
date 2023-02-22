import { Textarea, TextareaProps } from "@mantine/core";
import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";

export interface LabeledTextAreaFieldProps
  extends PropsWithoutRef<TextareaProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  labelProps?: ComponentPropsWithoutRef<"label">;
}

export const LabeledTextAreaField = forwardRef<
  HTMLInputElement,
  LabeledTextAreaFieldProps
>(({ label, outerProps, labelProps, name, ...props }, ref) => {
  const {
    register,

    formState: { isSubmitting, errors },
  } = useFormContext();
  const error = errors[name]?.message as string;

  return (
    <div {...outerProps}>
      <label {...labelProps}>
        <Textarea
          error={error}
          label={label}
          disabled={isSubmitting}
          {...register(name)}
          {...props}
        />
      </label>
    </div>
  );
});

export default LabeledTextAreaField;
