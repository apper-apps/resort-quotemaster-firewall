import React from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className, 
  required = false,
  children,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-gray-700 mb-1 block",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;