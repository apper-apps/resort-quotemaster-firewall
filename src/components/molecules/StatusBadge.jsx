import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true }) => {
  const statusConfig = {
    open: {
      variant: "info",
      label: "Open",
      icon: "Clock"
    },
    contacted: {
      variant: "primary", 
      label: "Contacted",
      icon: "Phone"
    },
    negotiation: {
      variant: "warning",
      label: "Negotiation", 
      icon: "MessageCircle"
    },
    nurturing: {
      variant: "secondary",
      label: "Nurturing",
      icon: "Heart"
    },
    won: {
      variant: "success",
      label: "Won",
      icon: "CheckCircle"
    },
    lost_price: {
      variant: "error",
      label: "Lost - Price",
      icon: "XCircle"
    },
    lost_competitor: {
      variant: "error", 
      label: "Lost - Competitor",
      icon: "XCircle"
    },
    lost_timing: {
      variant: "error",
      label: "Lost - Timing", 
      icon: "XCircle"
    },
    lost_other: {
      variant: "error",
      label: "Lost - Other",
      icon: "XCircle"
    }
  };

  const config = statusConfig[status] || statusConfig.open;

  return (
    <Badge variant={config.variant} className="inline-flex items-center gap-1">
      {showIcon && (
        <ApperIcon name={config.icon} className="h-3 w-3" />
      )}
      {config.label}
    </Badge>
  );
};

export default StatusBadge;