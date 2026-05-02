import { useState } from "react";

export function useForm(defaultValues) {
  const [values, setValues] = useState(defaultValues);

  const handleChange = (evt) => {
    const { value, name } = evt.target;
    setValues({
      ...values,
      [name]: {
        value,
        valid: evt.target.checkValidity(),
      },
    });
  };

  const handleBlur = (evt) => {
    const { name } = evt.target;
    setValues({
      ...values,
      [name]: {
        value: values[name].value,
        valid: evt.target.checkValidity(),
        validityMessage: evt.target.validity.patternMismatch
          ? "Only letters and numbers are allowed."
          : evt.target.validationMessage,
      },
    });
  };

  return { values, handleChange, handleBlur, setValues };
}
