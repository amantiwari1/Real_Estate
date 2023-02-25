import { type SwitchProps, Select, type SelectProps } from "@mantine/core";
import { forwardRef, type PropsWithoutRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import getPropertyFromString from "~/utils/errorhandleInput";

export interface SelectFieldProps extends PropsWithoutRef<SelectProps> {
  /** Field name. */
  name: string;
  /** Field label. */
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
}

export const SelectField = forwardRef<
  React.ForwardRefExoticComponent<
    SwitchProps & React.RefAttributes<HTMLInputElement>
  >,
  SelectFieldProps
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
          <>
            <Select
              error={error}
              disabled={isSubmitting}
              defaultValue={`${value}`}
              searchValue={`${value}`}
              value={`${value}`}
              name={name}
              label={label}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              ref={ref}
              {...props}
            />
          </>
        )}
      />
    </div>
  );
});

SelectField.displayName = "SelectField";

export default SelectField;
