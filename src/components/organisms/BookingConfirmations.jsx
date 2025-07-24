import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "react-toastify";

const BookingConfirmations = () => {
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConfirmedBookings = async () => {
    try {
      setLoading(true);
      const wonLeads = await leadService.getByStatus("won");
      setConfirmedBookings(wonLeads);
    } catch (error) {
      console.error("Failed to load confirmed bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfirmedBookings();
  }, []);

  const sendConfirmation = (lead) => {
    const latestQuote = lead.quoteVariations?.[lead.quoteVariations.length - 1];
    if (!latestQuote?.bookingConfirmation || !lead.mobile) return;

    const message = encodeURIComponent(latestQuote.bookingConfirmation.confirmationText);
    const cleanMobile = lead.mobile.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanMobile}?text=${message}`, "_blank");
  };

  const copyConfirmation = (lead) => {
    const latestQuote = lead.quoteVariations?.[lead.quoteVariations.length - 1];
    if (!latestQuote?.bookingConfirmation) return;

    navigator.clipboard.writeText(latestQuote.bookingConfirmation.confirmationText);
    toast.success("Confirmation text copied!");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (confirmedBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ApperIcon name="CheckCircle" className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No confirmed bookings</h3>
          <p className="text-gray-500 mb-6">
            When leads are marked as "Won", their booking confirmations will appear here
          </p>
          <Button variant="primary" icon="ArrowLeft">
            Go to Leads
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalBookings = confirmedBookings.length;
  const totalRevenue = confirmedBookings.reduce((sum, lead) => {
    const latestQuote = lead.quoteVariations?.[lead.quoteVariations.length - 1];
    return sum + (latestQuote?.totals?.total || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">{totalBookings}</div>
            <div className="text-sm text-gray-600">Confirmed Bookings</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              ₹{totalBookings > 0 ? Math.round(totalRevenue / totalBookings).toLocaleString() : "0"}
            </div>
            <div className="text-sm text-gray-600">Avg Booking Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Confirmations List */}
      <div className="space-y-4">
        {confirmedBookings.map(lead => {
          const latestQuote = lead.quoteVariations?.[lead.quoteVariations.length - 1];
          const confirmation = latestQuote?.bookingConfirmation;
          
          return (
            <Card key={lead.Id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">
                      {formatDate(lead.checkInDate)} - {formatDate(lead.checkOutDate)}
                    </p>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact & Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Phone" className="h-4 w-4 text-gray-500" />
                        <span>{lead.mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Booking Value</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-semibold">₹{latestQuote?.totals?.total?.toLocaleString() || "0"}</span>
                      </div>
                      {confirmation?.advanceAmount && (
                        <div className="flex justify-between text-success">
                          <span>Advance Received:</span>
                          <span className="font-semibold">₹{confirmation.advanceAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirmation Message */}
                {confirmation && (
                  <div>
                    <h4 className="font-medium mb-2">Confirmation Message</h4>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <pre className="whitespace-pre-wrap font-sans">
                        {confirmation.confirmationText}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Confirmed: {confirmation ? formatDate(new Date(confirmation.generatedAt)) : "N/A"}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyConfirmation(lead)}
                      icon="Copy"
                      disabled={!confirmation}
                    >
                      Copy
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => sendConfirmation(lead)}
                      icon="MessageCircle"
                      disabled={!confirmation || !lead.mobile}
                    >
                      Send via WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BookingConfirmations;