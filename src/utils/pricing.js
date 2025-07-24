export const calculateQuoteTotals = (rooms, dates, tariffs, mealPlans = [], overallDiscount = 0) => {
  if (!rooms.length || !dates.checkIn || !dates.checkOut) {
    return {
      subtotal: 0,
      mealPlanTotal: 0,
      discount: 0,
      gstAmount: 0,
      total: 0,
      breakdown: []
    };
  }

  const nights = Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24));
  let subtotal = 0;
  let mealPlanTotal = 0;
  const breakdown = [];

  // Calculate room costs
  rooms.forEach((room, index) => {
    const season = getSeason(dates.checkIn);
    const baseRate = getRoomRate(room.type, season, room.withAC, tariffs);
    const roomTotal = baseRate * nights;
    const roomDiscount = (room.perNightDiscounts || 0) * nights;
    const roomSubtotal = roomTotal - roomDiscount;
    
    subtotal += roomSubtotal;
    
    breakdown.push({
      room: `Room ${index + 1}`,
      type: room.type,
      nights,
      baseRate,
      total: roomTotal,
      discount: roomDiscount,
      subtotal: roomSubtotal
    });
  });

  // Calculate meal plan costs
  if (mealPlans.length) {
    const totalGuests = rooms.reduce((sum, room) => sum + room.adults + room.children, 0);
    mealPlans.forEach(plan => {
      const planRate = tariffs.mealPlans[plan]?.rate || 0;
      const planTotal = planRate * totalGuests * nights;
      mealPlanTotal += planTotal;
    });
  }

  // Apply overall discount
  const discountAmount = ((subtotal + mealPlanTotal) * Math.abs(overallDiscount)) / 100;
  const afterDiscount = (subtotal + mealPlanTotal) - (overallDiscount > 0 ? discountAmount : -discountAmount);

  // Calculate GST
  const avgRoomRate = afterDiscount / (rooms.length * nights);
  const gstRate = avgRoomRate > tariffs.gstThreshold ? tariffs.gstRates.above : tariffs.gstRates.below;
  const gstAmount = afterDiscount * gstRate;
  
  const total = afterDiscount + gstAmount;

  return {
    subtotal,
    mealPlanTotal,
    discount: overallDiscount > 0 ? discountAmount : -discountAmount,
    gstAmount,
    total,
    breakdown,
    avgRoomRate,
    gstRate: gstRate * 100
  };
};

export const getSeason = (date) => {
  const month = new Date(date).getMonth() + 1;
  
  if (month >= 12 || month <= 2) return "peak";
  if (month >= 3 && month <= 5) return "high"; 
  if (month >= 6 && month <= 9) return "low";
  return "regular";
};

export const getRoomRate = (roomType, season, withAC, tariffs) => {
  try {
    const seasonData = tariffs.seasons[season];
    if (!seasonData) return 0;
    
    const roomRates = seasonData.rates[roomType];
    if (!roomRates) return 0;
    
    return withAC ? roomRates.withAC : roomRates.withoutAC;
  } catch (error) {
    console.error("Error getting room rate:", error);
    return 0;
  }
};

export const generateQuoteText = (configuration, totals, customerName = "Valued Guest") => {
  const { rooms, dates, mealPlans } = configuration;
  const nights = Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24));
  
  let quoteText = `Dear ${customerName},\n\n`;
  quoteText += `Thank you for your interest in Grand Resort Mahabaleshwar.\n\n`;
  quoteText += `QUOTE DETAILS:\n`;
  quoteText += `Check-in: ${new Date(dates.checkIn).toLocaleDateString()}\n`;
  quoteText += `Check-out: ${new Date(dates.checkOut).toLocaleDateString()}\n`;
  quoteText += `Nights: ${nights}\n\n`;
  
  quoteText += `ACCOMMODATION:\n`;
  rooms.forEach((room, index) => {
    quoteText += `Room ${index + 1}: ${room.type} (${room.withAC ? "AC" : "Non-AC"})\n`;
    quoteText += `Occupancy: ${room.adults} Adults`;
    if (room.children > 0) quoteText += `, ${room.children} Children`;
    if (room.infants > 0) quoteText += `, ${room.infants} Infants`;
    if (room.pets > 0) quoteText += `, ${room.pets} Pets`;
    quoteText += `\n`;
  });
  
  if (mealPlans.length) {
    quoteText += `\nMEAL PLANS: ${mealPlans.join(", ")}\n`;
  }
  
  quoteText += `\nPRICING:\n`;
  quoteText += `Subtotal: ₹${totals.subtotal.toLocaleString()}\n`;
  if (totals.mealPlanTotal > 0) {
    quoteText += `Meal Plans: ₹${totals.mealPlanTotal.toLocaleString()}\n`;
  }
  if (totals.discount !== 0) {
    quoteText += `Discount: ${totals.discount > 0 ? "-" : "+"}₹${Math.abs(totals.discount).toLocaleString()}\n`;
  }
  quoteText += `GST (${totals.gstRate}%): ₹${totals.gstAmount.toLocaleString()}\n`;
  quoteText += `TOTAL: ₹${totals.total.toLocaleString()}\n\n`;
  
  quoteText += `This quote is valid for 7 days. Terms and conditions apply.\n\n`;
  quoteText += `For bookings, contact: +91-XXXXXXXXXX\n`;
  quoteText += `Grand Resort Mahabaleshwar`;
  
  return quoteText;
};