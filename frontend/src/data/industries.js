// SimplyComply UK Industries - Single Source of Truth
// This file is the central data model for all industry-related content
// Changes here automatically update: Homepage, View All, Detail Modals, Signup, Onboarding

// ==================== COMPLIANCE AREAS DEFINITIONS ====================
// Only include compliance areas that are genuinely relevant to each industry

export const COMPLIANCE_AREAS = {
  health_safety: { id: "health_safety", name: "Health & Safety", icon: "🛡️" },
  gdpr: { id: "gdpr", name: "GDPR & Data Protection", icon: "🔒" },
  equality: { id: "equality", name: "Equality & Diversity", icon: "⚖️" },
  safeguarding: { id: "safeguarding", name: "Safeguarding", icon: "👥" },
  complaints: { id: "complaints", name: "Complaints Procedures", icon: "📝" },
  risk_assessment: { id: "risk_assessment", name: "Risk Assessments", icon: "📋" },
  staff_handbook: { id: "staff_handbook", name: "Staff Handbook", icon: "📖" },
  mandatory_posters: { id: "mandatory_posters", name: "Mandatory Posters & Notices", icon: "📌" },
  infection_control: { id: "infection_control", name: "Infection Control", icon: "🧴" },
  food_safety: { id: "food_safety", name: "Food Safety", icon: "🍽️" },
  fire_safety: { id: "fire_safety", name: "Fire Safety", icon: "🔥" },
  coshh: { id: "coshh", name: "COSHH (Chemical Safety)", icon: "⚗️" },
  manual_handling: { id: "manual_handling", name: "Manual Handling", icon: "📦" },
  medication: { id: "medication", name: "Medication Management", icon: "💊" },
  controlled_drugs: { id: "controlled_drugs", name: "Controlled Drugs", icon: "💉" },
  dbs_checks: { id: "dbs_checks", name: "DBS & Vetting", icon: "✅" },
  insurance: { id: "insurance", name: "Insurance Requirements", icon: "📄" },
  licensing: { id: "licensing", name: "Licensing & Registration", icon: "🏷️" },
  environmental: { id: "environmental", name: "Environmental", icon: "🌱" },
  client_care: { id: "client_care", name: "Client Care & Consent", icon: "🤝" },
};

// ==================== REGULATORY BODIES ====================

export const REGULATORY_BODIES = {
  CQC: { 
    abbr: "CQC", 
    full: "Care Quality Commission", 
    description: "Regulates health and social care services in England",
    url: "https://www.cqc.org.uk"
  },
  GDC: { 
    abbr: "GDC", 
    full: "General Dental Council", 
    description: "Professional regulator for dental professionals",
    url: "https://www.gdc-uk.org"
  },
  HSE: { 
    abbr: "HSE", 
    full: "Health and Safety Executive", 
    description: "Workplace health, safety and welfare regulator",
    url: "https://www.hse.gov.uk"
  },
  ICO: { 
    abbr: "ICO", 
    full: "Information Commissioner's Office", 
    description: "UK data protection and privacy regulator",
    url: "https://ico.org.uk"
  },
  RCVS: { 
    abbr: "RCVS", 
    full: "Royal College of Veterinary Surgeons", 
    description: "Regulates veterinary surgeons and veterinary nurses",
    url: "https://www.rcvs.org.uk"
  },
  GPhC: { 
    abbr: "GPhC", 
    full: "General Pharmaceutical Council", 
    description: "Regulates pharmacists, pharmacy technicians and pharmacies",
    url: "https://www.pharmacyregulation.org"
  },
  Ofsted: { 
    abbr: "Ofsted", 
    full: "Office for Standards in Education", 
    description: "Inspects and regulates education and childcare",
    url: "https://www.gov.uk/government/organisations/ofsted"
  },
  EHO: { 
    abbr: "EHO", 
    full: "Environmental Health Office", 
    description: "Local authority enforcement of hygiene and safety standards",
    url: null
  },
  FSA: { 
    abbr: "FSA", 
    full: "Food Standards Agency", 
    description: "Responsible for food safety and food hygiene",
    url: "https://www.food.gov.uk"
  },
  SIA: { 
    abbr: "SIA", 
    full: "Security Industry Authority", 
    description: "Regulates the private security industry",
    url: "https://www.sia.homeoffice.gov.uk"
  },
  NICEIC: { 
    abbr: "NICEIC", 
    full: "National Inspection Council for Electrical Installation Contracting", 
    description: "Electrical contractor competence scheme",
    url: "https://www.niceic.com"
  },
  GasSafe: { 
    abbr: "Gas Safe", 
    full: "Gas Safe Register", 
    description: "Official list of gas engineers legally allowed to work on gas",
    url: "https://www.gassaferegister.co.uk"
  },
  TradingStandards: { 
    abbr: "Trading Standards", 
    full: "Trading Standards", 
    description: "Consumer protection and fair trading enforcement",
    url: null
  },
  CharityCommission: { 
    abbr: "Charity Commission", 
    full: "Charity Commission for England and Wales", 
    description: "Regulator and registrar for charities",
    url: "https://www.gov.uk/government/organisations/charity-commission"
  },
};

