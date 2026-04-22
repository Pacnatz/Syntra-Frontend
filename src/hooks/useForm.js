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
        validityMessage: evt.target.validationMessage,
      },
    });
  };

  return { values, handleChange, setValues };
}
