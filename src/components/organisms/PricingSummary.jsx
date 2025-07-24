import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { calculateQuoteTotals } from "@/utils/pricing";
import { calculateNights } from "@/utils/dateUtils";
import { tariffService } from "@/services/api/tariffService";

const PricingSummary = ({ appState = {} }) => {
  const [tariffs, setTariffs] = useState(null);
  const [totals, setTotals] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTariffs = async () => {
      try {
        setLoading(true);
        const data = await tariffService.getTariffs();
        setTariffs(data);
      } catch (error) {
        console.error("Failed to load tariffs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTariffs();
  }, []);

  useEffect(() => {
    if (tariffs && appState.dates && appState.rooms?.length) {
      const calculated = calculateQuoteTotals(
        appState.rooms,
        appState.dates,
        tariffs,
        appState.mealPlans || [],
        appState.overallDisc || 0
      );
      setTotals(calculated);
    } else {
      setTotals(null);
    }
  }, [appState, tariffs]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!totals) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <ApperIcon name="Calculator" className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Configure dates and rooms to see pricing</p>
        </CardContent>
      </Card>
    );
  }

  const nights = calculateNights(appState.dates?.checkIn, appState.dates?.checkOut);
  const isGstSaverOpportunity = totals.avgRoomRate > 7000 && totals.avgRoomRate < 7800;

  return (
    <div className="space-y-4">
      {/* GST Saver Alert */}
      {isGstSaverOpportunity && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning">GST Saver Opportunity!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  A small discount could save the customer 6% GST. Current avg: ₹{totals.avgRoomRate.toFixed(0)}/night
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Pricing Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pricing Summary
            <Badge variant="info">{nights} nights</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Summary */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">
                ₹{totals.total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>Avg per room/night:</span>
              <span>₹{totals.avgRoomRate.toFixed(0)}</span>
            </div>
          </div>

          {/* Breakdown Toggle */}
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-primary hover:text-secondary transition-colors"
          >
            <span>View Breakdown</span>
            <ApperIcon 
              name={showBreakdown ? "ChevronUp" : "ChevronDown"} 
              className="h-4 w-4" 
            />
          </button>

          {/* Detailed Breakdown */}
          {showBreakdown && (
            <div className="space-y-3 pt-2 border-t">
              <div className="flex justify-between">
                <span>Room Subtotal:</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>
              
              {totals.mealPlanTotal > 0 && (
                <div className="flex justify-between">
                  <span>Meal Plans:</span>
                  <span>₹{totals.mealPlanTotal.toLocaleString()}</span>
                </div>
              )}
              
              {totals.discount !== 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount:</span>
                  <span>-₹{Math.abs(totals.discount).toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>GST ({totals.gstRate}%):</span>
                <span>₹{totals.gstAmount.toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Final Total:</span>
                <span>₹{totals.total.toLocaleString()}</span>
              </div>

              {/* Room-wise breakdown */}
              {totals.breakdown && totals.breakdown.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-3">Room-wise Details:</h4>
                  <div className="space-y-2">
                    {totals.breakdown.map((room, index) => (
                      <div key={index} className="text-sm bg-gray-50 rounded p-2">
                        <div className="flex justify-between font-medium">
                          <span>{room.room} ({room.type})</span>
                          <span>₹{room.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-600 text-xs">
                          ₹{room.baseRate} × {room.nights} nights
                          {room.discount > 0 && ` - ₹${room.discount} discount`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSummary;