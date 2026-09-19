import { useCallback, useState } from "react";
import applyValidations from "./validations";

const formatsByType = (value: any, type: string) => {
  if (typeof value === "undefined") {
    return value;
  }
  const types: Record<string, (value: any) => any> = {
    boolean: (next) => next === "true",
    number: (next) => parseFloat(next),
    multiple: (next) => {
      const valueArray = `${next}`.split(",");
      if (valueArray.length === 1 && valueArray[0] === "") {
        return [];
      }
      return valueArray;
    },
  };

  return types[type] ? types[type](value) : value;
};

const useForm = (
  validations: Record<string, any> = {},
  formatTypes: Record<string, any> = {},
  onSubmit: (data?: any) => void = () => {},
  showTopAlert = false
) => {
  const [errorsComp, setErrorsComp] = useState({
    errors: null as Record<string, any> | null,
    hasErrors: false,
  });

  const onSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const formProps: Record<string, any> = Object.fromEntries(formData);

      Object.entries(formatTypes).forEach(([key, type]) => {
        if (!formData.has(key)) return;
        formProps[key] = formatsByType(formProps[key], type);
      });

      const errorsForm: Record<string, any> = {};
      let withErrors = false;

      Object.entries(formProps).forEach(([key, value]) => {
        if (validations[key]) {
          const error = applyValidations(value, validations[key], formProps);
          if (error) {
            errorsForm[key] = error;
            withErrors = true;
          }
        }
      });

      if (!withErrors) {
        setErrorsComp({ errors: null, hasErrors: false });
        onSubmit(formProps);
      } else {
        setErrorsComp({ errors: errorsForm, hasErrors: true });
        if (showTopAlert && window) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }
    },
    [validations, formatTypes, onSubmit, showTopAlert]
  );
  return { ...errorsComp, onSubmitForm };
};

export default useForm;
