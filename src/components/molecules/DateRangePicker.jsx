import React from "react";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import { isValidDateRange } from "@/utils/dateUtils";

const DateRangePicker = ({ 
  checkIn, 
  checkOut, 
  onCheckInChange, 
  onCheckOutChange,
  className = "" 
}) => {
  const isValid = isValidDateRange(checkIn, checkOut);
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      <FormField
        label="Check-in Date"
        required
        error={checkIn && !isValid ? "Invalid check-in date" : ""}
      >
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          error={checkIn && !isValid}
        />
      </FormField>
      
      <FormField
        label="Check-out Date"
        required
        error={checkOut && !isValid ? "Invalid check-out date" : ""}
      >
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          min={checkIn || new Date().toISOString().split("T")[0]}
          error={checkOut && !isValid}
        />
      </FormField>
    </div>
  );
};

export default DateRangePicker;