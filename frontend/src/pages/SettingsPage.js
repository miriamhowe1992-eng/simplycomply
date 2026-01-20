import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Building2, 
  User, 
  Loader2,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  
  const { business, refreshBusiness, user } = useAuth();
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
      const [sectorsRes, nationsRes, sizesRes] = await Promise.all([
        api.get("/reference/sectors"),
        api.get("/reference/nations"),
        api.get("/reference/business-sizes")
      ]);
      setSectors(sectorsRes.data);
      setNations(nationsRes.data);
      setSizes(sizesRes.data);
      
      if (business) {
        setFormData({
          name: business.name || "",
          industry: business.industry || "",
          sector: business.sector || "",
          size: business.size || "",
          uk_nation: business.uk_nation || "",
          address: business.address || "",
          phone: business.phone || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSectorChange = (sectorId) => {
    const sector = sectors.find(s => s.id === sectorId);
    setFormData(prev => ({
      ...prev,
      sector: sectorId,
      industry: sector?.industry || prev.industry
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put("/business", formData);
      await refreshBusiness();
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="settings-page" className="space-y-8 max-w-3xl">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
            Settings
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your account and business settings
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-slate-900">Account</h2>
              <p className="text-sm text-slate-600">Your account information</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            <div>
              <Label className="text-slate-500">Name</Label>
              <p className="text-slate-900 font-medium">{user?.full_name}</p>
            </div>
            <div>
              <Label className="text-slate-500">Email</Label>
              <p className="text-slate-900 font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-heading font-semibold text-slate-900">Business Profile</h2>
                <p className="text-sm text-slate-600">Update your business information</p>
              </div>
            </div>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white"
                  data-testid="settings-name-input"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sector</Label>
                  <Select value={formData.sector} onValueChange={handleSectorChange}>
                    <SelectTrigger data-testid="settings-sector-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-amber-600">
                    Note: Changing sector will regenerate your compliance checklist
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Business Size</Label>
                  <Select 
                    value={formData.size} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
                  >
                    <SelectTrigger data-testid="settings-size-select">
                      <SelectValue />
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
              </div>
              
              <div className="space-y-2">
                <Label>UK Nation</Label>
                <Select 
                  value={formData.uk_nation} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, uk_nation: value }))}
                >
                  <SelectTrigger data-testid="settings-nation-select">
                    <SelectValue />
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
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-white"
                  data-testid="settings-address-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white"
                  data-testid="settings-phone-input"
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800"
                data-testid="settings-save-btn"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
