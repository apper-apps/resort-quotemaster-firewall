import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ 
  className, 
  children, 
  error,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200 appearance-none",
          error && "border-error focus:border-error focus:ring-error/50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;