// Utility function to format date in YY-MM-DD Fri format
export function formatDateForDraft(date) {
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

  return `${year}-${month}-${day} ${dayName}`;
}

// Get today's date formatted
export function getTodayFormatted() {
  return formatDateForDraft(new Date());
}

// Get tomorrow's date formatted
export function getTomorrowFormatted() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForDraft(tomorrow);
}
