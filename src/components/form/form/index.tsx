"use client";
import useForm from "./useForm";
import FormContext from "./context";
import I18N from "@/i18n";
import type { ReactNode } from "react";

const Form = ({
  validations = {},
  formatTypes = {},
  onSubmit = (_data?: any) => {},
  showTopAlert = false,
  children = null,
  className = "",
}: {
  validations?: Record<string, any>;
  formatTypes?: Record<string, any>;
  onSubmit?: (data?: any) => void;
  showTopAlert?: boolean;
  children?: ReactNode;
  className?: string;
}) => {
  const { errors, hasErrors, onSubmitForm } = useForm(
    validations,
    formatTypes,
    onSubmit,
    showTopAlert
  );

  return (
    <FormContext.Provider value={{ errors }}>
      <form onSubmit={onSubmitForm} noValidate className={className}>
        {showTopAlert && hasErrors && (
          <div className="animate-fadein bg-danger text-white text-sm p-3 mb-3 rounded-md text-center">
            <I18N id="form.error" />
          </div>
        )}
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
