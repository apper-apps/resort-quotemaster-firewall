import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const QuoteOutput = ({ quote, onSaveAsLead = () => {} }) => {
  const [format, setFormat] = useState("text");
  const [customerName, setCustomerName] = useState("");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quote?.generatedText || "");
      toast.success("Quote copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy quote");
    }
  };

  const sendViaWhatsApp = () => {
    if (!quote?.generatedText) return;
    
    const message = encodeURIComponent(quote.generatedText);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSaveAsLead = () => {
    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    
    onSaveAsLead(customerName.trim());
    setCustomerName("");
  };

  if (!quote) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <ApperIcon name="FileText" className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Generate a quote to see the output here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Quote Output
            <div className="flex items-center space-x-2">
              <Badge variant="success">Generated</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                icon="Copy"
              >
                Copy
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Format Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={format === "text" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFormat("text")}
            >
              Text
            </Button>
            <Button
              variant={format === "html" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFormat("html")}
            >
              HTML
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={sendViaWhatsApp}
              icon="MessageCircle"
            >
              WhatsApp
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              icon="Copy"
            >
              Copy Text
            </Button>
          </div>

          {/* Save as Lead */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Save as Lead</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <Button
                onClick={handleSaveAsLead}
                variant="primary"
                size="sm"
                icon="UserPlus"
              >
                Save Lead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Preview</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {format === "text" ? (
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {quote.generatedText}
              </pre>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: quote.generatedText || "" }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quote Details */}
      {quote.totals && (
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  ₹{quote.totals.total?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {quote.configuration?.nights || 0}
                </div>
                <div className="text-sm text-gray-600">Nights</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-accent">
                  {quote.configuration?.rooms?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Rooms</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-info">
                  ₹{quote.totals.avgRoomRate?.toFixed(0) || "0"}
                </div>
                <div className="text-sm text-gray-600">Avg/Room/Night</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuoteOutput;