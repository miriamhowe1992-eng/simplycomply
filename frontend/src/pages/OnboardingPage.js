import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Shield, Loader2, ArrowRight, Building2, MapPin, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getAllIndustries, getIndustryById, getIndustriesGroupedByCategory } from "../data/industries";

const UK_NATIONS = ["England", "Scotland", "Wales", "Northern Ireland"];

const BUSINESS_SIZES = [
  { id: "micro", name: "Micro (1-9 employees)" },
  { id: "small", name: "Small (10-49 employees)" },
  { id: "medium", name: "Medium (50-249 employees)" },
  { id: "large", name: "Large (250+ employees)" }
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [searchParams] = useSearchParams();
  const preselectedIndustryId = searchParams.get("industry");
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    sector: preselectedIndustryId || "",
    size: "",
    uk_nation: "",
    address: "",
    phone: ""
  });
  
  const { refreshBusiness, business } = useAuth();
  const navigate = useNavigate();
  
  const allIndustries = getAllIndustries();
  const groupedIndustries = getIndustriesGroupedByCategory();

  useEffect(() => {
    // If business already exists, redirect to dashboard
    if (business) {
      navigate("/dashboard");
      return;
    }
    
    // Pre-select industry if provided
    if (preselectedIndustryId) {
      const industry = getIndustryById(preselectedIndustryId);
      if (industry) {
        setFormData(prev => ({
          ...prev,
          sector: preselectedIndustryId,
          industry: industry.industry
        }));
      }
    }
  }, [business, preselectedIndustryId]);

  const handleSectorSelect = (sectorId) => {
    const sector = getIndustryById(sectorId);
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

  // Filter industries based on search
  const filteredIndustries = searchTerm 
    ? allIndustries.filter(ind => 
        ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ind.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  const canProceedStep1 = formData.sector && formData.size;
  const canProceedStep2 = formData.name && formData.uk_nation;
  
  const selectedIndustry = formData.sector ? getIndustryById(formData.sector) : null;

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
              {/* Selected Industry Display */}
              {selectedIndustry && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedIndustry.icon}</span>
                      <div>
                        <p className="font-medium text-teal-900">{selectedIndustry.name}</p>
                        <p className="text-sm text-teal-700">Regulated by {selectedIndustry.regulator}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFormData(prev => ({ ...prev, sector: "", industry: "" }))}
                      className="text-teal-700"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Sector Selection */}
              {!selectedIndustry && (
                <div className="space-y-4">
                  <Label>What sector is your business in?</Label>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search industries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white"
                      data-testid="industry-search-input"
                    />
                  </div>
                  
                  {/* Search Results */}
                  {filteredIndustries ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                      {filteredIndustries.map((industry) => (
                        <button
                          key={industry.id}
                          type="button"
                          onClick={() => handleSectorSelect(industry.id)}
                          data-testid={`onboarding-sector-${industry.id}`}
                          className="p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left"
                        >
                          <span className="text-xl mr-2">{industry.icon}</span>
                          <span className="font-medium text-slate-900 text-sm">{industry.name}</span>
                        </button>
                      ))}
                      {filteredIndustries.length === 0 && (
                        <p className="col-span-full text-center text-slate-500 py-4">
                          No industries match your search
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Grouped Industries */
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                      {Object.entries(groupedIndustries).map(([category, industries]) => (
                        <div key={category}>
                          <h3 className="text-sm font-medium text-slate-500 mb-2">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {industries.map((industry) => (
                              <button
                                key={industry.id}
                                type="button"
                                onClick={() => handleSectorSelect(industry.id)}
                                data-testid={`onboarding-sector-${industry.id}`}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                  formData.sector === industry.id 
                                    ? 'border-teal-600 bg-teal-50' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{industry.icon}</span>
                                  <span className="font-medium text-slate-900 text-sm truncate">{industry.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
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
                    {BUSINESS_SIZES.map((size) => (
                      <SelectItem key={size.id} value={size.id}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* What's included preview */}
              {selectedIndustry && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    What's included in your pack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIndustry.complianceAreas.filter(a => a.included).slice(0, 6).map((area, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                        {area.name}
                      </span>
                    ))}
                    {selectedIndustry.complianceAreas.filter(a => a.included).length > 6 && (
                      <span className="text-xs text-slate-500">
                        +{selectedIndustry.complianceAreas.filter(a => a.included).length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
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
                    {UK_NATIONS.map((nation) => (
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
