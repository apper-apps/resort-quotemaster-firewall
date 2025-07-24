import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import LeadCard from "@/components/organisms/LeadCard";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";
import { toast } from "react-toastify";

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAll();
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.mobile.includes(term) ||
        new Date(lead.checkInDate).toLocaleDateString().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.quoteVariations?.[0]?.timestamp || 0) - new Date(a.quoteVariations?.[0]?.timestamp || 0));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.quoteVariations?.[0]?.timestamp || 0) - new Date(b.quoteVariations?.[0]?.timestamp || 0));
        break;
      case "checkin":
        filtered.sort((a, b) => new Date(a.checkInDate) - new Date(b.checkInDate));
        break;
      case "value":
        filtered.sort((a, b) => {
          const aValue = a.quoteVariations?.[a.quoteVariations.length - 1]?.totals?.total || 0;
          const bValue = b.quoteVariations?.[b.quoteVariations.length - 1]?.totals?.total || 0;
          return bValue - aValue;
        });
        break;
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sortBy]);

  const handleUpdateLead = async (leadId, updates) => {
    try {
      await leadService.update(leadId, updates);
      await loadLeads(); // Reload to get fresh data
    } catch (error) {
      console.error("Failed to update lead:", error);
      toast.error("Failed to update lead");
    }
  };

  const dueReminders = leads.filter(lead => 
    lead.reminderDateTimeUTC && new Date(lead.reminderDateTimeUTC) <= new Date()
  ).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Leads & Reminders</span>
            {dueReminders > 0 && (
              <div className="flex items-center space-x-2 text-warning">
                <ApperIcon name="Bell" className="h-5 w-5" />
                <span className="text-sm font-medium">{dueReminders} due</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="contacted">Contacted</option>
              <option value="negotiation">Negotiation</option>
              <option value="nurturing">Nurturing</option>
              <option value="won">Won</option>
              <option value="lost_price">Lost</option>
            </Select>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="checkin">Check-in Date</option>
              <option value="value">Quote Value</option>
            </Select>

            <Button
              variant="outline"
              icon="RefreshCw"
              onClick={loadLeads}
            >
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
              <div className="text-sm text-blue-800">Total Leads</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">
                {leads.filter(l => l.status === "open").length}
              </div>
              <div className="text-sm text-yellow-800">Open</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {leads.filter(l => l.status === "negotiation").length}
              </div>
              <div className="text-sm text-purple-800">Negotiation</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {leads.filter(l => l.status === "won").length}
              </div>
              <div className="text-sm text-green-800">Won</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">
                {leads.filter(l => l.status.startsWith("lost")).length}
              </div>
              <div className="text-sm text-red-800">Lost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ApperIcon name="Users" className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your filters to see more results"
                : "Generate your first quote to create a lead"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button variant="primary" icon="Plus">
                Create First Quote
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map(lead => (
            <LeadCard
              key={lead.Id}
              lead={lead}
              onUpdateLead={handleUpdateLead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsList;