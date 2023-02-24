import { Switch, type SwitchProps } from "@mantine/core";
import { forwardRef, type PropsWithoutRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import getPropertyFromString from "~/utils/errorhandleInput";

export interface SwitchFieldProps extends PropsWithoutRef<SwitchProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
}

export const SwitchField = forwardRef<
  React.ForwardRefExoticComponent<
    SwitchProps & React.RefAttributes<HTMLInputElement>
  >,
  SwitchFieldProps
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
          <Switch
            labelPosition="left"
            error={error}
            disabled={isSubmitting}
            name={name}
            mt="xl"
            label={label}
            onBlur={onBlur} // notify when input is touched
            onChange={onChange} // send value to hook form
            checked={value}
            ref={ref}
            {...props}
          />
        )}
      />
    </div>
  );
});

SwitchField.displayName = "SwitchField";

export default SwitchField;
