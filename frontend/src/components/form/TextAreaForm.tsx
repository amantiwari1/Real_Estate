import { Textarea, type TextareaProps } from "@mantine/core";
import {
  forwardRef,
  type PropsWithoutRef,
  type ComponentPropsWithoutRef,
} from "react";
import { useFormContext } from "react-hook-form";
import getPropertyFromString from "~/utils/errorhandleInput";

export interface TextAreaFormProps extends PropsWithoutRef<TextareaProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  labelProps?: ComponentPropsWithoutRef<"label">;
}

export const TextAreaForm = forwardRef<HTMLInputElement, TextAreaFormProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      register,

      formState: { isSubmitting, errors },
    } = useFormContext();

    const error = getPropertyFromString(name, errors)?.message as string;

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
  }
);

TextAreaForm.displayName = "TextAreaForm";

export default TextAreaForm;
