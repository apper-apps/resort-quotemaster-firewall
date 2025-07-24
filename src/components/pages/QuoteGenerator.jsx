import React, { useState, useEffect } from "react";
import QuoteForm from "@/components/organisms/QuoteForm";
import PricingSummary from "@/components/organisms/PricingSummary";
import QuoteOutput from "@/components/organisms/QuoteOutput";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { calculateQuoteTotals, generateQuoteText } from "@/utils/pricing";
import { tariffService } from "@/services/api/tariffService";
import { leadService } from "@/services/api/leadService";
import { calculateNights, getNextReminder } from "@/utils/dateUtils";
import { toast } from "react-toastify";

const QuoteGenerator = () => {
  const [appState, setAppState] = useLocalStorage("resort-quotemaster-state", {
    dates: { checkIn: "", checkOut: "" },
    rooms: [],
    mealPlans: [],
    overallDisc: 0,
    clientType: "individual"
  });

  const [generatedQuote, setGeneratedQuote] = useState(null);
  const [tariffs, setTariffs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTariffs = async () => {
      try {
        const data = await tariffService.getTariffs();
        setTariffs(data);
      } catch (error) {
        console.error("Failed to load tariffs:", error);
        toast.error("Failed to load pricing data");
      }
    };

    loadTariffs();
  }, []);

  const handleGenerateQuote = async () => {
    if (!tariffs) {
      toast.error("Pricing data not loaded");
      return;
    }

    if (!appState.dates?.checkIn || !appState.dates?.checkOut || !appState.rooms?.length) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Calculate totals
      const totals = calculateQuoteTotals(
        appState.rooms,
        appState.dates,
        tariffs,
        appState.mealPlans,
        appState.overallDisc
      );

      // Generate quote text
      const quoteText = generateQuoteText(
        {
          rooms: appState.rooms,
          dates: appState.dates,
          mealPlans: appState.mealPlans,
          nights: calculateNights(appState.dates.checkIn, appState.dates.checkOut)
        },
        totals,
        appState.contactInfo?.name || "Valued Guest"
      );

      // Create quote object
      const quote = {
        Id: Date.now(),
        timestamp: Date.now(),
        configuration: {
          rooms: appState.rooms,
          dates: appState.dates,
          mealPlans: appState.mealPlans,
          clientType: appState.clientType,
          overallDisc: appState.overallDisc,
          nights: calculateNights(appState.dates.checkIn, appState.dates.checkOut)
        },
        totals,
        generatedText: quoteText,
        bookingConfirmation: null
      };

      setGeneratedQuote(quote);
      toast.success("Quote generated successfully!");

    } catch (error) {
      console.error("Failed to generate quote:", error);
      toast.error("Failed to generate quote");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsLead = async (customerName) => {
    if (!generatedQuote) {
      toast.error("No quote to save");
      return;
    }

    try {
      const mobile = appState.contactInfo?.mobile || "+91-XXXXXXXXXX";
      
      // Check if lead already exists
      const existingLeads = await leadService.getAll();
      const existingLead = existingLeads.find(lead => 
        lead.mobile === mobile && 
        lead.checkInDate === appState.dates.checkIn
      );

      if (existingLead) {
        // Update existing lead with new quote variation
        const updatedVariations = [...existingLead.quoteVariations, generatedQuote];
        await leadService.update(existingLead.Id, {
          quoteVariations: updatedVariations,
          reminderDateTimeUTC: getNextReminder("open")
        });
        toast.success("Quote added to existing lead!");
      } else {
        // Create new lead
        const newLead = {
          name: customerName,
          mobile: mobile,
          checkInDate: appState.dates.checkIn,
          checkOutDate: appState.dates.checkOut,
          status: "open",
          quoteVariations: [generatedQuote],
          reminderDateTimeUTC: getNextReminder("open"),
          notes: appState.contactInfo?.preferences?.join(", ") || ""
        };

        await leadService.create(newLead);
        toast.success("New lead created successfully!");
      }

    } catch (error) {
      console.error("Failed to save lead:", error);
      toast.error("Failed to save lead");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-primary mb-2">
            Quote Generator
          </h1>
          <p className="text-gray-600">
            Create professional quotes for Grand Resort Mahabaleshwar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quote Form */}
          <div className="lg:col-span-2">
            <QuoteForm
              appState={appState}
              onStateChange={setAppState}
              onGenerateQuote={handleGenerateQuote}
            />
          </div>

          {/* Right Column - Pricing & Output */}
          <div className="space-y-6">
            <PricingSummary appState={appState} />
            {generatedQuote && (
              <QuoteOutput
                quote={generatedQuote}
                onSaveAsLead={handleSaveAsLead}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteGenerator;