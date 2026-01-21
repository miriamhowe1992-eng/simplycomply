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
  AlertTriangle,
  Shield,
  Info,
  ChevronRight,
  Target
} from "lucide-react";
import { toast } from "sonner";

// Circular progress component for the score
function CircularProgress({ value, size = 180, strokeWidth = 12, status }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const getStatusColor = () => {
    switch(status) {
      case "on_track": return { stroke: "#059669", bg: "#d1fae5", text: "#065f46" };
      case "needs_attention": return { stroke: "#d97706", bg: "#fef3c7", text: "#92400e" };
      case "overdue": return { stroke: "#dc2626", bg: "#fee2e2", text: "#991b1b" };
      default: return { stroke: "#0d9488", bg: "#ccfbf1", text: "#134e4a" };
    }
  };
  
  const colors = getStatusColor();
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: colors.text }}>{value}%</span>
        <span className="text-sm text-slate-500">Compliant</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [complianceScore, setComplianceScore] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
      const [statsRes, scoreRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/compliance/score").catch(() => null)
      ]);
      setStats(statsRes.data);
      if (scoreRes?.data) {
        setComplianceScore(scoreRes.data);
      }
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

  const getStatusLabel = (status) => {
    switch(status) {
      case "on_track": return { text: "On Track", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      case "needs_attention": return { text: "Needs Attention", color: "text-amber-700 bg-amber-50 border-amber-200" };
      case "overdue": return { text: "Overdue Items", color: "text-red-700 bg-red-50 border-red-200" };
      default: return { text: "Getting Started", color: "text-slate-700 bg-slate-50 border-slate-200" };
    }
  };

  const statusInfo = complianceScore ? getStatusLabel(complianceScore.status_label) : getStatusLabel("default");

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
              {bizData?.name} • {bizData?.sector?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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

        {/* Compliance Readiness Score - Hero Section */}
        {complianceScore && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Score Ring */}
              <div className="flex-shrink-0">
                <CircularProgress 
                  value={complianceScore.score_percent} 
                  status={complianceScore.status_label}
                />
              </div>
              
              {/* Score Details */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <h2 className="font-heading text-xl font-semibold">Compliance Readiness Score</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-4">
                  {complianceScore.completed_total} of {complianceScore.required_total} required items complete
                </p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold">{complianceScore.completed_total}</div>
                    <div className="text-xs text-slate-300">Complete</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-amber-400">{complianceScore.missing_count}</div>
                    <div className="text-xs text-slate-300">Missing</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-orange-400">{complianceScore.needs_review_count}</div>
                    <div className="text-xs text-slate-300">Needs Review</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-red-400">{complianceScore.overdue_count}</div>
                    <div className="text-xs text-slate-300">Overdue</div>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex-shrink-0">
                <Link to="/documents">
                  <Button 
                    data-testid="view-compliance-items-btn"
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    View Compliance Items
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

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

        {/* Compliance Breakdown by Category */}
        {complianceScore?.breakdown && Object.keys(complianceScore.breakdown).length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Compliance by Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(complianceScore.breakdown).map(([category, data]) => {
                const percent = data.required_total > 0 
                  ? Math.round((data.required_completed / data.required_total) * 100) 
                  : 100;
                return (
                  <div key={category} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">{category}</span>
                      <span className="text-sm text-slate-500">
                        {data.required_completed}/{data.required_total}
                      </span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <p className="text-sm text-slate-500">
                        {complianceScore ? `${complianceScore.required_total} compliance items` : `${total_documents} documents`}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/employees" className="block">
                <div className="p-4 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Employee Compliance</p>
                      <p className="text-sm text-slate-500">
                        {employee_stats?.total_employees || 0} employees
                      </p>
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
            </div>
          </div>
          
          {/* Upcoming Reviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Upcoming Reviews
            </h3>
            
            {upcoming_reviews && upcoming_reviews.length > 0 ? (
              <div className="space-y-3">
                {upcoming_reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-900 truncate">{review.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Due: {new Date(review.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No upcoming reviews in the next 30 days</p>
            )}
          </div>
        </div>

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
    </DashboardLayout>
  );
}
