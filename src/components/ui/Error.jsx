import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  showIcon = true 
}) => {
  return (
    <Card className="border-error/20">
      <CardContent className="p-8 text-center">
        {showIcon && (
          <div className="mb-4">
            <ApperIcon name="AlertTriangle" className="h-12 w-12 mx-auto text-error" />
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-error mb-2">Oops!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            icon="RefreshCw"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;