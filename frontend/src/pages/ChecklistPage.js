import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronDown,
  ChevronRight,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { toast } from "sonner";

const statusConfig = {
  complete: {
    label: "Complete",
    icon: CheckCircle2,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    iconColor: "text-emerald-600"
  },
  needs_review: {
    label: "Needs Review",
    icon: AlertCircle,
    bg: "bg-amber-100",
    text: "text-amber-700",
    iconColor: "text-amber-600"
  },
  not_started: {
    label: "Not Started",
    icon: Clock,
    bg: "bg-slate-100",
    text: "text-slate-700",
    iconColor: "text-slate-500"
  }
};

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  
  const { business } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!business) {
      navigate("/onboarding");
      return;
    }
    fetchChecklist();
  }, [business]);

  const fetchChecklist = async () => {
    try {
      const response = await api.get("/checklist");
      setChecklist(response.data);
      
      // Expand all categories by default
      const categories = [...new Set(response.data.map(item => item.category))];
      const expanded = {};
      categories.forEach(cat => expanded[cat] = true);
      setExpandedCategories(expanded);
    } catch (error) {
      toast.error("Failed to load checklist");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (itemId, newStatus) => {
    try {
      await api.put(`/checklist/${itemId}/status?status=${newStatus}`);
      setChecklist(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus, last_reviewed: newStatus === 'complete' ? new Date().toISOString() : item.last_reviewed }
          : item
      ));
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredChecklist = checklist.filter(item => 
    statusFilter === "all" || item.status === statusFilter
  );

  const groupedChecklist = filteredChecklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Calculate stats
  const total = checklist.length;
  const completed = checklist.filter(i => i.status === "complete").length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading checklist...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="checklist-page" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
              Compliance Checklist
            </h1>
            <p className="text-slate-600 mt-1">
              Track your compliance progress across all required documents
            </p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white" data-testid="checklist-status-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-900">Overall Progress</h3>
            <span className="text-2xl font-bold text-slate-900">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3 mb-2" />
          <p className="text-sm text-slate-600">
            {completed} of {total} items complete
          </p>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {Object.entries(groupedChecklist).map(([category, items]) => (
            <Collapsible 
              key={category} 
              open={expandedCategories[category]}
              onOpenChange={() => toggleCategory(category)}
            >
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-semibold text-slate-900">{category}</span>
                    <span className="text-sm text-slate-500">
                      ({items.filter(i => i.status === 'complete').length}/{items.length} complete)
                    </span>
                  </div>
                  {expandedCategories[category] ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="border-t border-slate-100">
                    {items.map((item, index) => {
                      const config = statusConfig[item.status];
                      const StatusIcon = config.icon;
                      
                      return (
                        <div 
                          key={item.id}
                          className={`p-4 flex items-start justify-between gap-4 ${
                            index !== items.length - 1 ? 'border-b border-slate-100' : ''
                          }`}
                          data-testid={`checklist-item-${item.id}`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                              <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900">{item.title}</h4>
                              {item.last_reviewed && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Last reviewed: {new Date(item.last_reviewed).toLocaleDateString('en-GB')}
                                </p>
                              )}
                              {item.next_review_due && (
                                <p className="text-xs text-slate-500">
                                  Next review: {new Date(item.next_review_due).toLocaleDateString('en-GB')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <Select 
                            value={item.status} 
                            onValueChange={(value) => updateStatus(item.id, value)}
                          >
                            <SelectTrigger 
                              className={`w-40 ${config.bg} ${config.text} border-0`}
                              data-testid={`status-select-${item.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="complete">
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Complete
                                </div>
                              </SelectItem>
                              <SelectItem value="needs_review">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600" />
                                  Needs Review
                                </div>
                              </SelectItem>
                              <SelectItem value="not_started">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-500" />
                                  Not Started
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>

        {filteredChecklist.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No items found</h3>
            <p className="text-slate-600">Try changing your filter</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
