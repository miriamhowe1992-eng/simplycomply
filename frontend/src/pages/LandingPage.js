import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  Shield, 
  CheckCircle2, 
  FileText, 
  Bell, 
  Users, 
  ArrowRight,
  ChevronRight,
  Star,
  ChevronDown,
  X
} from "lucide-react";
import { 
  getFeaturedIndustries, 
  getAllIndustries, 
  getIndustriesGroupedByCategory 
} from "../data/industries";
import { IndustryDetailModal } from "../components/IndustryDetailModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const features = [
  {
    icon: FileText,
    title: "Industry-Specific Templates",
    description: "Access pre-built compliance policies tailored to your sector, from Health & Safety to GDPR."
  },
  {
    icon: CheckCircle2,
    title: "Smart Checklists",
    description: "Auto-generated compliance checklists based on your business type and UK regulations."
  },
  {
    icon: Bell,
    title: "Review Reminders",
    description: "Never miss a compliance review with automated annual reminders and alerts."
  },
  {
    icon: Shield,
    title: "Regulatory Guidance",
    description: "Stay updated with CQC, HSE, and ICO requirements specific to your industry."
  }
];

export default function LandingPage() {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  
  const featuredIndustries = getFeaturedIndustries(8);
  const allIndustries = getAllIndustries();
  const groupedIndustries = getIndustriesGroupedByCategory();

  const handleIndustryClick = (industry) => {
    setSelectedIndustry(industry);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-teal-600" />
              <span className="font-heading text-xl font-semibold text-slate-900">SimplyComply</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#sectors" className="text-slate-600 hover:text-slate-900 transition-colors">Sectors</a>
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" data-testid="login-btn">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button data-testid="get-started-btn" className="bg-slate-900 hover:bg-slate-800">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative hero-mesh">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="trust-badge mb-6">
                <Star className="w-4 h-4" />
                Trusted by 500+ UK businesses
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                UK Business Compliance,{" "}
                <span className="text-teal-600">Made Simple</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-xl">
                Access all required compliance policies, procedures, and templates for your industry. 
                Stay compliant with UK regulations without the confusion.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" data-testid="hero-cta-btn" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#sectors">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Industries
                  </Button>
                </a>
              </div>
              
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Cancel anytime
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjQyMTd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwZGl2ZXJzZXxlbnwwfHx8fDE3Njg5NDg2MjJ8MA&ixlib=rb-4.1.0&q=85&w=800"
                alt="UK business team discussing compliance"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">85% Complete</p>
                    <p className="text-sm text-slate-500">Compliance Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section - Compact with View All */}
      <section id="sectors" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-overline text-teal-600 mb-4">INDUSTRIES WE SUPPORT</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Compliance Packs for Every UK Industry
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Select your business sector and get instant access to all required policies and procedures.
              We've got you covered with industry-specific compliance packs.
            </p>
          </div>
          
          {/* Industry Grid - Max 8 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {featuredIndustries.map((industry) => (
              <button 
                key={industry.id}
                onClick={() => handleIndustryClick(industry)}
                className="bg-white rounded-lg border border-slate-200 p-6 text-center card-hover cursor-pointer text-left transition-all hover:border-teal-300 hover:shadow-md group"
                data-testid={`sector-card-${industry.id}`}
              >
                <span className="text-4xl mb-3 block">{industry.icon}</span>
                <h3 className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">{industry.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{industry.shortDescription}</p>
                <div className="mt-3 text-xs text-teal-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
          
          {/* View All Button */}
          {allIndustries.length > 8 && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAllIndustries(true)}
                className="gap-2"
                data-testid="view-all-industries-btn"
              >
                View all {allIndustries.length} industries
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* All Industries Modal */}
      <Dialog open={showAllIndustries} onOpenChange={setShowAllIndustries}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">All Industries</DialogTitle>
            <p className="text-slate-600">Click any industry to see what's included in the compliance pack</p>
          </DialogHeader>
          
          <div className="space-y-8 mt-4">
            {Object.entries(groupedIndustries).map(([category, industries]) => (
              <div key={category}>
                <h3 className="font-heading font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-600 rounded-full" />
                  {category}
                  <span className="text-sm font-normal text-slate-500">({industries.length})</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => {
                        setShowAllIndustries(false);
                        setSelectedIndustry(industry);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left"
                      data-testid={`all-industries-${industry.id}`}
                    >
                      <span className="text-2xl">{industry.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{industry.name}</p>
                        <p className="text-xs text-slate-500">{industry.regulators?.join(", ")}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Industry Detail Modal */}
      <IndustryDetailModal 
        industry={selectedIndustry}
        open={!!selectedIndustry}
        onClose={() => setSelectedIndustry(null)}
      />

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-overline text-teal-600 mb-4">FEATURES</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Stay Compliant
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-6 card-hover"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-heading font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-overline text-teal-600 mb-4">PRICING</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-600">One plan, all features. Cancel anytime.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-8 card-hover">
              <h3 className="font-heading text-xl font-semibold text-slate-900 mb-2">Monthly</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-heading text-4xl font-bold text-slate-900">£29</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-slate-600 mb-6">Perfect for trying out SimplyComply</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  All compliance documents
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  Smart checklists
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  Employee compliance tracking
                </li>
                <li className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  Review reminders
                </li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full" data-testid="monthly-plan-btn">
                  Start Monthly Plan
                </Button>
              </Link>
            </div>
            
            {/* Annual Plan */}
            <div className="bg-slate-900 rounded-xl p-8 relative">
              <div className="absolute -top-3 right-6 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                SAVE 17%
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-2">Annual</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-heading text-4xl font-bold text-white">£290</span>
                <span className="text-slate-400">/year</span>
              </div>
              <p className="text-slate-400 mb-6">Best value for serious businesses</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  Everything in Monthly
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  2 months free
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  Version history
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-teal-600 hover:bg-teal-700" data-testid="annual-plan-btn">
                  Start Annual Plan
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to Simplify Your Compliance?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of UK businesses who trust SimplyComply for their compliance needs.
          </p>
          <Link to="/signup">
            <Button size="lg" data-testid="final-cta-btn" className="bg-slate-900 hover:bg-slate-800 shadow-lg">
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-teal-400" />
                <span className="font-heading text-lg font-semibold text-white">SimplyComply</span>
              </div>
              <p className="text-sm">
                © {new Date().getFullYear()} SimplyComply. Made for UK businesses.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <p className="text-xs text-slate-500 text-center max-w-3xl mx-auto">
                Requirements can vary by local authority and UK nation. SimplyComply assists with compliance documentation but does not guarantee regulatory approval or inspection outcomes.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
