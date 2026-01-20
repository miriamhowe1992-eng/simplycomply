import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const [status, setStatus] = useState("checking"); // checking, success, error
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const { refreshBusiness } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  const pollPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setStatus("error");
      return;
    }

    try {
      const response = await api.get(`/subscription/status/${sessionId}`);
      
      if (response.data.payment_status === "paid") {
        await refreshBusiness();
        setStatus("success");
        return;
      }
      
      // If still pending, continue polling
      setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
    } catch (error) {
      console.error("Error checking payment status:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-teal-600" />
          <span className="font-heading text-xl font-semibold text-slate-900">SimplyComply</span>
        </div>
        
        {status === "checking" && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">
              Processing Payment
            </h1>
            <p className="text-slate-600">
              Please wait while we confirm your subscription...
            </p>
          </div>
        )}
        
        {status === "success" && (
          <div className="bg-white rounded-xl border border-slate-200 p-8" data-testid="subscription-success">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">
              Subscription Activated!
            </h1>
            <p className="text-slate-600 mb-6">
              Welcome to SimplyComply! You now have full access to all compliance documents and features.
            </p>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-slate-900 hover:bg-slate-800"
              data-testid="go-to-dashboard-btn"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
        
        {status === "error" && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 mb-2">
              Something Went Wrong
            </h1>
            <p className="text-slate-600 mb-6">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/subscription")}
                className="w-full bg-slate-900 hover:bg-slate-800"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
