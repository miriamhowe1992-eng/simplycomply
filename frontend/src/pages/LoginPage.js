import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, business } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success("Welcome back!");
      // Redirect based on whether they have a business set up
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid credentials");
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
            Welcome back
          </h1>
          <p className="text-slate-600 mb-8">
            Log in to access your compliance dashboard
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@business.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="login-email-input"
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="login-password-input"
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
              data-testid="login-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
          
          <p className="text-center text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <img 
            src="https://images.unsplash.com/photo-1642844819197-5f5f21b89ff8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZW50YWwlMjBwcmFjdGljZSUyMGludGVyaW9yfGVufDB8fHx8MTc2ODk0ODYxN3ww&ixlib=rb-4.1.0&q=85&w=600"
            alt="Modern UK business"
            className="rounded-2xl mb-8 shadow-2xl"
          />
          <blockquote className="text-white text-lg mb-4">
            "SimplyComply saved us countless hours on compliance paperwork. Everything we need is in one place."
          </blockquote>
          <p className="text-slate-400">
            — Sarah Mitchell, Dental Practice Manager
          </p>
        </div>
      </div>
    </div>
  );
}
