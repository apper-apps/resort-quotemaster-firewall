export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isValidDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return start >= today && end > start;
};

export const getNextReminder = (status, lastContact = null) => {
  const now = new Date();
  let reminderDate = new Date(now);
  
  switch (status) {
    case "open":
      reminderDate.setHours(now.getHours() + 2); // 2 hours
      break;
    case "contacted":
      reminderDate.setDate(now.getDate() + 1); // 1 day
      break;
    case "negotiation":
      reminderDate.setHours(now.getHours() + 6); // 6 hours
      break;
    case "nurturing":
      reminderDate.setDate(now.getDate() + 3); // 3 days
      break;
    default:
      return null; // No reminders for won/lost leads
  }
  
  return reminderDate.toISOString();
};