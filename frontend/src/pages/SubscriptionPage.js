import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { 
  CheckCircle2, 
  CreditCard, 
  Loader2,
  Crown,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  
  const { business, refreshBusiness } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!business) {
      navigate("/onboarding");
      return;
    }
    fetchPlans();
  }, [business]);

  const fetchPlans = async () => {
    try {
      const response = await api.get("/subscription/plans");
      setPlans(response.data);
    } catch (error) {
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setCheckoutLoading(planId);
    
    try {
      const originUrl = window.location.origin;
      const response = await api.post("/subscription/checkout", {
        plan: planId,
        origin_url: originUrl
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Failed to start checkout");
      setCheckoutLoading(null);
    }
  };

  const isActive = business?.subscription_status === "active";
  const currentPlan = business?.subscription_plan;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading plans...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="subscription-page" className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
            {isActive ? "Manage Subscription" : "Choose Your Plan"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isActive 
              ? "You have full access to all SimplyComply features" 
              : "Unlock full access to all compliance documents and features"}
          </p>
        </div>

        {/* Current Plan Status */}
        {isActive && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-teal-900">
                  {currentPlan === "annual" ? "Annual Plan" : "Monthly Plan"} Active
                </h3>
                <p className="text-teal-700">You have full access to all features</p>
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = isActive && currentPlan === plan.plan_id;
            const isAnnual = plan.plan_id === "annual";
            
            return (
              <div 
                key={plan.plan_id}
                className={`rounded-xl border p-6 ${
                  isAnnual 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-white border-slate-200'
                } ${isCurrentPlan ? 'ring-2 ring-teal-500' : ''}`}
                data-testid={`plan-card-${plan.plan_id}`}
              >
                {isAnnual && (
                  <div className="inline-flex items-center gap-1 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full mb-4">
                    <Zap className="w-3 h-3" />
                    BEST VALUE
                  </div>
                )}
                
                <h3 className={`font-heading text-xl font-semibold mb-2 ${
                  isAnnual ? 'text-white' : 'text-slate-900'
                }`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`font-heading text-4xl font-bold ${
                    isAnnual ? 'text-white' : 'text-slate-900'
                  }`}>
                    £{plan.price}
                  </span>
                  <span className={isAnnual ? 'text-slate-400' : 'text-slate-500'}>
                    /{plan.interval === 'year' ? 'year' : 'month'}
                  </span>
                </div>
                
                {isAnnual && (
                  <p className="text-teal-400 text-sm mb-4">
                    Save £58/year (2 months free)
                  </p>
                )}
                
                <ul className="space-y-3 mb-6">
                  {[
                    "All compliance documents",
                    "Smart checklists",
                    "Review reminders",
                    "Regulatory updates",
                    isAnnual && "Priority support",
                    isAnnual && "Version history"
                  ].filter(Boolean).map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${
                      isAnnual ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                        isAnnual ? 'text-teal-400' : 'text-teal-600'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSubscribe(plan.plan_id)}
                  disabled={isCurrentPlan || checkoutLoading !== null}
                  className={`w-full ${
                    isAnnual 
                      ? 'bg-teal-600 hover:bg-teal-700' 
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                  data-testid={`subscribe-btn-${plan.plan_id}`}
                >
                  {checkoutLoading === plan.plan_id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {isActive ? "Switch Plan" : "Subscribe Now"}
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-heading font-semibold text-slate-900 text-center mb-6">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h4 className="font-medium text-slate-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-slate-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h4 className="font-medium text-slate-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-sm text-slate-600">We accept all major credit and debit cards through our secure payment partner, Stripe.</p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h4 className="font-medium text-slate-900 mb-2">Is there a free trial?</h4>
              <p className="text-sm text-slate-600">Yes, you can explore the platform before subscribing. However, document downloads require an active subscription.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
