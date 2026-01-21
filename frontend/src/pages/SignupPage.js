import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Shield, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getIndustryById } from "../data/industries";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const preselectedIndustryId = searchParams.get("industry");
  const preselectedIndustry = preselectedIndustryId ? getIndustryById(preselectedIndustryId) : null;
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      await signup(email, password, fullName);
      toast.success("Account created! Let's set up your business.");
      // Pass the preselected industry to onboarding
      if (preselectedIndustryId) {
        navigate(`/onboarding?industry=${preselectedIndustryId}`);
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <Shield className="w-8 h-8 text-teal-600" />
            <span className="font-heading text-xl font-semibold text-slate-900">SimplyComply</span>
          </Link>
          
          <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">
            Create your account
          </h1>
          <p className="text-slate-600 mb-6">
            Start your compliance journey in minutes
          </p>
          
          {/* Show preselected industry */}
          {preselectedIndustry && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{preselectedIndustry.icon}</span>
                <div>
                  <p className="font-medium text-teal-900">{preselectedIndustry.name} Pack</p>
                  <p className="text-sm text-teal-700">This will be pre-selected during setup</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                data-testid="signup-name-input"
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@business.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="signup-email-input"
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  data-testid="signup-password-input"
                  className="bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-800"
              disabled={loading}
              data-testid="signup-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          
          <p className="text-xs text-slate-500 mt-4 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
          
          <p className="text-xs text-slate-400 mt-3 text-center leading-relaxed">
            Requirements can vary by local authority and UK nation. SimplyComply assists with compliance documentation but does not guarantee regulatory approval or inspection outcomes.
          </p>
          
          <p className="text-center text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="font-heading text-3xl font-bold text-white mb-8">
            Why UK businesses choose SimplyComply
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Industry-Specific Packs</h3>
                <p className="text-slate-400">Pre-built compliance documents for dental, healthcare, construction, hospitality, and more.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Employee Compliance Tracking</h3>
                <p className="text-slate-400">Track DBS checks, certifications, and training for your entire team in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Always Up to Date</h3>
                <p className="text-slate-400">We track UK regulatory changes so you don't have to. Get notified when policies need updating.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Save Hours Every Month</h3>
                <p className="text-slate-400">No more searching for templates or worrying about missing requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
