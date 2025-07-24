import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import { toast } from "react-toastify";

const LeadCard = ({ lead, onUpdateLead = () => {} }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(lead.status);

  const handleStatusUpdate = () => {
    if (newStatus !== lead.status) {
      onUpdateLead(lead.Id, { status: newStatus });
      toast.success("Lead status updated!");
    }
    setEditingStatus(false);
  };

  const copyMobile = () => {
    if (lead.mobile) {
      navigator.clipboard.writeText(lead.mobile);
      toast.success("Mobile number copied!");
    }
  };

  const callCustomer = () => {
    if (lead.mobile) {
      window.open(`tel:${lead.mobile}`, "_self");
    }
  };

  const openWhatsApp = () => {
    if (lead.mobile) {
      const cleanMobile = lead.mobile.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanMobile}`, "_blank");
    }
  };

  const latestQuote = lead.quoteVariations && lead.quoteVariations.length > 0 
    ? lead.quoteVariations[lead.quoteVariations.length - 1] 
    : null;

  const isReminderDue = lead.reminderDateTimeUTC && 
    new Date(lead.reminderDateTimeUTC) <= new Date();

  return (
    <Card className={`relative ${isReminderDue ? "ring-2 ring-warning" : ""}`}>
      {isReminderDue && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-warning text-white rounded-full p-1">
            <ApperIcon name="Bell" className="h-4 w-4" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-semibold">{lead.name}</h3>
              <p className="text-sm text-gray-600 font-normal">
                {formatDate(lead.checkInDate)} - {formatDate(lead.checkOutDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {editingStatus ? (
              <div className="flex items-center space-x-1">
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="text-xs"
                >
                  <option value="open">Open</option>
                  <option value="contacted">Contacted</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="nurturing">Nurturing</option>
                  <option value="won">Won</option>
                  <option value="lost_price">Lost - Price</option>
                  <option value="lost_competitor">Lost - Competitor</option>
                  <option value="lost_timing">Lost - Timing</option>
                  <option value="lost_other">Lost - Other</option>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStatusUpdate}
                  icon="Check"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingStatus(false);
                    setNewStatus(lead.status);
                  }}
                  icon="X"
                />
              </div>
            ) : (
              <button
                onClick={() => setEditingStatus(true)}
                className="hover:bg-gray-50 rounded p-1"
              >
                <StatusBadge status={lead.status} />
              </button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="flex items-center space-x-2 text-sm">
          <ApperIcon name="Phone" className="h-4 w-4 text-gray-500" />
          <span className="flex-1">{lead.mobile}</span>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyMobile}
              icon="Copy"
              className="h-6 w-6 p-0"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={callCustomer}
              icon="Phone"
              className="h-6 w-6 p-0"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={openWhatsApp}
              icon="MessageCircle"
              className="h-6 w-6 p-0"
            />
          </div>
        </div>

        {/* Latest Quote Summary */}
        {latestQuote && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Latest Quote:</span>
              <span className="font-bold text-primary">
                ₹{latestQuote.totals?.total?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {latestQuote.configuration?.rooms?.length || 0} rooms • 
              Generated {formatDate(new Date(latestQuote.timestamp))}
            </div>
          </div>
        )}

        {/* Reminder Info */}
        {lead.reminderDateTimeUTC && (
          <div className={`flex items-center space-x-2 text-sm p-2 rounded ${
            isReminderDue ? "bg-warning/10 text-warning" : "bg-gray-50 text-gray-600"
          }`}>
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>
              {isReminderDue ? "Reminder Due: " : "Follow up: "}
              {formatDateTime(lead.reminderDateTimeUTC)}
            </span>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
            <div className="flex items-start space-x-2">
              <ApperIcon name="StickyNote" className="h-4 w-4 mt-0.5" />
              <span>{lead.notes}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            icon={showDetails ? "ChevronUp" : "ChevronDown"}
          >
            {showDetails ? "Less" : "Details"}
          </Button>

          <div className="flex space-x-2">
            {lead.status === "won" && (
              <Button
                size="sm"
                variant="success"
                icon="CheckCircle"
              >
                Booking Confirmed
              </Button>
            )}
            
            {!["won", "lost_price", "lost_competitor", "lost_timing", "lost_other"].includes(lead.status) && (
              <Button
                size="sm"
                variant="primary"
                icon="Edit"
              >
                Update
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="pt-4 border-t space-y-3">
            <h4 className="font-medium">Quote History ({lead.quoteVariations?.length || 0})</h4>
            
            {lead.quoteVariations && lead.quoteVariations.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {lead.quoteVariations.map((quote, index) => (
                  <div key={quote.Id} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Quote #{index + 1}</span>
                      <span className="font-medium">₹{quote.totals?.total?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatDateTime(new Date(quote.timestamp))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No quotes generated yet</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCard;