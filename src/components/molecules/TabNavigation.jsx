import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TabNavigation = ({ tabs, activeTab, onTabChange, className }) => {
  return (
    <div className={cn("border-b border-gray-200", className)}>
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <ApperIcon name={tab.icon} className="h-5 w-5" />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge && (
              <span className="bg-accent text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;