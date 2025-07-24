import mockLeads from "@/services/mockData/leads.json";

let leads = [...mockLeads];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leadService = {
  async getAll() {
    await delay(300);
    return [...leads];
  },

  async getById(id) {
    await delay(200);
    const lead = leads.find(l => l.Id === parseInt(id));
    return lead ? { ...lead } : null;
  },

  async create(leadData) {
    await delay(400);
    const newId = Math.max(...leads.map(l => l.Id), 0) + 1;
    const newLead = {
      Id: newId,
      ...leadData,
      quoteVariations: leadData.quoteVariations || [],
      notes: leadData.notes || ""
    };
    leads.push(newLead);
    return { ...newLead };
  },

  async update(id, updates) {
    await delay(300);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) return null;
    
    leads[index] = { ...leads[index], ...updates };
    return { ...leads[index] };
  },

  async delete(id) {
    await delay(200);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) return false;
    
    leads.splice(index, 1);
    return true;
  },

  async getByStatus(status) {
    await delay(250);
    return leads.filter(l => l.status === status).map(l => ({ ...l }));
  }
};