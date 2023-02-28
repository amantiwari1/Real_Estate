import {
  forwardRef,
  type PropsWithoutRef,
  type ComponentPropsWithoutRef,
} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DatePicker, type DatePickerProps } from "@mantine/dates";
import getPropertyFromString from "~/utils/errorhandleInput";

export interface LabeledTextFieldProps
  extends PropsWithoutRef<DatePickerProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number" | "date";
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  labelProps?: ComponentPropsWithoutRef<"label">;
}

export const DateForm = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      control,
      formState: { isSubmitting, errors },
    } = useFormContext();

    const error = getPropertyFromString(name, errors)?.message as string;

    return (
      <div {...outerProps}>
        <label {...labelProps}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <DatePicker
                  error={error}
                  label={label}
                  disabled={isSubmitting}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  required={props.required}
                  placeholder={props.placeholder}
                />
              </>
            )}
            name={name}
            {...props}
          />
        </label>
      </div>
    );
  }
);

DateForm.displayName = "DateForm";

export default DateForm;
