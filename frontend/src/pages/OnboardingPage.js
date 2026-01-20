import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { Shield, Loader2, ArrowRight, Building2, MapPin, Users } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [nations, setNations] = useState([]);
  const [sizes, setSizes] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    sector: "",
    size: "",
    uk_nation: "",
    address: "",
    phone: ""
  });
  
  const { refreshBusiness, business } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If business already exists, redirect to dashboard
    if (business) {
      navigate("/dashboard");
      return;
    }
    
    fetchReferenceData();
  }, [business]);

  const fetchReferenceData = async () => {
    try {
      const [sectorsRes, nationsRes, sizesRes] = await Promise.all([
        api.get("/reference/sectors"),
        api.get("/reference/nations"),
        api.get("/reference/business-sizes")
      ]);
      setSectors(sectorsRes.data);
      setNations(nationsRes.data);
      setSizes(sizesRes.data);
    } catch (error) {
      toast.error("Failed to load reference data");
    }
  };

  const handleSectorSelect = (sectorId) => {
    const sector = sectors.find(s => s.id === sectorId);
    setFormData(prev => ({
      ...prev,
      sector: sectorId,
      industry: sector?.industry || ""
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      await api.post("/business", formData);
      await refreshBusiness();
      toast.success("Business profile created! Your compliance checklist is ready.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create business profile");
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = formData.sector && formData.size;
  const canProceedStep2 = formData.name && formData.uk_nation;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-teal-600" />
            <span className="font-heading text-xl font-semibold text-slate-900">SimplyComply</span>
          </div>
        </div>
      </div>
      
      {/* Progress */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            1
          </div>
          <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-teal-600' : 'bg-slate-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            2
          </div>
        </div>
        
        {/* Step 1: Business Type */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-slate-900">
                  Tell us about your business
                </h1>
                <p className="text-slate-600">We'll generate your compliance checklist based on this</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>What sector is your business in?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {sectors.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => handleSectorSelect(sector.id)}
                      data-testid={`onboarding-sector-${sector.id}`}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.sector === sector.id 
                          ? 'border-teal-600 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-medium text-slate-900 text-sm">{sector.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Business size</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                >
                  <SelectTrigger data-testid="onboarding-size-select">
                    <SelectValue placeholder="Select business size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => setStep(2)} 
                disabled={!canProceedStep1}
                className="w-full bg-slate-900 hover:bg-slate-800"
                data-testid="onboarding-next-btn"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 2: Business Details */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-slate-900">
                  Business details
                </h1>
                <p className="text-slate-600">Help us personalise your compliance pack</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Business name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Smith Dental Practice"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="onboarding-name-input"
                  className="bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label>UK Nation</Label>
                <Select 
                  value={formData.uk_nation} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, uk_nation: value }))}
                >
                  <SelectTrigger data-testid="onboarding-nation-select">
                    <SelectValue placeholder="Select UK nation" />
                  </SelectTrigger>
                  <SelectContent>
                    {nations.map((nation) => (
                      <SelectItem key={nation} value={nation}>
                        {nation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Business address (optional)</Label>
                <Input
                  id="address"
                  placeholder="123 High Street, London"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  data-testid="onboarding-address-input"
                  className="bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number (optional)</Label>
                <Input
                  id="phone"
                  placeholder="020 1234 5678"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  data-testid="onboarding-phone-input"
                  className="bg-white"
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!canProceedStep2 || loading}
                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                  data-testid="onboarding-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Business Profile
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
