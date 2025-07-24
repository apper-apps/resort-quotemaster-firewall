import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TabNavigation from "@/components/molecules/TabNavigation";
import QuoteGenerator from "@/components/pages/QuoteGenerator";
import LeadsReminders from "@/components/pages/LeadsReminders";
import BookingConfirmationsPage from "@/components/pages/BookingConfirmationsPage";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";

function App() {
  const [activeTab, setActiveTab] = useState("quotes");
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    const loadReminderCount = async () => {
      try {
        const leads = await leadService.getAll();
        const dueReminders = leads.filter(lead => 
          lead.reminderDateTimeUTC && new Date(lead.reminderDateTimeUTC) <= new Date()
        ).length;
        setReminderCount(dueReminders);
      } catch (error) {
        console.error("Failed to load reminder count:", error);
      }
    };

    loadReminderCount();
    
    // Refresh reminder count every minute
    const interval = setInterval(loadReminderCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      id: "quotes",
      label: "Quote Generator",
      icon: "FileText"
    },
    {
      id: "leads",
      label: "Leads & Reminders", 
      icon: "Users",
      badge: reminderCount > 0 ? reminderCount : null
    },
    {
      id: "confirmations",
      label: "Booking Confirmations",
      icon: "CheckCircle"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "quotes":
        return <QuoteGenerator />;
      case "leads":
        return <LeadsReminders />;
      case "confirmations":
        return <BookingConfirmationsPage />;
      default:
        return <QuoteGenerator />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Building" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-primary">
                  Resort QuoteMaster
                </h1>
                <p className="text-sm text-gray-600">Grand Resort Mahabaleshwar</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {reminderCount > 0 && (
                <div className="flex items-center space-x-2 text-warning">
                  <ApperIcon name="Bell" className="h-5 w-5" />
                  <span className="text-sm font-medium">{reminderCount} reminders due</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Tab Navigation */}
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;