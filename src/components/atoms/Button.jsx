import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 focus:ring-primary/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    secondary: "bg-surface border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    accent: "bg-gradient-to-r from-accent to-orange-500 text-white hover:from-accent/90 hover:to-orange-500/90 focus:ring-accent/50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500/50",
    ghost: "text-primary hover:bg-surface focus:ring-primary/50",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:from-error/90 hover:to-red-600/90 focus:ring-error/50 shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="mr-2 h-4 w-4 animate-spin" 
        />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon 
          name={icon} 
          className="mr-2 h-4 w-4" 
        />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon 
          name={icon} 
          className="ml-2 h-4 w-4" 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;