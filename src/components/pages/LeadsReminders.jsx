import React from "react";
import LeadsList from "@/components/organisms/LeadsList";

const LeadsReminders = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-primary mb-2">
            Leads & Reminders
          </h1>
          <p className="text-gray-600">
            Manage your customer pipeline and follow-ups
          </p>
        </div>

        <LeadsList />
      </div>
    </div>
  );
};

export default LeadsReminders;