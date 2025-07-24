import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "FileText",
  title = "No data found",
  description = "Get started by creating something new",
  actionLabel = "Get Started",
  onAction = null
}) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
        
        {onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;