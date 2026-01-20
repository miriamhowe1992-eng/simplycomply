import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertCircle,
  Edit2,
  Plus,
  Loader2,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  valid: {
    label: "Valid",
    icon: CheckCircle2,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200"
  },
  expiring_soon: {
    label: "Expiring Soon",
    icon: Clock,
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200"
  },
  expired: {
    label: "Expired",
    icon: AlertTriangle,
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200"
  },
  pending: {
    label: "Pending",
    icon: AlertCircle,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200"
  }
};

export default function EmployeeDetailPage() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [newRequirement, setNewRequirement] = useState({
    requirement_type: "",
    title: "",
    description: "",
    issue_date: "",
    expiry_date: "",
    reference_number: ""
  });
  
  const { business } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!business) {
      navigate("/onboarding");
      return;
    }
    fetchData();
  }, [business, employeeId]);

  const fetchData = async () => {
    try {
      const [empRes, reqRes, typesRes] = await Promise.all([
        api.get(`/employees/${employeeId}`),
        api.get(`/employees/${employeeId}/requirements`),
        api.get("/employees/requirements/types")
      ]);
      setEmployee(empRes.data);
      setRequirements(reqRes.data);
      setRequirementTypes(typesRes.data);
    } catch (error) {
      toast.error("Failed to load employee details");
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequirement = async (requirementId, data) => {
    setSaving(true);
    try {
      await api.put(`/employees/${employeeId}/requirements/${requirementId}`, data);
      toast.success("Requirement updated");
      setEditingRequirement(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update requirement");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/employees/${employeeId}/requirements`, newRequirement);
      toast.success("Requirement added");
      setShowAddDialog(false);
      setNewRequirement({
        requirement_type: "",
        title: "",
        description: "",
        issue_date: "",
        expiry_date: "",
        reference_number: ""
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to add requirement");
    } finally {
      setSaving(false);
    }
  };

  const groupedRequirements = requirements.reduce((acc, req) => {
    if (!acc[req.status]) {
      acc[req.status] = [];
    }
    acc[req.status].push(req);
    return acc;
  }, {});

  // Sort order: expired, expiring_soon, pending, valid
  const statusOrder = ["expired", "expiring_soon", "pending", "valid"];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading employee...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">Employee not found</p>
          <Button onClick={() => navigate("/employees")} className="mt-4">
            Back to Employees
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="employee-detail-page" className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/employees")}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employees
        </Button>

        {/* Employee Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-700 font-bold text-2xl">
                {employee.first_name[0]}{employee.last_name[0]}
              </span>
            </div>
            
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-bold text-slate-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-slate-600">{employee.job_title}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                {employee.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {employee.email}
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {employee.phone}
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {employee.department}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Started: {new Date(employee.start_date).toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>
            
            {employee.compliance_summary && (
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold text-slate-900">
                  {employee.compliance_summary.compliance_rate}%
                </div>
                <p className="text-sm text-slate-500">Compliance Rate</p>
                <div className="w-32 mt-2">
                  <Progress value={employee.compliance_summary.compliance_rate} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-900">{employee.compliance_summary?.valid || 0}</p>
            <p className="text-sm text-emerald-700">Valid</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-900">{employee.compliance_summary?.expiring_soon || 0}</p>
            <p className="text-sm text-amber-700">Expiring Soon</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{employee.compliance_summary?.expired || 0}</p>
            <p className="text-sm text-red-700">Expired</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <AlertCircle className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{employee.compliance_summary?.pending || 0}</p>
            <p className="text-sm text-slate-700">Pending</p>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-slate-900">
            Compliance Requirements
          </h2>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" data-testid="add-requirement-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Requirement</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddRequirement} className="space-y-4">
                <div className="space-y-2">
                  <Label>Requirement Type *</Label>
                  <Select 
                    value={newRequirement.requirement_type}
                    onValueChange={(value) => {
                      const type = requirementTypes.find(t => t.type === value);
                      setNewRequirement(prev => ({
                        ...prev,
                        requirement_type: value,
                        title: type?.title || "",
                        description: type?.description || ""
                      }));
                    }}
                  >
                    <SelectTrigger data-testid="requirement-type-select">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requirementTypes.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          {type.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="req_title">Title *</Label>
                  <Input
                    id="req_title"
                    value={newRequirement.title}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue_date">Issue Date</Label>
                    <Input
                      id="issue_date"
                      type="date"
                      value={newRequirement.issue_date}
                      onChange={(e) => setNewRequirement(prev => ({ ...prev, issue_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={newRequirement.expiry_date}
                      onChange={(e) => setNewRequirement(prev => ({ ...prev, expiry_date: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input
                    id="reference"
                    value={newRequirement.reference_number}
                    onChange={(e) => setNewRequirement(prev => ({ ...prev, reference_number: e.target.value }))}
                    placeholder="e.g., DBS-123456"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Requirement"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Requirements List */}
        <div className="space-y-6">
          {statusOrder.map(status => {
            const items = groupedRequirements[status];
            if (!items || items.length === 0) return null;
            
            const config = statusConfig[status];
            const StatusIcon = config.icon;
            
            return (
              <div key={status}>
                <h3 className={`font-medium mb-3 flex items-center gap-2 ${config.text}`}>
                  <StatusIcon className="w-5 h-5" />
                  {config.label} ({items.length})
                </h3>
                
                <div className="grid gap-3">
                  {items.map((req) => (
                    <div
                      key={req.id}
                      className={`bg-white rounded-lg border ${config.border} p-4`}
                      data-testid={`requirement-${req.id}`}
                    >
                      {editingRequirement === req.id ? (
                        <EditRequirementForm
                          requirement={req}
                          onSave={(data) => handleUpdateRequirement(req.id, data)}
                          onCancel={() => setEditingRequirement(null)}
                          saving={saving}
                        />
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}>
                              <FileCheck className={`w-5 h-5 ${config.text}`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{req.title}</h4>
                              {req.description && (
                                <p className="text-sm text-slate-500 mt-1">{req.description}</p>
                              )}
                              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                                {req.reference_number && (
                                  <span>Ref: {req.reference_number}</span>
                                )}
                                {req.issue_date && (
                                  <span>Issued: {new Date(req.issue_date).toLocaleDateString('en-GB')}</span>
                                )}
                                {req.expiry_date && (
                                  <span className={status === 'expired' ? 'text-red-600 font-medium' : status === 'expiring_soon' ? 'text-amber-600 font-medium' : ''}>
                                    Expires: {new Date(req.expiry_date).toLocaleDateString('en-GB')}
                                    {req.days_until_expiry !== null && (
                                      <> ({req.days_until_expiry < 0 ? `${Math.abs(req.days_until_expiry)} days overdue` : `${req.days_until_expiry} days left`})</>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRequirement(req.id)}
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {requirements.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No requirements yet</h3>
            <p className="text-slate-600 text-sm">
              Add compliance requirements to track for this employee.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Edit Requirement Form Component
function EditRequirementForm({ requirement, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    issue_date: requirement.issue_date?.split('T')[0] || "",
    expiry_date: requirement.expiry_date?.split('T')[0] || "",
    reference_number: requirement.reference_number || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="font-medium text-slate-900">{requirement.title}</h4>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit_issue">Issue Date</Label>
          <Input
            id="edit_issue"
            type="date"
            value={formData.issue_date}
            onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit_expiry">Expiry Date</Label>
          <Input
            id="edit_expiry"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit_ref">Reference</Label>
          <Input
            id="edit_ref"
            value={formData.reference_number}
            onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
            placeholder="DBS-123456"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={saving} className="bg-slate-900 hover:bg-slate-800">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
}
