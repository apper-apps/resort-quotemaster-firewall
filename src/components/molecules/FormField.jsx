import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = React.forwardRef(({ 
  label,
  error,
  required = false,
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {children || <Input error={error} ref={ref} {...props} />}
      {error && (
        <p className="text-xs text-error mt-1">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

export default FormField;