// ==================== INDUSTRIES DATA ====================

export const UK_INDUSTRIES = [
  // ========== HEALTHCARE ==========
  {
    id: "dental",
    name: "Dental Practice",
    category: "Healthcare",
    icon: "🦷",
    regulators: ["CQC", "GDC", "HSE", "ICO"],
    shortDescription: "Private and NHS dental practices, orthodontists, and dental hygienists",
    description: "Our dental practice compliance pack helps you meet the requirements of the Care Quality Commission (CQC) and General Dental Council (GDC). We provide the policies, procedures and guidance you need to demonstrate compliance with the fundamental standards of care.",
    whoIsItFor: [
      "NHS dental practices",
      "Private dental clinics",
      "Orthodontic practices",
      "Dental hygienist practices",
      "Domiciliary dental services"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "infection_control", "dbs_checks"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Infection Control Policy (HTM 01-05)",
      "Safeguarding Adults & Children Policy",
      "GDPR Patient Privacy Notice",
      "Complaints Handling Procedure",
      "Sharps & Needlestick Protocol",
      "Radiation Protection Policy",
      "Medical Emergency Procedures",
      "Staff Induction Checklist",
      "CQC Statement of Purpose"
    ],
    industryDisclaimer: "Dental practices must be registered with the CQC. Individual practitioners must maintain their GDC registration. This pack supports your compliance journey but does not replace professional registration requirements.",
    featured: true
  },
  {
    id: "healthcare",
    name: "Healthcare Provider",
    category: "Healthcare",
    icon: "🏥",
    regulators: ["CQC", "HSE", "ICO"],
    shortDescription: "GP surgeries, clinics, nursing services, and independent healthcare providers",
    description: "Comprehensive compliance support for healthcare providers regulated by the Care Quality Commission. Our pack covers the five key questions: Safe, Effective, Caring, Responsive, and Well-led, helping you prepare for inspections with confidence.",
    whoIsItFor: [
      "GP surgeries",
      "Private clinics",
      "Community nursing services",
      "Diagnostic centres",
      "Home healthcare providers"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "infection_control", "medication", "dbs_checks"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Safeguarding Policy (Adults & Children)",
      "Infection Prevention & Control Policy",
      "Medicines Management Policy",
      "Information Governance Policy",
      "Complaints Procedure",
      "Clinical Risk Assessment",
      "Consent Policy",
      "Duty of Candour Policy",
      "Staff Training Matrix"
    ],
    industryDisclaimer: "Healthcare providers must be registered with the CQC for regulated activities. Clinical staff must maintain appropriate professional registration. This pack supports your compliance but does not replace regulatory requirements.",
    featured: true
  },
  {
    id: "care_home",
    name: "Care Home",
    category: "Healthcare",
    icon: "🏡",
    regulators: ["CQC", "HSE", "ICO"],
    shortDescription: "Residential care homes, nursing homes, and supported living services",
    description: "Everything you need to run a compliant care home. Our pack covers CQC fundamental standards, helping you provide outstanding care while meeting your regulatory obligations. Includes guidance on the Care Act 2014 and Mental Capacity Act.",
    whoIsItFor: [
      "Residential care homes",
      "Nursing homes",
      "Supported living services",
      "Dementia care specialists",
      "Respite care providers"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "infection_control", "medication", "manual_handling", "dbs_checks"],
    exampleDocuments: [
      "Safeguarding Adults Policy",
      "Mental Capacity & DoLS Policy",
      "Medication Administration Policy",
      "Falls Prevention Policy",
      "Moving & Handling Policy",
      "Infection Control Policy",
      "Complaints Procedure",
      "Care Plan Templates",
      "Staff Supervision Policy",
      "Resident Privacy Notice"
    ],
    industryDisclaimer: "Care homes must be registered with the CQC. This pack supports your compliance journey and inspection preparation but does not guarantee CQC registration or ratings.",
    featured: true
  },
  {
    id: "veterinary",
    name: "Veterinary Practice",
    category: "Healthcare",
    icon: "🐾",
    regulators: ["RCVS", "HSE", "ICO"],
    shortDescription: "Veterinary surgeries, animal hospitals, and pet clinics",
    description: "Complete compliance support for veterinary practices. We help you meet RCVS Practice Standards Scheme requirements and workplace health and safety obligations, so you can focus on animal care.",
    whoIsItFor: [
      "Small animal practices",
      "Equine veterinary services",
      "Farm animal practices",
      "Emergency veterinary hospitals",
      "Mobile veterinary services"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "infection_control", "controlled_drugs", "coshh"],
    exampleDocuments: [
      "Health & Safety Policy",
      "RCVS Practice Standards Guide",
      "Controlled Drugs Policy",
      "Infection Control & Biosecurity Policy",
      "Radiation Protection (X-ray) Policy",
      "Client Complaints Procedure",
      "Clinical Waste Management",
      "Staff Handbook",
      "GDPR Client Privacy Notice",
      "Emergency Procedures"
    ],
    industryDisclaimer: "Veterinary practices should consider RCVS Practice Standards Scheme accreditation. Individual vets and nurses must maintain RCVS registration. This pack supports your compliance but does not replace professional requirements.",
    featured: true
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    category: "Healthcare",
    icon: "💊",
    regulators: ["GPhC", "HSE", "ICO"],
    shortDescription: "Community pharmacies, dispensing chemists, and pharmacy services",
    description: "Compliance support for community pharmacies, helping you meet General Pharmaceutical Council standards. Our pack covers medicines management, patient safety, and professional standards.",
    whoIsItFor: [
      "Community pharmacies",
      "Dispensing practices",
      "Hospital pharmacy services",
      "Online pharmacies",
      "Pharmacy chains"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "controlled_drugs", "medication"],
    exampleDocuments: [
      "Standard Operating Procedures",
      "Controlled Drugs Policy",
      "Dispensing Error Procedure",
      "Patient Group Directions",
      "Complaints Procedure",
      "Information Governance Policy",
      "Responsible Pharmacist Procedures",
      "Staff Training Records",
      "Near Miss Recording",
      "Emergency Supply Procedures"
    ],
    industryDisclaimer: "Pharmacies must be registered with the GPhC. Pharmacists and pharmacy technicians must maintain individual GPhC registration. This pack supports your compliance but does not replace professional registration.",
    featured: false
  },

  // ========== EDUCATION ==========
  {
    id: "nursery",
    name: "Nursery & Childcare",
    category: "Education",
    icon: "👶",
    regulators: ["Ofsted", "HSE", "ICO"],
    shortDescription: "Day nurseries, pre-schools, childminders, and early years providers",
    description: "Keep your early years setting compliant with Ofsted requirements and the Early Years Foundation Stage (EYFS). Our pack helps you focus on providing outstanding childcare while meeting your regulatory obligations.",
    whoIsItFor: [
      "Day nurseries",
      "Pre-schools and playgroups",
      "Registered childminders",
      "Out-of-school clubs",
      "Holiday clubs"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "food_safety", "dbs_checks"],
    exampleDocuments: [
      "Child Protection & Safeguarding Policy",
      "Health & Safety Policy",
      "Behaviour Management Policy",
      "Food Safety & Hygiene Policy",
      "Administering Medicines Policy",
      "Complaints Procedure",
      "SEND Policy",
      "Staff Suitability & Recruitment",
      "Risk Assessment Templates",
      "Parent Privacy Notice"
    ],
    industryDisclaimer: "Childcare providers caring for children under 8 must register with Ofsted. Staff working with children require enhanced DBS checks. This pack supports your Ofsted preparation but does not guarantee registration or inspection outcomes.",
    featured: true
  },
  {
    id: "education",
    name: "School & College",
    category: "Education",
    icon: "📚",
    regulators: ["Ofsted", "HSE", "ICO"],
    shortDescription: "Schools, colleges, tuition centres, and educational institutions",
    description: "Meet Ofsted requirements and keep children safe with our education compliance pack. Fully aligned with Keeping Children Safe in Education (KCSIE) and the Education Inspection Framework.",
    whoIsItFor: [
      "Primary schools",
      "Secondary schools",
      "Colleges and sixth forms",
      "Independent schools",
      "Tuition centres"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "dbs_checks"],
    exampleDocuments: [
      "Child Protection Policy (KCSIE)",
      "Behaviour & Anti-Bullying Policy",
      "Health & Safety Policy",
      "Educational Visits Policy",
      "Allegations Against Staff",
      "Complaints Procedure",
      "SEND Policy",
      "Staff Code of Conduct",
      "Prevent Duty Policy",
      "Online Safety Policy"
    ],
    industryDisclaimer: "Schools must follow statutory guidance including Keeping Children Safe in Education. This pack supports your safeguarding and compliance obligations but does not replace statutory requirements.",
    featured: false
  },

  // ========== CONSTRUCTION ==========
  {
    id: "construction",
    name: "Construction",
    category: "Construction",
    icon: "🏗️",
    regulators: ["HSE"],
    shortDescription: "Building contractors, civil engineering, and construction companies",
    description: "Stay CDM 2015 compliant with our construction compliance pack. We help you meet your health and safety duties whether you're a principal contractor, contractor, or client.",
    whoIsItFor: [
      "Building contractors",
      "Civil engineering firms",
      "Specialist subcontractors",
      "House builders",
      "Renovation companies"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "coshh", "manual_handling", "environmental"],
    exampleDocuments: [
      "Health & Safety Policy (CDM 2015)",
      "Site Risk Assessment Templates",
      "COSHH Assessments",
      "Method Statement Templates",
      "Asbestos Management Plan",
      "Working at Height Procedures",
      "Manual Handling Assessment",
      "Noise Assessment",
      "Site Induction Checklist",
      "Accident Reporting Procedure"
    ],
    industryDisclaimer: "Construction work must comply with CDM 2015 Regulations. Principal contractors have specific legal duties. This pack provides guidance and templates but responsibility for compliance remains with duty holders.",
    featured: true
  },
  {
    id: "electrical",
    name: "Electrical Contractor",
    category: "Construction",
    icon: "⚡",
    regulators: ["HSE", "NICEIC"],
    shortDescription: "Electricians, electrical contractors, and testing services",
    description: "Compliance support for electrical contractors, covering BS 7671, Part P, and health and safety requirements. We help you maintain professional standards and meet your legal obligations.",
    whoIsItFor: [
      "Domestic electricians",
      "Commercial electrical contractors",
      "Industrial electricians",
      "Testing and inspection services",
      "Solar installation companies"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "coshh", "manual_handling"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Electrical Safety Policy",
      "Safe Isolation Procedures",
      "Risk Assessment Templates",
      "Working at Height Procedures",
      "Asbestos Awareness Guidance",
      "PPE Policy",
      "Client Complaints Procedure",
      "Staff Training Records",
      "Vehicle Safety Checklist"
    ],
    industryDisclaimer: "Electrical work must comply with BS 7671 and Building Regulations Part P. Consider joining a competent person scheme such as NICEIC. This pack supports your compliance but does not replace certification requirements.",
    featured: false
  },
  {
    id: "plumbing",
    name: "Plumbing & Heating",
    category: "Construction",
    icon: "🔧",
    regulators: ["HSE", "GasSafe"],
    shortDescription: "Plumbers, heating engineers, and gas installers",
    description: "Compliance support for plumbing and heating businesses. Includes Gas Safe requirements for gas work and general health and safety guidance for all plumbing services.",
    whoIsItFor: [
      "Plumbing contractors",
      "Gas engineers",
      "Heating installers",
      "Boiler service engineers",
      "Bathroom fitters"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "coshh", "manual_handling"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Gas Safety Procedures",
      "Risk Assessment Templates",
      "Asbestos Awareness Policy",
      "Manual Handling Assessment",
      "Working in Occupied Premises",
      "Client Complaints Procedure",
      "Vehicle & Tool Inventory",
      "Staff Training Records",
      "Customer Satisfaction Form"
    ],
    industryDisclaimer: "Gas work must only be carried out by Gas Safe registered engineers. This pack supports general compliance but does not replace Gas Safe registration for gas work.",
    featured: false
  },

  // ========== HOSPITALITY ==========
  {
    id: "hospitality",
    name: "Hotel & Hospitality",
    category: "Hospitality",
    icon: "🏨",
    regulators: ["EHO", "HSE"],
    shortDescription: "Hotels, B&Bs, guest houses, and hospitality venues",
    description: "Complete compliance support for the hospitality industry. From fire safety to food hygiene, we help you meet your legal obligations and provide a safe environment for guests and staff.",
    whoIsItFor: [
      "Hotels and resorts",
      "Bed & breakfasts",
      "Guest houses",
      "Serviced apartments",
      "Holiday lets"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "food_safety", "fire_safety", "manual_handling"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Fire Safety Policy & Risk Assessment",
      "Food Safety Management System",
      "Allergen Management Policy",
      "Guest Privacy Notice",
      "Complaints Procedure",
      "COSHH Assessment (Cleaning)",
      "Legionella Risk Assessment",
      "Staff Handbook",
      "Accessibility Policy"
    ],
    industryDisclaimer: "Hospitality businesses must comply with food hygiene regulations, fire safety requirements, and licensing conditions where applicable. This pack supports your compliance but does not replace local authority inspections.",
    featured: true
  },
  {
    id: "restaurant",
    name: "Restaurant & Café",
    category: "Hospitality",
    icon: "🍽️",
    regulators: ["EHO", "FSA"],
    shortDescription: "Restaurants, cafes, coffee shops, and food service businesses",
    description: "Achieve and maintain your food hygiene rating with confidence. Our pack covers HACCP, allergen management, and all the policies you need to run a safe and compliant food business.",
    whoIsItFor: [
      "Restaurants and bistros",
      "Cafes and coffee shops",
      "Fast casual dining",
      "Fine dining establishments",
      "Pop-up food venues"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "food_safety", "fire_safety", "coshh"],
    exampleDocuments: [
      "Food Safety Management System (HACCP)",
      "Allergen Management Policy",
      "Health & Safety Policy",
      "Fire Safety Procedures",
      "Cleaning Schedules",
      "Temperature Monitoring Records",
      "Staff Training Records",
      "Complaints Procedure",
      "Supplier Approval Process",
      "Pest Control Policy"
    ],
    industryDisclaimer: "Food businesses must register with their local authority and comply with food hygiene regulations. Allergen information must be provided to customers (Natasha's Law). This pack supports your compliance but does not guarantee food hygiene ratings.",
    featured: false
  },
  {
    id: "takeaway",
    name: "Takeaway & Fast Food",
    category: "Hospitality",
    icon: "🍕",
    regulators: ["EHO", "FSA"],
    shortDescription: "Takeaways, fast food outlets, and delivery kitchens",
    description: "Food safety compliance for takeaway and fast food operations. We cover HACCP, allergen management, and food delivery safety requirements.",
    whoIsItFor: [
      "Takeaway restaurants",
      "Fast food outlets",
      "Dark kitchens",
      "Food delivery services",
      "Mobile food vendors"
    ],
    complianceAreas: ["health_safety", "gdpr", "complaints", "risk_assessment", "staff_handbook", "food_safety", "fire_safety", "coshh"],
    exampleDocuments: [
      "Food Safety Management System",
      "Allergen Policy & Matrix",
      "Delivery Food Safety Procedures",
      "Health & Safety Policy",
      "Cleaning Schedules",
      "Temperature Records",
      "Staff Training Log",
      "Complaints Procedure",
      "Fire Safety Procedures",
      "Waste Management"
    ],
    industryDisclaimer: "Food businesses must be registered with their local authority. Allergen information must be available for all menu items. Food hygiene ratings are displayed publicly. This pack supports compliance but does not guarantee ratings.",
    featured: false
  },

  // ========== RETAIL ==========
  {
    id: "retail",
    name: "Retail Shop",
    category: "Retail",
    icon: "🛍️",
    regulators: ["TradingStandards", "HSE"],
    shortDescription: "High street shops, boutiques, and retail businesses",
    description: "Stay compliant with consumer law and workplace regulations. Our pack covers Trading Standards requirements, health and safety, and customer data protection for retail businesses.",
    whoIsItFor: [
      "High street retailers",
      "Independent shops",
      "Boutiques",
      "Charity shops",
      "Market traders"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "fire_safety", "manual_handling"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Fire Safety Procedures",
      "Customer Complaints & Returns Policy",
      "GDPR Customer Privacy Notice",
      "Manual Handling Assessment",
      "Display Screen Equipment Assessment",
      "Accident Reporting Procedure",
      "Staff Handbook",
      "Cash Handling Procedures",
      "Shoplifting & Security Policy"
    ],
    industryDisclaimer: "Retail businesses must comply with Consumer Rights Act 2015, product safety regulations, and Trading Standards requirements. This pack provides guidance but responsibility for compliance remains with the business owner.",
    featured: true
  },

  // ========== PERSONAL & WELLBEING SERVICES ==========
  {
    id: "massage_therapist",
    name: "Massage Therapist",
    category: "Personal & Wellbeing Services",
    icon: "💆",
    regulators: ["EHO", "HSE", "ICO"],
    shortDescription: "Sports massage, remedial massage, and therapeutic massage practitioners",
    description: "Compliance support for massage therapists, whether you work from a clinic, mobile, or home-based practice. We cover hygiene standards, client safety, insurance requirements, and data protection.",
    whoIsItFor: [
      "Sports massage therapists",
      "Remedial massage practitioners",
      "Swedish massage therapists",
      "Deep tissue specialists",
      "Mobile massage therapists"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "infection_control", "client_care", "insurance"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Infection Control Policy",
      "Client Consultation Form",
      "Consent & Contraindications Form",
      "Treatment Record Template",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Insurance Checklist",
      "Lone Working Policy",
      "Safeguarding Awareness"
    ],
    industryDisclaimer: "Massage therapists should hold appropriate qualifications and insurance. Some local authorities require special treatment licences. This pack supports good practice but does not replace professional training or insurance.",
    featured: false
  },
  {
    id: "beauty_therapist",
    name: "Beauty Therapist",
    category: "Personal & Wellbeing Services",
    icon: "💅",
    regulators: ["EHO"],
    shortDescription: "Beauty treatments, facials, waxing, and skincare specialists",
    description: "Compliance support for beauty therapists covering hygiene standards, client care, and local authority requirements. Whether salon-based or mobile, we help you maintain professional standards.",
    whoIsItFor: [
      "Beauty salons",
      "Mobile beauty therapists",
      "Skincare specialists",
      "Waxing practitioners",
      "Lash and brow technicians"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "infection_control", "client_care", "coshh", "insurance"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Sterilisation Policy",
      "Client Consultation Card",
      "Patch Test Records",
      "Contraindications Guide",
      "COSHH Assessment (Products)",
      "Client Privacy Notice",
      "Complaints Procedure",
      "Treatment Pricing Policy",
      "Insurance Requirements"
    ],
    industryDisclaimer: "Some beauty treatments may require local authority registration (e.g., skin piercing, tattooing). Ensure appropriate qualifications and insurance. This pack supports good practice but does not replace regulatory requirements.",
    featured: false
  },
  {
    id: "nail_technician",
    name: "Nail Technician",
    category: "Personal & Wellbeing Services",
    icon: "💅",
    regulators: ["EHO"],
    shortDescription: "Nail salons, manicures, pedicures, and nail art services",
    description: "Compliance support for nail technicians covering hygiene standards, ventilation requirements, and chemical safety. We help you maintain a safe environment for clients and staff.",
    whoIsItFor: [
      "Nail salons",
      "Mobile nail technicians",
      "Nail bars",
      "Manicure specialists",
      "Acrylic and gel nail technicians"
    ],
    complianceAreas: ["health_safety", "gdpr", "complaints", "risk_assessment", "infection_control", "client_care", "coshh", "insurance"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Sterilisation Procedures",
      "COSHH Assessment (Nail Products)",
      "Ventilation & Air Quality Policy",
      "Client Consultation Form",
      "Complaints Procedure",
      "Client Privacy Notice",
      "Tool Cleaning Checklist",
      "Allergy & Sensitivity Guidance",
      "Insurance Checklist"
    ],
    industryDisclaimer: "Nail services involve chemical products requiring proper ventilation and COSHH compliance. Ensure appropriate qualifications and insurance. This pack supports good practice but does not replace health and safety requirements.",
    featured: false
  },
  {
    id: "holistic_therapist",
    name: "Holistic Therapist",
    category: "Personal & Wellbeing Services",
    icon: "🧘",
    regulators: ["EHO", "ICO"],
    shortDescription: "Aromatherapy, reflexology, reiki, and complementary therapies",
    description: "Compliance support for holistic and complementary therapists. We cover client safety, consent, data protection, and professional standards for a range of therapies.",
    whoIsItFor: [
      "Aromatherapists",
      "Reflexologists",
      "Reiki practitioners",
      "Acupuncturists",
      "Homeopaths"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "infection_control", "client_care", "insurance"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Client Consultation Form",
      "Informed Consent Form",
      "Treatment Records Template",
      "Contraindications Checklist",
      "Client Privacy Notice",
      "Complaints Procedure",
      "Hygiene Policy",
      "Insurance Requirements",
      "Scope of Practice Statement"
    ],
    industryDisclaimer: "Holistic therapists should be clear about the scope of their practice and not make medical claims. Some therapies may require local authority registration. This pack supports professional practice but does not replace appropriate training.",
    featured: false
  },
  {
    id: "yoga_pilates",
    name: "Yoga / Pilates Instructor",
    category: "Personal & Wellbeing Services",
    icon: "🧘‍♀️",
    regulators: ["HSE", "ICO"],
    shortDescription: "Yoga teachers, Pilates instructors, and movement practitioners",
    description: "Compliance support for yoga and Pilates instructors. Whether teaching in studios, gyms, or privately, we cover health and safety, client screening, and insurance requirements.",
    whoIsItFor: [
      "Yoga teachers",
      "Pilates instructors",
      "Studio owners",
      "Corporate wellness providers",
      "Online class instructors"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "client_care", "insurance"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Client Health Screening Form",
      "Informed Consent & Waiver",
      "Class Risk Assessment",
      "Emergency Procedures",
      "Client Privacy Notice",
      "Complaints Procedure",
      "Insurance Checklist",
      "Equipment Safety Checks",
      "First Aid Procedures"
    ],
    industryDisclaimer: "Instructors should hold recognised qualifications and appropriate insurance. Client health screening is essential. This pack supports safe practice but does not replace professional training or insurance requirements.",
    featured: false
  },
  {
    id: "home_services",
    name: "Home-based Personal Services",
    category: "Personal & Wellbeing Services",
    icon: "🏠",
    regulators: ["EHO", "HSE"],
    shortDescription: "Therapists, beauticians, and practitioners working from home",
    description: "Compliance support for practitioners offering personal services from home. We cover the additional considerations for home-based work including insurance, hygiene, and client safety.",
    whoIsItFor: [
      "Home-based beauty therapists",
      "Home salon operators",
      "Private treatment rooms",
      "Mobile practitioners with home base",
      "Home-based wellness practitioners"
    ],
    complianceAreas: ["health_safety", "gdpr", "complaints", "risk_assessment", "infection_control", "client_care", "insurance", "fire_safety"],
    exampleDocuments: [
      "Home Working Health & Safety Policy",
      "Home Insurance Guidance",
      "Client Booking & Access Procedures",
      "Hygiene & Cleaning Schedule",
      "Fire Safety for Home Businesses",
      "Client Privacy Notice",
      "Complaints Procedure",
      "Risk Assessment (Home Environment)",
      "Emergency Procedures",
      "Planning Permission Guidance"
    ],
    industryDisclaimer: "Home-based businesses may need to notify insurers and check lease or mortgage conditions. Planning permission may be required for certain changes. This pack provides guidance but professional advice should be sought where needed.",
    featured: false
  },

  // ========== PROFESSIONAL SERVICES ==========
  {
    id: "office",
    name: "Office & Professional Services",
    category: "Professional Services",
    icon: "💼",
    regulators: ["HSE", "ICO"],
    shortDescription: "Offices, consultancies, and professional service firms",
    description: "Simple compliance for office-based businesses. We cover workplace health and safety, display screen equipment, data protection, and the essentials for professional service providers.",
    whoIsItFor: [
      "Professional service firms",
      "Consultancies",
      "Tech companies",
      "Marketing agencies",
      "Financial advisors"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "fire_safety"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Display Screen Equipment Policy",
      "Data Protection Policy",
      "Fire Safety Procedures",
      "Homeworking Policy",
      "Staff Handbook",
      "Complaints Procedure",
      "Accident Reporting",
      "First Aid Procedures",
      "Stress & Wellbeing Policy"
    ],
    industryDisclaimer: "Office-based businesses must comply with workplace health and safety regulations and GDPR. This pack provides essential policies but may need supplementing for regulated professions.",
    featured: false
  },

  // ========== SERVICES ==========
  {
    id: "cleaning",
    name: "Cleaning Services",
    category: "Services",
    icon: "🧹",
    regulators: ["HSE"],
    shortDescription: "Commercial and domestic cleaning companies",
    description: "Compliance support for cleaning businesses covering COSHH, manual handling, and working safely on client premises. Perfect for contract cleaners and cleaning agencies.",
    whoIsItFor: [
      "Commercial cleaning companies",
      "Domestic cleaning services",
      "Specialist cleaning (end of tenancy)",
      "Window cleaning",
      "Facilities management"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "coshh", "manual_handling", "dbs_checks"],
    exampleDocuments: [
      "Health & Safety Policy",
      "COSHH Assessment",
      "Manual Handling Policy",
      "Working on Client Premises",
      "Lone Working Policy",
      "Key Holding Procedures",
      "Staff Vetting Policy",
      "Complaints Procedure",
      "Equipment Safety Checks",
      "Accident Reporting"
    ],
    industryDisclaimer: "Cleaning staff working in certain environments (e.g., schools, care homes) may require DBS checks. COSHH assessments are legally required for cleaning chemicals. This pack supports your compliance obligations.",
    featured: false
  },
  {
    id: "security",
    name: "Security Services",
    category: "Services",
    icon: "🛡️",
    regulators: ["SIA", "HSE"],
    shortDescription: "Security guards, door supervisors, and CCTV operators",
    description: "Stay SIA compliant with our security industry pack. We cover licensing requirements, use of force policies, and CCTV operation for all types of security services.",
    whoIsItFor: [
      "Manned guarding services",
      "Door supervisors",
      "CCTV operators",
      "Close protection",
      "Key holding services"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "licensing", "dbs_checks"],
    exampleDocuments: [
      "Health & Safety Policy",
      "SIA Licensing Compliance",
      "Use of Force Policy",
      "CCTV Policy (Surveillance Code)",
      "Conflict Management Procedures",
      "Lone Working Policy",
      "Complaints Procedure",
      "Incident Reporting",
      "Staff Vetting & DBS",
      "Data Protection (CCTV)"
    ],
    industryDisclaimer: "Security operatives must hold valid SIA licences. Companies providing security services must be SIA approved contractors or ensure all staff are licensed. This pack supports compliance but does not replace SIA requirements.",
    featured: false
  },

  // ========== LEISURE ==========
  {
    id: "gym",
    name: "Gym & Fitness",
    category: "Leisure",
    icon: "🏋️",
    regulators: ["HSE"],
    shortDescription: "Gyms, fitness centres, personal trainers, and sports facilities",
    description: "Compliance support for the fitness industry. We cover equipment safety, member welfare, and health screening to help you run a safe and professional facility.",
    whoIsItFor: [
      "Gyms and fitness centres",
      "Personal training studios",
      "Yoga and Pilates studios",
      "Sports clubs",
      "Leisure centres"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "client_care", "insurance"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Equipment Safety & Maintenance",
      "Member Health Screening",
      "Emergency Procedures",
      "First Aid Policy",
      "Complaints Procedure",
      "Member Privacy Notice",
      "Staff Training Records",
      "Pool Safety (if applicable)",
      "Accident Reporting"
    ],
    industryDisclaimer: "Fitness facilities should follow industry standards such as UK Active guidelines. Personal trainers should hold recognised qualifications and insurance. This pack supports good practice but does not replace professional requirements.",
    featured: false
  },

  // ========== THIRD SECTOR ==========
  {
    id: "charity",
    name: "Charity & Non-Profit",
    category: "Third Sector",
    icon: "❤️",
    regulators: ["CharityCommission", "ICO"],
    shortDescription: "Charities, CICs, and non-profit organisations",
    description: "Governance and compliance support for the charity sector. We cover Charity Commission requirements, safeguarding, data protection, and trustee responsibilities.",
    whoIsItFor: [
      "Registered charities",
      "Community interest companies",
      "Social enterprises",
      "Voluntary organisations",
      "Faith-based organisations"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "risk_assessment", "staff_handbook", "dbs_checks"],
    exampleDocuments: [
      "Safeguarding Policy",
      "Trustee Code of Conduct",
      "Volunteer Policy",
      "Data Protection Policy",
      "Fundraising Compliance",
      "Complaints Procedure",
      "Conflict of Interest Policy",
      "Financial Controls",
      "Health & Safety Policy",
      "Risk Management Framework"
    ],
    industryDisclaimer: "Charities must comply with Charity Commission guidance. Trustees have legal duties. Safeguarding requirements depend on beneficiary groups. This pack supports good governance but does not replace legal or professional advice.",
    featured: false
  },

  // ========== AUTOMOTIVE ==========
  {
    id: "motor_trade",
    name: "Motor Trade & Garage",
    category: "Automotive",
    icon: "🚗",
    regulators: ["TradingStandards", "HSE"],
    shortDescription: "Car dealerships, garages, MOT stations, and vehicle services",
    description: "Compliance support for the motor trade covering consumer rights, workshop safety, and environmental requirements. We help you meet your obligations to customers and staff.",
    whoIsItFor: [
      "Car dealerships",
      "Independent garages",
      "MOT testing stations",
      "Body shops",
      "Tyre and exhaust centres"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "risk_assessment", "staff_handbook", "mandatory_posters", "coshh", "environmental"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Workshop Risk Assessment",
      "COSHH Assessment",
      "Consumer Rights Policy",
      "MOT Station Requirements",
      "Environmental Policy (Waste)",
      "Complaints Procedure",
      "Vehicle Handover Checklist",
      "Staff Training Records",
      "Tool & Equipment Safety"
    ],
    industryDisclaimer: "Motor trade businesses must comply with Consumer Rights Act 2015 and Trading Standards requirements. MOT stations have additional DVSA requirements. This pack provides guidance but responsibility for compliance remains with the business.",
    featured: false
  }
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get featured industries for homepage display (max 8)
 */
export const getFeaturedIndustries = (limit = 8) => {
  const featured = UK_INDUSTRIES.filter(ind => ind.featured);
  const nonFeatured = UK_INDUSTRIES.filter(ind => !ind.featured);
  return [...featured, ...nonFeatured].slice(0, limit);
};

/**
 * Get all industries
 */
export const getAllIndustries = () => UK_INDUSTRIES;

/**
 * Get industry by ID
 */
export const getIndustryById = (id) => UK_INDUSTRIES.find(ind => ind.id === id);

/**
 * Get industries grouped by category
 */
export const getIndustriesGroupedByCategory = () => {
  return UK_INDUSTRIES.reduce((acc, ind) => {
    if (!acc[ind.category]) {
      acc[ind.category] = [];
    }
    acc[ind.category].push(ind);
    return acc;
  }, {});
};

/**
 * Get compliance areas for an industry
 */
export const getComplianceAreasForIndustry = (industryId) => {
  const industry = getIndustryById(industryId);
  if (!industry) return [];
  return industry.complianceAreas.map(areaId => COMPLIANCE_AREAS[areaId]).filter(Boolean);
};

/**
 * Get regulatory bodies for an industry
 */
export const getRegulatoryBodiesForIndustry = (industryId) => {
  const industry = getIndustryById(industryId);
  if (!industry) return [];
  return industry.regulators.map(regId => REGULATORY_BODIES[regId]).filter(Boolean);
};

/**
 * Get total industry count
 */
export const getIndustryCount = () => UK_INDUSTRIES.length;

/**
 * Get category list
 */
export const getCategories = () => {
  return [...new Set(UK_INDUSTRIES.map(ind => ind.category))];
};

// ==================== PLATFORM DISCLAIMERS ====================

export const PLATFORM_DISCLAIMERS = {
  footer: "Compliance requirements may vary by location, services offered, and regulatory updates. SimplyComply assists with compliance but does not guarantee regulatory approval.",
  signup: "By signing up, you acknowledge that compliance requirements may vary and that responsibility for ensuring compliance remains with your business.",
  general: "SimplyComply provides guidance, templates, and supporting documentation to help UK businesses understand and prepare for compliance requirements. We are not a regulatory body and cannot guarantee compliance outcomes."
};

export default UK_INDUSTRIES;
