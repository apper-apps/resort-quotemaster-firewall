import React from "react";
import BookingConfirmations from "@/components/organisms/BookingConfirmations";

const BookingConfirmationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-primary mb-2">
            Booking Confirmations
          </h1>
          <p className="text-gray-600">
            Manage confirmed bookings and send confirmation messages
          </p>
        </div>

        <BookingConfirmations />
      </div>
    </div>
  );
};

export default BookingConfirmationsPage;