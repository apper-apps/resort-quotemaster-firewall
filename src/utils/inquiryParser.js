export const parseInquiry = (inquiryText) => {
  const parsed = {
    dates: { checkIn: "", checkOut: "" },
    rooms: [],
    guestCount: { adults: 0, children: 0 },
    preferences: []
  };

  if (!inquiryText) return parsed;

  const text = inquiryText.toLowerCase();

  // Parse dates
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g,
    /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi,
    /(check.?in|arrival)[\s:]*(\d{1,2})[\/\-](\d{1,2})/gi,
    /(check.?out|departure)[\s:]*(\d{1,2})[\/\-](\d{1,2})/gi
  ];

  let dates = [];
  datePatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    dates = dates.concat(matches);
  });

  if (dates.length >= 2) {
    const checkIn = new Date();
    const checkOut = new Date();
    checkOut.setDate(checkIn.getDate() + 2); // Default 2 nights
    
    parsed.dates.checkIn = checkIn.toISOString().split("T")[0];
    parsed.dates.checkOut = checkOut.toISOString().split("T")[0];
  }

  // Parse guest count
  const adultPatterns = [
    /(\d+)\s*adults?/gi,
    /(\d+)\s*pax/gi,
    /(\d+)\s*persons?/gi,
    /(\d+)\s*people/gi
  ];

  const childPatterns = [
    /(\d+)\s*child(?:ren)?/gi,
    /(\d+)\s*kids?/gi
  ];

  adultPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      parsed.guestCount.adults = Math.max(parsed.guestCount.adults, parseInt(match[1]) || 0);
    }
  });

  childPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      parsed.guestCount.children = Math.max(parsed.guestCount.children, parseInt(match[1]) || 0);
    }
  });

  // Default to 2 adults if no guests specified
  if (parsed.guestCount.adults === 0) {
    parsed.guestCount.adults = 2;
  }

  // Parse room preferences
  if (text.includes("ac") || text.includes("air con")) {
    parsed.preferences.push("AC preferred");
  }
  if (text.includes("deluxe")) {
    parsed.preferences.push("Deluxe room");
  }
  if (text.includes("suite")) {
    parsed.preferences.push("Suite preferred");
  }
  if (text.includes("garden") || text.includes("view")) {
    parsed.preferences.push("Garden view");
  }

  // Generate default room configuration
  const roomsNeeded = Math.ceil((parsed.guestCount.adults + parsed.guestCount.children) / 3);
  for (let i = 0; i < Math.max(1, roomsNeeded); i++) {
    parsed.rooms.push({
      id: `room-${i + 1}`,
      type: "deluxe",
      adults: Math.min(2, Math.max(0, parsed.guestCount.adults - (i * 2))),
      children: i === 0 ? parsed.guestCount.children : 0,
      infants: 0,
      pets: 0,
      withAC: true,
      perNightDiscounts: 0
    });
  }

  return parsed;
};

export const extractContactInfo = (inquiryText) => {
  const contact = {
    name: "",
    mobile: "",
    email: ""
  };

  if (!inquiryText) return contact;

  // Extract mobile number
  const mobilePattern = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
  const mobileMatch = inquiryText.match(mobilePattern);
  if (mobileMatch) {
    contact.mobile = mobileMatch[0];
  }

  // Extract email
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = inquiryText.match(emailPattern);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }

  // Extract name (simple heuristic)
  const lines = inquiryText.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && trimmed.length < 50 && /^[a-zA-Z\s]+$/.test(trimmed)) {
      if (!trimmed.toLowerCase().includes("booking") && 
          !trimmed.toLowerCase().includes("resort") &&
          !trimmed.toLowerCase().includes("inquiry")) {
        contact.name = trimmed;
        break;
      }
    }
  }

  return contact;
};