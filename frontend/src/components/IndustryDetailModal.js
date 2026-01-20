import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { 
  CheckCircle2, 
  Shield, 
  FileText, 
  ArrowRight,
  Users,
  Scale,
  Info,
  ExternalLink
} from "lucide-react";
import { 
  COMPLIANCE_AREAS, 
  REGULATORY_BODIES,
  getComplianceAreasForIndustry,
  getRegulatoryBodiesForIndustry 
} from "../data/industries";

export function IndustryDetailModal({ industry, open, onClose }) {
  const navigate = useNavigate();

  if (!industry) return null;

  const handleGetStarted = () => {
    onClose();
    navigate(`/signup?industry=${industry.id}`);
  };

  const complianceAreas = getComplianceAreasForIndustry(industry.id);
  const regulatoryBodies = getRegulatoryBodiesForIndustry(industry.id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{industry.icon}</span>
            <div>
              <DialogTitle className="font-heading text-2xl">{industry.name}</DialogTitle>
              <p className="text-sm text-slate-500">{industry.category}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overview */}
          <section>
            <p className="text-slate-600 leading-relaxed">
              {industry.description}
            </p>
          </section>

          {/* Who is it for */}
          <section>
            <h3 className="font-heading font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-teal-600" />
              Who is this for?
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {industry.whoIsItFor.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Regulatory Bodies */}
          <section>
            <h3 className="font-heading font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-teal-600" />
              Regulatory Bodies We Help You Prepare For
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {regulatoryBodies.map((body, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{body.abbr}</div>
                      <div className="text-xs text-slate-500">{body.full}</div>
                    </div>
                    {body.url && (
                      <a 
                        href={body.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-teal-700"
                        title="Visit regulator website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{body.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance Areas */}
          <section>
            <h3 className="font-heading font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-teal-600" />
              Compliance Areas Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {complianceAreas.map((area, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {area.name}
                </span>
              ))}
            </div>
          </section>

          {/* Example Documents */}
          <section>
            <h3 className="font-heading font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-teal-600" />
              Example Documents & Templates
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {industry.exampleDocuments.map((doc, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  {doc}
                </li>
              ))}
            </ul>
          </section>

          {/* Industry Disclaimer */}
          <section className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm mb-1">Important Information</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {industry.industryDisclaimer}
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-slate-900 rounded-xl p-6 text-center">
            <h3 className="font-heading text-xl font-semibold text-white mb-2">
              Ready to simplify your compliance?
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Get instant access to all {industry.name.toLowerCase()} policies, templates, and guidance.
            </p>
            <Button 
              onClick={handleGetStarted}
              className="bg-teal-600 hover:bg-teal-700"
              data-testid="industry-modal-cta"
            >
              Get this compliance pack
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-slate-400 mt-3">
              We help you understand and prepare — you maintain control of your compliance journey.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
