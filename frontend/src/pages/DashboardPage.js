import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowRight,
  Calendar,
  TrendingUp,
  Bell,
  Users,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { business } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!business) {
      navigate("/onboarding");
      return;
    }
    fetchStats();
  }, [business]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats?.has_business) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
            Complete Your Business Setup
          </h2>
          <p className="text-slate-600 mb-6">
            Set up your business profile to access your compliance checklist.
          </p>
          <Link to="/onboarding">
            <Button data-testid="complete-setup-btn">Complete Setup</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { 
    business: bizData, 
    total_documents, 
    completed, 
    needs_review, 
    not_started, 
    completion_percentage, 
    upcoming_reviews,
    employee_stats 
  } = stats;

  return (
    <DashboardLayout>
      <div data-testid="dashboard-page" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back
            </h1>
            <p className="text-slate-600 mt-1">
              {bizData?.name} • {bizData?.sector?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          
          {bizData?.subscription_status !== "active" && (
            <Link to="/subscription">
              <Button data-testid="upgrade-btn" className="bg-teal-600 hover:bg-teal-700">
                Upgrade to Full Access
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Employee Compliance Alert */}
        {employee_stats && (employee_stats.expired_requirements > 0 || employee_stats.expiring_soon > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-900">Employee Compliance Attention Needed</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {employee_stats.expired_requirements > 0 && (
                    <span className="font-medium">{employee_stats.expired_requirements} overdue</span>
                  )}
                  {employee_stats.expired_requirements > 0 && employee_stats.expiring_soon > 0 && " and "}
                  {employee_stats.expiring_soon > 0 && (
                    <span>{employee_stats.expiring_soon} expiring soon</span>
                  )}
                  {" "}employee requirement(s) need your attention.
                </p>
              </div>
              <Link to="/employees">
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Completion Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-slate-900">Compliance Progress</h3>
              <span className="text-2xl font-bold text-slate-900">{completion_percentage}%</span>
            </div>
            <Progress value={completion_percentage} className="h-3 mb-4" />
            <p className="text-sm text-slate-600">
              {completed} of {total_documents} documents complete
            </p>
          </div>
          
          {/* Complete */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{completed}</span>
            </div>
            <p className="text-slate-600 text-sm">Complete</p>
          </div>
          
          {/* Needs Review */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">{needs_review}</span>
            </div>
            <p className="text-slate-600 text-sm">Needs Review</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/checklist" className="block">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">View Checklist</p>
                      <p className="text-sm text-slate-500">{not_started} items pending</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/documents" className="block">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Document Library</p>
                      <p className="text-sm text-slate-500">{total_documents} documents</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/notifications" className="block">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Notifications</p>
                      <p className="text-sm text-slate-500">Stay updated</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/settings" className="block">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Business Settings</p>
                      <p className="text-sm text-slate-500">Update profile</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Upcoming Reviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              <h3 className="font-heading font-semibold text-slate-900">Upcoming Reviews</h3>
            </div>
            
            {upcoming_reviews.length > 0 ? (
              <div className="space-y-3">
                {upcoming_reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="p-3 rounded-lg bg-amber-50 border border-amber-100"
                  >
                    <p className="font-medium text-slate-900 text-sm">{review.title}</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Due: {new Date(review.due_date).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No upcoming reviews</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-heading font-semibold text-slate-900 mb-4">Status by Category</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">Complete</p>
                <p className="text-sm text-emerald-700">{completed} documents reviewed and up to date</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">Needs Review</p>
                <p className="text-sm text-amber-700">{needs_review} documents require attention</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
              <Clock className="w-5 h-5 text-slate-600" />
              <div>
                <p className="font-medium text-slate-900">Not Started</p>
                <p className="text-sm text-slate-600">{not_started} documents pending setup</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
