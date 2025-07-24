import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import DateRangePicker from "@/components/molecules/DateRangePicker";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { parseInquiry, extractContactInfo } from "@/utils/inquiryParser";

const QuoteForm = ({ 
  appState = {}, 
  onStateChange = () => {},
  onGenerateQuote = () => {}
}) => {
  const [inquiryText, setInquiryText] = useState("");
  const [showInquiryParser, setShowInquiryParser] = useState(false);

  const handleInquiryParse = () => {
    if (!inquiryText.trim()) return;
    
    const parsed = parseInquiry(inquiryText);
    const contact = extractContactInfo(inquiryText);
    
    onStateChange({
      ...appState,
      dates: parsed.dates,
      rooms: parsed.rooms,
      contactInfo: contact
    });
    
    setShowInquiryParser(false);
    setInquiryText("");
  };

  const addRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      type: "deluxe",
      adults: 2,
      children: 0,
      infants: 0,
      pets: 0,
      withAC: true,
      perNightDiscounts: 0
    };
    
    onStateChange({
      ...appState,
      rooms: [...(appState.rooms || []), newRoom]
    });
  };

  const removeRoom = (roomId) => {
    onStateChange({
      ...appState,
      rooms: (appState.rooms || []).filter(room => room.id !== roomId)
    });
  };

  const updateRoom = (roomId, updates) => {
    onStateChange({
      ...appState,
      rooms: (appState.rooms || []).map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      )
    });
  };

  const updateDates = (field, value) => {
    onStateChange({
      ...appState,
      dates: {
        ...appState.dates,
        [field]: value
      }
    });
  };

  const updateMealPlans = (mealPlan, checked) => {
    const current = appState.mealPlans || [];
    const updated = checked 
      ? [...current, mealPlan]
      : current.filter(plan => plan !== mealPlan);
    
    onStateChange({
      ...appState,
      mealPlans: updated
    });
  };

  return (
    <div className="space-y-6">
      {/* Inquiry Parser Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Smart Inquiry Parser
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInquiryParser(!showInquiryParser)}
              icon={showInquiryParser ? "ChevronUp" : "ChevronDown"}
            >
              {showInquiryParser ? "Hide" : "Show"}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showInquiryParser && (
          <CardContent>
            <div className="space-y-4">
              <FormField label="Paste inquiry text (WhatsApp, Email, etc.)">
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Paste customer inquiry here... Example: Hi, we need 2 rooms for 4 adults from 15th Feb to 17th Feb. Looking for AC rooms with breakfast."
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                />
              </FormField>
              
              <Button 
                onClick={handleInquiryParse}
                disabled={!inquiryText.trim()}
                variant="accent"
                icon="Sparkles"
              >
                Parse Inquiry
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Manual Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Configuration</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <DateRangePicker
            checkIn={appState.dates?.checkIn || ""}
            checkOut={appState.dates?.checkOut || ""}
            onCheckInChange={(value) => updateDates("checkIn", value)}
            onCheckOutChange={(value) => updateDates("checkOut", value)}
          />

          {/* Client Type & Season */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Client Type">
              <Select
                value={appState.clientType || "individual"}
                onChange={(e) => onStateChange({
                  ...appState,
                  clientType: e.target.value
                })}
              >
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
                <option value="group">Group</option>
                <option value="agent">Travel Agent</option>
              </Select>
            </FormField>

            <FormField label="Overall Discount/Markup (%)">
              <Input
                type="number"
                value={appState.overallDisc || 0}
                onChange={(e) => onStateChange({
                  ...appState,
                  overallDisc: parseFloat(e.target.value) || 0
                })}
                placeholder="0"
              />
            </FormField>
          </div>

          {/* Meal Plans */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Meal Plans
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["EP", "CP", "MAP", "AP"].map(plan => (
                <label key={plan} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(appState.mealPlans || []).includes(plan)}
                    onChange={(e) => updateMealPlans(plan, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm">{plan}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rooms Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-display">Room Configuration</h3>
              <Button
                onClick={addRoom}
                variant="accent"
                size="sm"
                icon="Plus"
              >
                Add Room
              </Button>
            </div>

            <div className="space-y-4">
              {(appState.rooms || []).map((room, index) => (
                <Card key={room.id} className="relative">
                  <CardContent className="p-4">
                    {appState.rooms.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoom(room.id)}
                        className="absolute top-2 right-2 text-error hover:bg-error/10"
                        icon="X"
                      />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField label="Room Type">
                        <Select
                          value={room.type}
                          onChange={(e) => updateRoom(room.id, { type: e.target.value })}
                        >
                          <option value="deluxe">Deluxe</option>
                          <option value="super_deluxe">Super Deluxe</option>
                          <option value="suite">Suite</option>
                        </Select>
                      </FormField>

                      <FormField label="Adults">
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={room.adults}
                          onChange={(e) => updateRoom(room.id, { adults: parseInt(e.target.value) || 0 })}
                        />
                      </FormField>

                      <FormField label="Children">
                        <Input
                          type="number"
                          min="0"
                          max="4"
                          value={room.children}
                          onChange={(e) => updateRoom(room.id, { children: parseInt(e.target.value) || 0 })}
                        />
                      </FormField>

                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id={`ac-${room.id}`}
                          checked={room.withAC}
                          onChange={(e) => updateRoom(room.id, { withAC: e.target.checked })}
                          className="rounded border-gray-300 text-primary focus:ring-primary/50"
                        />
                        <label htmlFor={`ac-${room.id}`} className="text-sm font-medium">
                          Air Conditioned
                        </label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <FormField label="Per Night Discount/Markup (₹)">
                        <Input
                          type="number"
                          value={room.perNightDiscounts || 0}
                          onChange={(e) => updateRoom(room.id, { perNightDiscounts: parseFloat(e.target.value) || 0 })}
                          placeholder="0"
                        />
                      </FormField>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Generate Quote Button */}
          <div className="pt-4 border-t">
            <Button
              onClick={onGenerateQuote}
              variant="primary"
              size="lg"
              icon="FileText"
              className="w-full"
              disabled={
                !appState.dates?.checkIn || 
                !appState.dates?.checkOut || 
                !(appState.rooms || []).length
              }
            >
              Generate Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;