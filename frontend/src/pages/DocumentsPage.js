import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  ChevronRight,
  Lock,
  AlertCircle,
  CheckCircle2,
  Clock,
  Upload,
  Eye,
  Check,
  Info,
  Calendar,
  AlertTriangle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../components/ui/dialog";
import { toast } from "sonner";

// Status badge component
function StatusBadge({ status }) {
  const statusConfig = {
    missing: { color: "bg-slate-100 text-slate-700 border-slate-200", icon: AlertCircle, text: "Missing" },
    draft: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, text: "Draft" },
    uploaded: { color: "bg-blue-50 text-blue-700 border-blue-200", icon: Upload, text: "Uploaded" },
    acknowledged: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Check, text: "Acknowledged" },
    approved: { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle2, text: "Approved" },
    needs_review: { color: "bg-orange-50 text-orange-700 border-orange-200", icon: Clock, text: "Needs Review" },
    overdue: { color: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle, text: "Overdue" }
  };
  
  const config = statusConfig[status] || statusConfig.missing;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

// Item type badge
function TypeBadge({ type }) {
  const typeConfig = {
    policy: "bg-purple-50 text-purple-700",
    procedure: "bg-blue-50 text-blue-700",
    risk_assessment: "bg-amber-50 text-amber-700",
    audit: "bg-teal-50 text-teal-700",
    poster: "bg-pink-50 text-pink-700",
    template: "bg-indigo-50 text-indigo-700",
    operational: "bg-slate-100 text-slate-700"
  };
  
  const typeLabels = {
    policy: "Policy",
    procedure: "Procedure",
    risk_assessment: "Risk Assessment",
    audit: "Audit",
    poster: "Poster",
    template: "Template",
    operational: "Operational"
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeConfig[type] || typeConfig.policy}`}>
      {typeLabels[type] || type}
    </span>
  );
}

export default function DocumentsPage() {
  const [complianceItems, setComplianceItems] = useState([]);
  const [complianceScore, setComplianceScore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  
  const { business } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!business) {
      navigate("/onboarding");
      return;
    }
    fetchData();
  }, [business]);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes, typesRes, scoreRes] = await Promise.all([
        api.get("/compliance/items"),
        api.get("/compliance/categories"),
        api.get("/compliance/types"),
        api.get("/compliance/score")
      ]);
      setComplianceItems(itemsRes.data);
      setCategories(catsRes.data);
      setTypes(typesRes.data);
      setComplianceScore(scoreRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load compliance items");
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (item) => {
    setAcknowledging(true);
    try {
      await api.post(`/compliance/items/${item.id}/acknowledge`);
      toast.success(`"${item.title}" acknowledged successfully`);
      await fetchData(); // Refresh data
      setShowItemModal(false);
    } catch (error) {
      toast.error("Failed to acknowledge item");
    } finally {
      setAcknowledging(false);
    }
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.item_type === selectedType;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const isSubscribed = business?.subscription_status === "active";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading compliance items...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="documents-page" className="space-y-6">
        {/* Header with Score Summary */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
              Compliance Library
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your compliance documents, policies, and requirements
            </p>
          </div>
          
          {complianceScore && (
            <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{complianceScore.score_percent}%</div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-sm">
                <div className="text-slate-900 font-medium">{complianceScore.completed_total} / {complianceScore.required_total}</div>
                <div className="text-slate-500 text-xs">Items Complete</div>
              </div>
            </div>
          )}
        </div>

        {/* Score Progress Bar */}
        {complianceScore && (
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Compliance Progress</span>
              <span className="text-sm text-slate-500">
                {complianceScore.missing_count} missing • {complianceScore.needs_review_count} need review
              </span>
            </div>
            <Progress value={complianceScore.score_percent} className="h-2" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
              data-testid="compliance-search-input"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white" data-testid="category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-40 bg-white" data-testid="type-filter">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40 bg-white" data-testid="status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="uploaded">Uploaded</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Compliance Items by Category */}
        {Object.keys(groupedItems).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => {
              const categoryComplete = items.filter(i => ["uploaded", "acknowledged", "approved"].includes(i.status)).length;
              const categoryRequired = items.filter(i => i.is_required).length;
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-600" />
                      {category}
                      <span className="text-sm font-normal text-slate-500">({items.length})</span>
                    </h2>
                    <span className="text-sm text-slate-500">
                      {categoryComplete}/{categoryRequired} required complete
                    </span>
                  </div>
                  
                  <div className="grid gap-3">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer ${
                          item.status === "missing" ? "border-slate-200" : 
                          item.status === "overdue" ? "border-red-200 bg-red-50/30" :
                          "border-slate-200"
                        }`}
                        onClick={() => handleViewItem(item)}
                        data-testid={`compliance-item-${item.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-slate-900">{item.title}</h3>
                              {item.is_required && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                  Required
                                </span>
                              )}
                              <TypeBadge type={item.item_type} />
                              <StatusBadge status={item.status} />
                            </div>
                            {item.description && (
                              <p className="text-sm text-slate-600 mt-1 line-clamp-1">{item.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              {item.last_reviewed && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Last reviewed: {new Date(item.last_reviewed).toLocaleDateString('en-GB')}
                                </span>
                              )}
                              {item.next_review_due && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Next review: {new Date(item.next_review_due).toLocaleDateString('en-GB')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {item.status === "missing" && item.is_required && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcknowledge(item);
                                }}
                                className="bg-teal-600 hover:bg-teal-700"
                                data-testid={`acknowledge-btn-${item.id}`}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewItem(item);
                              }}
                              data-testid={`view-btn-${item.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No items found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">
              SimplyComply provides guidance, templates, and organisational tools. Responsibility for ensuring compliance remains with the business owner and may vary by location, services offered, and regulatory requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Dialog open={showItemModal} onOpenChange={setShowItemModal}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl">{selectedItem.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <TypeBadge type={selectedItem.item_type} />
                      <StatusBadge status={selectedItem.status} />
                      {selectedItem.is_required && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Category</h4>
                  <p className="text-slate-900">{selectedItem.category}</p>
                </div>
                
                {selectedItem.description && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Description</h4>
                    <p className="text-slate-600">{selectedItem.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Last Reviewed</h4>
                    <p className="text-slate-900">
                      {selectedItem.last_reviewed 
                        ? new Date(selectedItem.last_reviewed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : "Not yet reviewed"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Next Review Due</h4>
                    <p className="text-slate-900">
                      {selectedItem.next_review_due 
                        ? new Date(selectedItem.next_review_due).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                        : "—"}
                    </p>
                  </div>
                </div>
                
                {selectedItem.is_acknowledged && selectedItem.acknowledged_at && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-700">
                        Acknowledged on {new Date(selectedItem.acknowledged_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}
                
                {selectedItem.contributes_to_score && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">
                        This item contributes to your compliance readiness score
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  {selectedItem.status === "missing" && (
                    <Button
                      onClick={() => handleAcknowledge(selectedItem)}
                      disabled={acknowledging}
                      className="bg-teal-600 hover:bg-teal-700 flex-1"
                      data-testid="modal-acknowledge-btn"
                    >
                      {acknowledging ? (
                        <span className="animate-pulse">Acknowledging...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Acknowledge Item
                        </>
                      )}
                    </Button>
                  )}
                  {isSubscribed && (
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  )}
                  {!isSubscribed && (
                    <Button variant="outline" onClick={() => navigate("/subscription")} className="flex-1">
                      <Lock className="w-4 h-4 mr-2" />
                      Upgrade to Download
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
