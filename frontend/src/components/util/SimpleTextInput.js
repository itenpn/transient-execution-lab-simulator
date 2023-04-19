import { forwardRef } from "react";

import { FormControl, InputLabel, FilledInput } from "@mui/material";

const SimpleTextInput = forwardRef((props, ref) => {
  let { field, label, defaultValue, onChange, onBlur, type, inputProps, disabled } = props;

  type = type ?? "text";
  disabled = disabled ?? false;

  return (
    <FormControl fullWidth variant="filled">
      <InputLabel htmlFor={`${field}-input`}>{label}</InputLabel>
      <FilledInput
        id={`${field}-input`}
        defaultValue={defaultValue}
        label={label}
        onChange={onChange}
        onBlur={onBlur}
        variant="filled"
        type={type}
        inputProps={inputProps}
        disabled={disabled}
        inputRef={ref}
      />
    </FormControl>
  );
});

export default SimpleTextInput;
