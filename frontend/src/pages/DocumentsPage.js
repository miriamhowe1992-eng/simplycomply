import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  ChevronRight,
  Lock,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { business } = useAuth();
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
      const [docsRes, catsRes] = await Promise.all([
        api.get("/documents"),
        api.get("/reference/categories")
      ]);
      setDocuments(docsRes.data);
      setCategories(catsRes.data);
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const isSubscribed = business?.subscription_status === "active";

  const handleDownload = (doc) => {
    if (!isSubscribed) {
      toast.error("Please upgrade to download documents");
      navigate("/subscription");
      return;
    }
    // In production, this would trigger actual document download
    toast.success(`Downloading ${doc.title}...`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-slate-400">Loading documents...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div data-testid="documents-page" className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900">
            Document Library
          </h1>
          <p className="text-slate-600 mt-1">
            Access all compliance documents for your sector
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
              data-testid="documents-search-input"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-64 bg-white" data-testid="documents-category-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Documents by Category */}
        {Object.keys(groupedDocuments).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedDocuments).map(([category, docs]) => (
              <div key={category}>
                <h2 className="font-heading text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  {category}
                  <span className="text-sm font-normal text-slate-500">({docs.length})</span>
                </h2>
                
                <div className="grid gap-4">
                  {docs.map((doc) => (
                    <div 
                      key={doc.id}
                      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                      data-testid={`document-card-${doc.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-900 truncate">{doc.title}</h3>
                            {doc.is_mandatory && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{doc.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>Version {doc.version}</span>
                            <span>•</span>
                            <span>Updated: {new Date(doc.last_updated).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant={isSubscribed ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className={isSubscribed ? "bg-slate-900 hover:bg-slate-800" : ""}
                          data-testid={`download-btn-${doc.id}`}
                        >
                          {isSubscribed ? (
                            <>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-1" />
                              Upgrade
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
