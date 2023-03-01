import { NumberInput, type NumberInputProps } from "@mantine/core";
import { forwardRef, type PropsWithoutRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import getPropertyFromString from "~/utils/errorhandleInput";

export interface NumberFieldProps extends PropsWithoutRef<NumberInputProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
}

export const NumberField = forwardRef<
  React.ForwardRefExoticComponent<
    NumberInputProps & React.RefAttributes<HTMLInputElement>
  >,
  NumberFieldProps
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ label, name, ...props }, ref) => {
  const {
    control,
    formState: { isSubmitting, errors },
  } = useFormContext();

  const error = getPropertyFromString(name, errors)?.message as string;

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <NumberInput
            error={error}
            disabled={isSubmitting}
            name={name}
            defaultValue={value}
            label={label}
            onBlur={onBlur} // notify when input is touched
            onChange={onChange} // send value to hook form
            checked={value}
            // step={0.001} // step for incrementing/decrementing value
            ref={ref}
            {...props}
          />
        )}
      />
    </div>
  );
});

NumberField.displayName = "NumberField";

export default NumberField;
