import mockTariffs from "@/services/mockData/tariffs.json";

let tariffs = { ...mockTariffs };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const tariffService = {
  async getTariffs() {
    await delay(200);
    return { ...tariffs };
  },

  async updateTariffs(updates) {
    await delay(300);
    tariffs = { ...tariffs, ...updates };
    return { ...tariffs };
  },

  async getSeason(date) {
    await delay(100);
    // Simple season logic - can be enhanced
    const month = new Date(date).getMonth() + 1;
    
    if (month >= 12 || month <= 2) return "peak";
    if (month >= 3 && month <= 5) return "high";
    if (month >= 6 && month <= 9) return "low";
    return "regular";
  },

  async getRoomRate(roomType, season, withAC = true) {
    await delay(100);
    const seasonData = tariffs.seasons[season];
    if (!seasonData) return 0;
    
    const roomRates = seasonData.rates[roomType];
    if (!roomRates) return 0;
    
    return withAC ? roomRates.withAC : roomRates.withoutAC;
  }
};