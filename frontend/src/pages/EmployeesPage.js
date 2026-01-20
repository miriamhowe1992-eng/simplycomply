import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Users, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Loader2,
  UserPlus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    department: "",
    start_date: new Date().toISOString().split('T')[0],
    phone: "",
    emergency_contact: ""
  });
  
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
      const [employeesRes, overviewRes] = await Promise.all([
        api.get("/employees"),
        api.get("/employees/compliance/overview")
      ]);
      setEmployees(employeesRes.data);
      setOverview(overviewRes.data);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    
    try {
      await api.post("/employees", newEmployee);
      toast.success("Employee added successfully");
      setShowAddDialog(false);
      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        job_title: "",
        department: "",
        start_date: new Date().toISOString().split('T')[0],
        phone: "",
        emergency_contact: ""
      });
      fetchData();
    } catch (error) {
      toast.error("Failed to add employee");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      await api.delete(`/employees/${employeeId}`);
      toast.success("Employee deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           emp.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getComplianceColor = (rate) => {
    if (rate >= 80) return "text-emerald-600";
    if (rate >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getComplianceBg = (rate) => {
    if (rate >= 80) return "bg-emerald-100";
    if (rate >= 50) return "bg-amber-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading employees...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="employees-page" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
              Employee Compliance
            </h1>
            <p className="text-slate-600 mt-1">
              Track DBS, certifications, training and compliance for your team
            </p>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button data-testid="add-employee-btn" className="bg-slate-900 hover:bg-slate-800">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={newEmployee.first_name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                      data-testid="employee-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={newEmployee.last_name}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                      data-testid="employee-last-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="employee-email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    value={newEmployee.job_title}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, job_title: e.target.value }))}
                    required
                    data-testid="employee-job-title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newEmployee.start_date}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                      data-testid="employee-start-date"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  disabled={addLoading}
                  data-testid="submit-employee-btn"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Employee"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overview.total_employees}</p>
                  <p className="text-sm text-slate-500">Employees</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overview.valid_requirements}</p>
                  <p className="text-sm text-slate-500">Valid</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overview.expiring_soon_requirements}</p>
                  <p className="text-sm text-slate-500">Expiring Soon</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overview.expired_requirements}</p>
                  <p className="text-sm text-slate-500">Overdue</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{overview.pending_requirements}</p>
                  <p className="text-sm text-slate-500">Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        {overview && (overview.overdue_items.length > 0 || overview.expiring_soon_items.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overdue */}
            {overview.overdue_items.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-semibold text-red-900 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  Overdue Requirements
                </h3>
                <div className="space-y-2">
                  {overview.overdue_items.slice(0, 5).map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-lg p-3 border border-red-100 cursor-pointer hover:border-red-300"
                      onClick={() => navigate(`/employees/${item.employee_id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">{item.employee_name}</p>
                          <p className="text-sm text-red-600">{item.requirement}</p>
                        </div>
                        <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                          {item.days_overdue} days overdue
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Expiring Soon */}
            {overview.expiring_soon_items.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h3 className="font-semibold text-amber-900 flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5" />
                  Expiring Within 30 Days
                </h3>
                <div className="space-y-2">
                  {overview.expiring_soon_items.slice(0, 5).map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-lg p-3 border border-amber-100 cursor-pointer hover:border-amber-300"
                      onClick={() => navigate(`/employees/${item.employee_id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-900">{item.employee_name}</p>
                          <p className="text-sm text-amber-600">{item.requirement}</p>
                        </div>
                        <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                          {item.days_until_expiry} days left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
            data-testid="employee-search-input"
          />
        </div>

        {/* Employee List */}
        {filteredEmployees.length > 0 ? (
          <div className="grid gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                data-testid={`employee-card-${employee.id}`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => navigate(`/employees/${employee.id}`)}
                  >
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 font-semibold">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900">
                        {employee.first_name} {employee.last_name}
                      </h3>
                      <p className="text-sm text-slate-500">{employee.job_title}</p>
                      {employee.department && (
                        <p className="text-xs text-slate-400">{employee.department}</p>
                      )}
                    </div>
                  </div>
                  
                  {employee.compliance_summary && (
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-semibold ${getComplianceColor(employee.compliance_summary.compliance_rate)}`}>
                            {employee.compliance_summary.compliance_rate}% Compliant
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          {employee.compliance_summary.expired > 0 && (
                            <span className="text-red-600 font-medium">
                              {employee.compliance_summary.expired} overdue
                            </span>
                          )}
                          {employee.compliance_summary.expiring_soon > 0 && (
                            <span className="text-amber-600">
                              {employee.compliance_summary.expiring_soon} expiring
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/employees/${employee.id}`);
                          }}
                        >
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEmployee(employee.id);
                          }}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Mobile compliance bar */}
                {employee.compliance_summary && (
                  <div className="mt-4 sm:hidden">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Compliance</span>
                      <span className={getComplianceColor(employee.compliance_summary.compliance_rate)}>
                        {employee.compliance_summary.compliance_rate}%
                      </span>
                    </div>
                    <Progress value={employee.compliance_summary.compliance_rate} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-heading font-medium text-slate-900 mb-2">No employees yet</h3>
            <p className="text-slate-600 text-sm mb-4">
              Add your first employee to start tracking their compliance requirements.
            </p>
            <Button onClick={() => setShowAddDialog(true)} data-testid="add-first-employee-btn">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No employees found</h3>
            <p className="text-slate-600">Try adjusting your search</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
