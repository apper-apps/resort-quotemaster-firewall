import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "quote-form") {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 shimmer"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded shimmer"></div>
                <div className="h-10 bg-gray-200 rounded shimmer"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded shimmer"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "leads") {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 shimmer"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
                <div className="h-8 bg-gray-200 rounded shimmer"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
          <div className="h-6 bg-gray-200 rounded w-full shimmer"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;