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
  Building2, 
  ArrowRight,
  Users,
  Scale
} from "lucide-react";

export function IndustryDetailModal({ industry, open, onClose }) {
  const navigate = useNavigate();

  if (!industry) return null;

  const handleGetStarted = () => {
    onClose();
    navigate(`/signup?industry=${industry.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{industry.icon}</span>
            <div>
              <DialogTitle className="font-heading text-2xl">{industry.name}</DialogTitle>
              <p className="text-sm text-slate-500">Regulated by {industry.regulator}</p>
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
              Regulatory Bodies Covered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industry.regulatoryBodies.map((body, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="font-medium text-slate-900">{body.name}</div>
                  <div className="text-xs text-slate-500">{body.full}</div>
                  <div className="text-sm text-slate-600 mt-1">{body.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance Areas */}
          <section>
            <h3 className="font-heading font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-teal-600" />
              Compliance Areas Included
            </h3>
            <div className="flex flex-wrap gap-2">
              {industry.complianceAreas.filter(area => area.included).map((area, index) => (
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

          {/* Typical Documents */}
          <section>
            <h3 className="font-heading font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-teal-600" />
              Example Documents Included
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {industry.typicalDocuments.map((doc, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  {doc}
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-slate-900 rounded-xl p-6 text-center">
            <h3 className="font-heading text-xl font-semibold text-white mb-2">
              Ready to get compliant?
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Get instant access to all {industry.name.toLowerCase()} compliance documents and checklists.
            </p>
            <Button 
              onClick={handleGetStarted}
              className="bg-teal-600 hover:bg-teal-700"
              data-testid="industry-modal-cta"
            >
              Get this compliance pack
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
