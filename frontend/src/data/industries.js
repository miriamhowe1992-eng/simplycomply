// SimplyComply UK Industries - Single Source of Truth
// This file is the central data model for all industry-related content
// Changes here automatically update: Homepage, View All, Detail Modals, Signup, Onboarding

// ==================== COMPLIANCE AREAS DEFINITIONS ====================

export const COMPLIANCE_AREAS = {
  health_safety: { id: "health_safety", name: "Health & Safety", icon: "🛡️" },
  gdpr: { id: "gdpr", name: "GDPR & Data Protection", icon: "🔒" },
  equality: { id: "equality", name: "Equality & Diversity", icon: "⚖️" },
  safeguarding: { id: "safeguarding", name: "Safeguarding", icon: "👥" },
  complaints: { id: "complaints", name: "Complaints Procedures", icon: "📝" },
  infection_control: { id: "infection_control", name: "Infection Control & Hygiene", icon: "🧴" },
  staff_training: { id: "staff_training", name: "Staff Management & Training", icon: "📖" },
  mandatory_posters: { id: "mandatory_posters", name: "Mandatory Posters & Notices", icon: "📌" },
  food_safety: { id: "food_safety", name: "Food Safety & Hygiene", icon: "🍽️" },
  fire_safety: { id: "fire_safety", name: "Fire Safety", icon: "🔥" },
  coshh: { id: "coshh", name: "COSHH (Hazardous Substances)", icon: "⚗️" },
  manual_handling: { id: "manual_handling", name: "Manual Handling", icon: "📦" },
  medication: { id: "medication", name: "Medication Management", icon: "💊" },
  controlled_drugs: { id: "controlled_drugs", name: "Controlled Drugs", icon: "💉" },
  dbs_checks: { id: "dbs_checks", name: "DBS & Vetting", icon: "✅" },
  insurance: { id: "insurance", name: "Insurance Requirements", icon: "📄" },
  licensing: { id: "licensing", name: "Licensing & Registration", icon: "🏷️" },
  environmental: { id: "environmental", name: "Environmental & Waste", icon: "🌱" },
  client_care: { id: "client_care", name: "Client Care & Consent", icon: "🤝" },
  clinical_waste: { id: "clinical_waste", name: "Clinical Waste Disposal", icon: "🗑️" },
};

// ==================== RISK ASSESSMENTS ====================

export const RISK_ASSESSMENTS = {
  general_hs: { id: "general_hs", name: "General Health & Safety Risk Assessment" },
  fire: { id: "fire", name: "Fire Risk Assessment" },
  coshh: { id: "coshh", name: "COSHH Risk Assessment" },
  sharps: { id: "sharps", name: "Sharps & Needlestick Risk Assessment" },
  manual_handling: { id: "manual_handling", name: "Manual Handling Risk Assessment" },
  lone_working: { id: "lone_working", name: "Lone Working Risk Assessment" },
  slips_trips: { id: "slips_trips", name: "Slips, Trips & Falls Risk Assessment" },
  infection_control: { id: "infection_control", name: "Infection Control Risk Assessment" },
  dse: { id: "dse", name: "Display Screen Equipment (DSE) Assessment" },
  violence: { id: "violence", name: "Violence & Aggression Risk Assessment" },
  stress: { id: "stress", name: "Stress & Wellbeing Risk Assessment" },
  working_at_height: { id: "working_at_height", name: "Working at Height Risk Assessment" },
  legionella: { id: "legionella", name: "Legionella Risk Assessment" },
  asbestos: { id: "asbestos", name: "Asbestos Risk Assessment" },
  noise: { id: "noise", name: "Noise Assessment" },
  food_safety: { id: "food_safety", name: "Food Safety Risk Assessment" },
  clinical_procedures: { id: "clinical_procedures", name: "Clinical Procedures Risk Assessment" },
  new_expectant_mothers: { id: "new_expectant_mothers", name: "New & Expectant Mothers Risk Assessment" },
  young_persons: { id: "young_persons", name: "Young Persons Risk Assessment" },
  electrical: { id: "electrical", name: "Electrical Safety Risk Assessment" },
};

// ==================== AUDITS & CHECKS ====================

export const AUDITS_CHECKS = {
  hs_audit: { id: "hs_audit", name: "Health & Safety Audit" },
  infection_audit: { id: "infection_audit", name: "Infection Control & Hygiene Audit" },
  fire_checks: { id: "fire_checks", name: "Fire Safety Checks" },
  equipment_maintenance: { id: "equipment_maintenance", name: "Equipment Maintenance & Testing Logs" },
  incident_review: { id: "incident_review", name: "Incident & Accident Review" },
  annual_policy_review: { id: "annual_policy_review", name: "Annual Policy Review" },
  sterilisation_log: { id: "sterilisation_log", name: "Sterilisation & Autoclave Log" },
  waste_disposal_log: { id: "waste_disposal_log", name: "Waste Disposal Log" },
  cleaning_schedule: { id: "cleaning_schedule", name: "Cleaning Schedule Review" },
  training_records: { id: "training_records", name: "Staff Training Records Review" },
  complaints_review: { id: "complaints_review", name: "Complaints Review" },
  consent_audit: { id: "consent_audit", name: "Client Consent Records Audit" },
  temperature_monitoring: { id: "temperature_monitoring", name: "Temperature Monitoring Log" },
  supplier_review: { id: "supplier_review", name: "Supplier & Stock Review" },
  safeguarding_review: { id: "safeguarding_review", name: "Safeguarding Review" },
  dbs_renewal_tracking: { id: "dbs_renewal_tracking", name: "DBS Renewal Tracking" },
  insurance_renewal: { id: "insurance_renewal", name: "Insurance Renewal Tracking" },
  registration_renewal: { id: "registration_renewal", name: "Registration & Licence Renewal Tracking" },
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
  LocalAuthority: {
    abbr: "Local Authority",
    full: "Local Authority / Environmental Health",
    description: "Local council enforcement of registration, hygiene and safety standards",
    url: null
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
  NMC: {
    abbr: "NMC",
    full: "Nursing and Midwifery Council",
    description: "Regulates nurses and midwives in the UK",
    url: "https://www.nmc.org.uk"
  },
  JCCP: {
    abbr: "JCCP",
    full: "Joint Council for Cosmetic Practitioners",
    description: "Voluntary register for non-surgical cosmetic practitioners",
    url: "https://www.jccp.org.uk"
  },
};

// ==================== PLATFORM DISCLAIMERS ====================

export const PLATFORM_DISCLAIMERS = {
  industryModal: "SimplyComply provides guidance, templates, and supporting documentation. Responsibility for ensuring compliance remains with the business owner and may vary by location and services offered.",
  
  signupFooter: "Requirements can vary by local authority and UK nation. SimplyComply assists with compliance documentation but does not guarantee regulatory approval or inspection outcomes.",
  
  regionalNote: "Requirements may vary by local authority and UK nation (England, Wales, Scotland, Northern Ireland).",
  
  general: "SimplyComply provides guidance, templates, and supporting documentation to help UK businesses understand and prepare for compliance requirements. We are not a regulatory body and cannot guarantee compliance outcomes."
};

// ==================== INDUSTRIES DATA ====================

export const UK_INDUSTRIES = [
  // ========== PERSONAL & BODY ART SERVICES ==========
  {
    id: "tattoo_studio",
    name: "Tattoo Artist / Studio",
    category: "Personal & Body Art Services",
    icon: "🎨",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Tattoo studios, tattoo artists, and body art practitioners",
    description: "Comprehensive compliance support for tattoo studios and artists. We help you meet local authority registration requirements, maintain robust infection control standards, and ensure safe working practices. Our pack covers everything from client consent to clinical waste disposal.",
    whoIsItFor: [
      "Tattoo studios",
      "Mobile tattoo artists",
      "Home-based tattoo artists",
      "Tattoo apprentices and their supervisors",
      "Cover-up and cosmetic tattoo specialists"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "mandatory_posters", "coshh", "clinical_waste", "client_care", "licensing", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "sterilisation_log", "waste_disposal_log", "cleaning_schedule", "training_records", "consent_audit"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Infection Prevention & Control Policy",
      "Client Consultation & Consent Form",
      "Aftercare Advice Sheet",
      "Medical History Questionnaire",
      "COSHH Assessment (Inks, Cleaning Agents)",
      "Sharps & Clinical Waste Disposal Procedure",
      "Autoclave Maintenance & Testing Log",
      "Sterilisation Records",
      "Equipment Cleaning Checklist",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Staff Training Records",
      "Accident & Incident Report Form",
      "Age Verification Policy",
      "Allergy & Sensitivity Screening Form"
    ],
    operationalRequirements: [
      "Local authority registration before operating",
      "Single-use sterile needles and equipment",
      "Autoclave sterilisation for reusable equipment (if applicable)",
      "Client consultation and written consent for every procedure",
      "Medical history screening for contraindications",
      "Age verification (18+ for tattoos)",
      "Clinical waste disposal via licensed contractor",
      "Sharps disposal in designated containers",
      "Surface disinfection between clients",
      "PPE use (gloves, aprons) for all procedures",
      "Aftercare instructions provided to every client",
      "Allergy patch testing where appropriate"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Tattoo artists and studios must register with their local authority. Specific requirements including training qualifications may vary by local authority and UK nation. This pack supports your compliance journey but does not replace local registration requirements.",
    featured: true
  },
  {
    id: "piercing_studio",
    name: "Piercing Studio",
    category: "Personal & Body Art Services",
    icon: "💎",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Body piercing studios and piercing practitioners",
    description: "Complete compliance support for body piercing businesses. From ear piercing to specialist body piercings, we help you maintain high hygiene standards, meet registration requirements, and protect both clients and staff.",
    whoIsItFor: [
      "Body piercing studios",
      "Ear piercing services",
      "Mobile piercing practitioners",
      "Jewellery retailers offering piercing",
      "Combined tattoo and piercing studios"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "mandatory_posters", "coshh", "clinical_waste", "client_care", "licensing", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "sterilisation_log", "waste_disposal_log", "cleaning_schedule", "training_records", "consent_audit"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Infection Prevention & Control Policy",
      "Client Consultation & Consent Form",
      "Parental Consent Form (for minors where permitted)",
      "Aftercare Instructions",
      "Medical History Questionnaire",
      "COSHH Assessment",
      "Sharps & Clinical Waste Procedure",
      "Sterilisation Records & Autoclave Log",
      "Equipment Cleaning Checklist",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Staff Training Records",
      "Accident & Incident Report Form",
      "Jewellery Quality & Material Records",
      "Age Verification Policy"
    ],
    operationalRequirements: [
      "Local authority registration before operating",
      "Single-use sterile needles",
      "Autoclave sterilisation for reusable equipment",
      "Client consultation and written consent",
      "Parental consent for under-16s (where permitted by local authority)",
      "Age restrictions for certain piercings",
      "Clinical waste disposal via licensed contractor",
      "Sharps disposal in designated containers",
      "Surface disinfection between clients",
      "PPE use for all procedures",
      "Aftercare instructions for every client",
      "Jewellery quality and material documentation"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Piercing practitioners must register with their local authority. Age restrictions and parental consent requirements vary by piercing type and local authority. This pack supports your compliance but does not replace local registration requirements.",
    featured: false
  },
  {
    id: "microblading_pmu",
    name: "Microblading / PMU",
    category: "Personal & Body Art Services",
    icon: "✨",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Microblading, semi-permanent makeup, and cosmetic tattooing",
    description: "Compliance support for microblading and semi-permanent makeup practitioners. Whether you specialise in brows, lips, or scalp micropigmentation, we help you meet registration requirements, maintain infection control standards, and manage client care effectively.",
    whoIsItFor: [
      "Microblading artists",
      "Semi-permanent makeup (SPMU) practitioners",
      "Scalp micropigmentation specialists",
      "Cosmetic tattoo artists",
      "Lip blush and eyeliner technicians"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "mandatory_posters", "coshh", "clinical_waste", "client_care", "licensing", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "sterilisation_log", "waste_disposal_log", "cleaning_schedule", "training_records", "consent_audit"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Infection Prevention & Control Policy",
      "Client Consultation & Consent Form",
      "Patch Test Record & Policy",
      "Contraindications Checklist",
      "Aftercare Instructions",
      "Medical History Questionnaire",
      "COSHH Assessment (Pigments, Numbing Agents)",
      "Sharps & Clinical Waste Procedure",
      "Sterilisation Records",
      "Equipment Cleaning Checklist",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Before & After Photo Consent",
      "Colour Selection & Expectations Record",
      "Touch-Up & Aftercare Policy"
    ],
    operationalRequirements: [
      "Local authority registration (as tattooing/cosmetic piercing)",
      "Single-use sterile needles and blades",
      "Patch testing for pigments (typically 48 hours before treatment)",
      "Detailed client consultation covering expectations",
      "Written consent including risks and aftercare",
      "Contraindication screening",
      "Clinical waste disposal via licensed contractor",
      "Sharps disposal in designated containers",
      "Surface disinfection between clients",
      "PPE use for all procedures",
      "Before and after photography (with consent)",
      "Touch-up policy clearly communicated"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Semi-permanent makeup and microblading typically requires registration with your local authority under tattooing or cosmetic piercing categories. Requirements may vary by local authority. This pack supports your compliance journey.",
    featured: true
  },
  {
    id: "aesthetics_clinic",
    name: "Aesthetics Clinic",
    category: "Personal & Body Art Services",
    icon: "💉",
    regulators: ["LocalAuthority", "HSE", "ICO", "JCCP"],
    shortDescription: "Non-surgical cosmetic treatments including injectables and skin treatments",
    description: "Compliance support for aesthetics practitioners offering non-surgical cosmetic treatments. From dermal fillers to skin treatments, we help you maintain professional standards, manage client safety, and meet your regulatory obligations.",
    whoIsItFor: [
      "Aesthetics clinics and practitioners",
      "Botox and dermal filler practitioners",
      "Skin treatment specialists",
      "Laser and IPL practitioners",
      "Non-surgical cosmetic practitioners"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "mandatory_posters", "coshh", "clinical_waste", "client_care", "licensing", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "clinical_procedures", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "sterilisation_log", "waste_disposal_log", "cleaning_schedule", "training_records", "consent_audit", "supplier_review"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Infection Prevention & Control Policy",
      "Client Consultation & Assessment Form",
      "Treatment Consent Form",
      "Medical History Questionnaire",
      "Contraindications & Screening Checklist",
      "Aftercare Instructions (per treatment type)",
      "COSHH Assessment",
      "Sharps & Clinical Waste Procedure",
      "Equipment Maintenance Log",
      "Product Batch & Traceability Records",
      "Client Privacy Notice (GDPR)",
      "Complaints & Complications Procedure",
      "Emergency & Adverse Reaction Protocol",
      "Before & After Photo Consent",
      "Cooling-Off Period Policy",
      "Staff Qualifications & Insurance Records",
      "Prescriber Arrangement Documentation (where applicable)"
    ],
    operationalRequirements: [
      "Appropriate qualifications and training for treatments offered",
      "Professional indemnity insurance",
      "Client consultation with full medical history",
      "Written informed consent for all treatments",
      "Cooling-off period offered for injectable treatments",
      "Contraindication screening",
      "Product traceability and batch records",
      "Clinical waste and sharps disposal",
      "Emergency protocols for adverse reactions",
      "Surface disinfection between clients",
      "PPE use for all procedures",
      "Prescriber arrangements for prescription-only medicines (where applicable)",
      "Before and after photography (with consent)"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Non-surgical cosmetic treatments have varying regulatory requirements across the UK. Practitioners should hold appropriate qualifications and insurance. Some treatments require prescriber involvement. This pack supports your compliance but practitioners must ensure they meet all requirements for treatments offered.",
    featured: true
  },
  {
    id: "barber_hairdresser",
    name: "Barber / Hairdresser",
    category: "Personal & Body Art Services",
    icon: "💇",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Barber shops, hair salons, and hairdressing services",
    description: "Compliance support for barbers and hairdressers. We help you maintain hygiene standards, manage health and safety, and run a professional salon or barbershop that meets all typical requirements.",
    whoIsItFor: [
      "Barber shops",
      "Hair salons",
      "Mobile hairdressers",
      "Home-based hairdressers",
      "Unisex salons"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "mandatory_posters", "coshh", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "slips_trips", "manual_handling", "lone_working"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Infection Control Policy",
      "Client Consultation Card",
      "Allergy Alert Test Record (for colour services)",
      "COSHH Assessment (Hair Products, Colours)",
      "Sharps Procedure (for razor use)",
      "Equipment Cleaning & Sterilisation Checklist",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Staff Handbook",
      "Accident & Incident Report Form",
      "First Aid Procedures",
      "Fire Safety Procedures"
    ],
    operationalRequirements: [
      "Patch/allergy testing for colour services (typically 48 hours before)",
      "Tool cleaning and sterilisation between clients",
      "Clean towels and gowns for each client",
      "Safe disposal of razor blades",
      "Product COSHH assessments",
      "Adequate ventilation",
      "Clean and hygienic work environment",
      "PPE where appropriate (gloves for colouring)",
      "Client allergy and sensitivity records"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Barbers and hairdressers should maintain high hygiene standards and appropriate insurance. Requirements for specific services like razor use or ear piercing may require additional registration. This pack supports typical salon compliance needs.",
    featured: true
  },

  // ========== PERSONAL & WELLBEING SERVICES ==========
  {
    id: "massage_therapist",
    name: "Massage Therapist",
    category: "Personal & Wellbeing Services",
    icon: "💆",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Sports massage, remedial massage, and therapeutic massage practitioners",
    description: "Compliance support for massage therapists, whether you work from a clinic, mobile, or home-based practice. We cover hygiene standards, client safety, insurance requirements, and data protection to help you run a professional practice.",
    whoIsItFor: [
      "Sports massage therapists",
      "Remedial massage practitioners",
      "Swedish massage therapists",
      "Deep tissue specialists",
      "Mobile massage therapists",
      "Spa and wellness centre therapists"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "infection_control", "manual_handling", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "consent_audit", "insurance_renewal"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Infection Control Policy",
      "Client Consultation Form",
      "Consent & Contraindications Form",
      "Treatment Record Template",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Insurance Requirements Checklist",
      "Lone Working Policy",
      "Safeguarding Awareness Policy",
      "Accident & Incident Report Form",
      "Equipment Maintenance Log"
    ],
    operationalRequirements: [
      "Client consultation before treatment",
      "Contraindication screening",
      "Written consent for treatment",
      "Clean linens for each client",
      "Hand hygiene between clients",
      "Professional indemnity insurance",
      "Safe and private treatment environment",
      "Ongoing CPD and training"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Massage therapists should hold appropriate qualifications and insurance. Some local authorities require special treatment licences. This pack supports good practice but does not replace professional training or insurance requirements.",
    featured: false
  },
  {
    id: "beauty_therapist",
    name: "Beauty Therapist",
    category: "Personal & Wellbeing Services",
    icon: "💅",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Beauty treatments, facials, waxing, and skincare specialists",
    description: "Compliance support for beauty therapists covering hygiene standards, client care, and local authority requirements. Whether salon-based or mobile, we help you maintain professional standards and meet your obligations.",
    whoIsItFor: [
      "Beauty salons",
      "Mobile beauty therapists",
      "Skincare specialists",
      "Waxing practitioners",
      "Lash and brow technicians"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "coshh", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "infection_control", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "consent_audit"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Sterilisation Policy",
      "Client Consultation Card",
      "Patch Test Records & Policy",
      "Contraindications Guide",
      "COSHH Assessment (Products)",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Treatment Pricing & Policy",
      "Insurance Requirements Checklist",
      "Aftercare Advice Sheets"
    ],
    operationalRequirements: [
      "Patch testing for applicable treatments (lash tints, etc.)",
      "Client consultation and contraindication checks",
      "Tool cleaning and sterilisation",
      "Clean towels and linens for each client",
      "Product COSHH assessments",
      "Professional insurance",
      "Aftercare advice provided"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Some beauty treatments may require local authority registration (e.g., electrolysis, micropigmentation). Ensure appropriate qualifications and insurance for treatments offered. This pack supports good practice.",
    featured: false
  },
  {
    id: "nail_technician",
    name: "Nail Technician",
    category: "Personal & Wellbeing Services",
    icon: "💅",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Nail salons, manicures, pedicures, and nail art services",
    description: "Compliance support for nail technicians covering hygiene standards, ventilation requirements, and chemical safety. We help you maintain a safe environment for clients and staff in your nail business.",
    whoIsItFor: [
      "Nail salons",
      "Mobile nail technicians",
      "Nail bars",
      "Manicure specialists",
      "Acrylic and gel nail technicians"
    ],
    complianceAreas: ["health_safety", "gdpr", "complaints", "infection_control", "staff_training", "coshh", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "coshh", "infection_control", "slips_trips"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Hygiene & Sterilisation Procedures",
      "COSHH Assessment (Nail Products, Acrylics, Gels)",
      "Ventilation & Air Quality Policy",
      "Client Consultation Form",
      "Complaints Procedure",
      "Client Privacy Notice (GDPR)",
      "Tool Cleaning Checklist",
      "Allergy & Sensitivity Guidance",
      "Insurance Checklist"
    ],
    operationalRequirements: [
      "Adequate ventilation for dust and fumes",
      "Tool cleaning and sterilisation between clients",
      "COSHH assessments for products used",
      "PPE use (masks, gloves where appropriate)",
      "Client consultation and allergy checks",
      "Professional insurance"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Nail services involve chemical products requiring proper ventilation and COSHH compliance. Ensure appropriate qualifications and insurance. This pack supports good practice and typical compliance requirements.",
    featured: false
  },
  {
    id: "holistic_therapist",
    name: "Holistic Therapist",
    category: "Personal & Wellbeing Services",
    icon: "🧘",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Aromatherapy, reflexology, reiki, and complementary therapies",
    description: "Compliance support for holistic and complementary therapists. We cover client safety, consent, data protection, and professional standards for a range of therapies to help you run a safe and ethical practice.",
    whoIsItFor: [
      "Aromatherapists",
      "Reflexologists",
      "Reiki practitioners",
      "Homeopaths",
      "Crystal healers",
      "Hypnotherapists"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "infection_control", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "consent_audit", "insurance_renewal"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Client Consultation Form",
      "Informed Consent Form",
      "Treatment Records Template",
      "Contraindications Checklist",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Hygiene Policy",
      "Insurance Requirements Checklist",
      "Scope of Practice Statement"
    ],
    operationalRequirements: [
      "Clear scope of practice defined",
      "Client consultation before treatment",
      "Informed consent obtained",
      "Contraindication screening",
      "Professional insurance",
      "No medical claims made",
      "Referral to medical professionals when appropriate"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Holistic therapists should be clear about their scope of practice and should not make medical claims. Some therapies may require local authority registration. This pack supports professional practice but does not replace appropriate training.",
    featured: false
  },
  {
    id: "yoga_pilates",
    name: "Yoga / Pilates Instructor",
    category: "Personal & Wellbeing Services",
    icon: "🧘‍♀️",
    regulators: ["HSE", "ICO"],
    shortDescription: "Yoga teachers, Pilates instructors, and movement practitioners",
    description: "Compliance support for yoga and Pilates instructors. Whether teaching in studios, gyms, or privately, we cover health and safety, client screening, and insurance requirements to help you teach safely.",
    whoIsItFor: [
      "Yoga teachers",
      "Pilates instructors",
      "Studio owners",
      "Corporate wellness providers",
      "Online class instructors"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "manual_handling", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records", "insurance_renewal"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Client Health Screening Form",
      "Informed Consent & Participation Agreement",
      "Class Risk Assessment",
      "Emergency Procedures",
      "Client Privacy Notice (GDPR)",
      "Complaints Procedure",
      "Insurance Checklist",
      "Equipment Safety Checks",
      "First Aid Procedures"
    ],
    operationalRequirements: [
      "Client health screening before participation",
      "Informed consent and participation agreement",
      "Qualified first aider or first aid training",
      "Safe and suitable teaching environment",
      "Equipment safety checks",
      "Professional insurance",
      "Modifications offered for different abilities"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Instructors should hold recognised qualifications and appropriate insurance. Client health screening is essential for safe practice. This pack supports safe teaching but does not replace professional training or insurance requirements.",
    featured: false
  },

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
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "infection_control", "staff_training", "mandatory_posters", "coshh", "clinical_waste", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "manual_handling", "slips_trips", "violence"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "sterilisation_log", "waste_disposal_log", "cleaning_schedule", "training_records", "safeguarding_review", "dbs_renewal_tracking"],
    exampleDocuments: [
      "Health & Safety Policy",
      "Infection Control Policy (Decontamination)",
      "Safeguarding Adults & Children Policy",
      "GDPR Patient Privacy Notice",
      "Complaints Handling Procedure",
      "Sharps & Needlestick Protocol",
      "Radiation Protection Policy",
      "Medical Emergency Procedures",
      "Staff Induction Checklist",
      "CQC Statement of Purpose"
    ],
    operationalRequirements: [
      "CQC registration for regulated activities",
      "GDC registration for all clinical staff",
      "Robust decontamination and sterilisation procedures",
      "Clinical waste disposal via licensed contractor",
      "Radiation protection arrangements",
      "Medical emergency equipment and training",
      "Patient consent processes",
      "Complaints handling within required timeframes"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Dental practices must be registered with the CQC for regulated activities. Individual practitioners must maintain their GDC registration. This pack supports your compliance journey but does not replace professional registration requirements.",
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
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "infection_control", "staff_training", "mandatory_posters", "medication", "dbs_checks", "clinical_waste"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "manual_handling", "lone_working", "slips_trips", "violence"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "sterilisation_log", "waste_disposal_log", "cleaning_schedule", "training_records", "safeguarding_review", "dbs_renewal_tracking"],
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
    operationalRequirements: [
      "CQC registration for regulated activities",
      "Professional registration for clinical staff",
      "Robust clinical governance arrangements",
      "Safeguarding training and procedures",
      "Infection prevention and control",
      "Medicines management protocols",
      "Clinical waste disposal"
    ],
    hasRegionalVariations: true,
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
    description: "Everything you need to run a compliant care home. Our pack covers CQC fundamental standards, helping you provide outstanding care while meeting your regulatory obligations. Includes guidance on person-centred care and capacity assessments.",
    whoIsItFor: [
      "Residential care homes",
      "Nursing homes",
      "Supported living services",
      "Dementia care specialists",
      "Respite care providers"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "infection_control", "staff_training", "mandatory_posters", "medication", "manual_handling", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "coshh", "infection_control", "manual_handling", "slips_trips", "violence", "legionella", "new_expectant_mothers"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "safeguarding_review", "dbs_renewal_tracking"],
    exampleDocuments: [
      "Safeguarding Adults Policy",
      "Mental Capacity & Best Interests Policy",
      "Medication Administration Policy",
      "Falls Prevention Policy",
      "Moving & Handling Policy",
      "Infection Control Policy",
      "Complaints Procedure",
      "Care Plan Templates",
      "Staff Supervision Policy",
      "Resident Privacy Notice"
    ],
    operationalRequirements: [
      "CQC registration",
      "Person-centred care planning",
      "Safeguarding training and procedures",
      "Medication management",
      "Moving and handling training",
      "Mental capacity assessments",
      "Staff supervision and training"
    ],
    hasRegionalVariations: true,
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
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "infection_control", "staff_training", "mandatory_posters", "controlled_drugs", "coshh", "clinical_waste"],
    riskAssessments: ["general_hs", "fire", "coshh", "sharps", "infection_control", "manual_handling", "lone_working", "slips_trips", "violence"],
    auditsChecks: ["hs_audit", "infection_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "waste_disposal_log", "cleaning_schedule", "training_records"],
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
    operationalRequirements: [
      "RCVS registration for veterinary surgeons",
      "Controlled drugs management",
      "Clinical waste disposal",
      "Radiation protection (if x-ray used)",
      "Infection control and biosecurity",
      "Client consent processes"
    ],
    hasRegionalVariations: false,
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
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "controlled_drugs", "medication"],
    riskAssessments: ["general_hs", "fire", "coshh", "manual_handling", "slips_trips", "violence"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records", "complaints_review"],
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
    operationalRequirements: [
      "GPhC registration for pharmacy premises",
      "Responsible pharmacist on duty",
      "Controlled drugs management",
      "Dispensing SOPs",
      "Error and near-miss recording",
      "Patient confidentiality"
    ],
    hasRegionalVariations: false,
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
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "staff_training", "mandatory_posters", "food_safety", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "food_safety", "slips_trips", "manual_handling", "young_persons"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "safeguarding_review", "dbs_renewal_tracking"],
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
    operationalRequirements: [
      "Ofsted registration",
      "Enhanced DBS checks for all staff",
      "Safeguarding training",
      "Paediatric first aid trained staff",
      "EYFS compliance",
      "Staff-to-child ratios",
      "Safe recruitment practices"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Childcare providers caring for children under 8 must register with Ofsted (or equivalent in Wales/Scotland/NI). Staff working with children require enhanced DBS checks. This pack supports your Ofsted preparation but does not guarantee registration or inspection outcomes.",
    featured: true
  },
  {
    id: "education",
    name: "School & College",
    category: "Education",
    icon: "📚",
    regulators: ["Ofsted", "HSE", "ICO"],
    shortDescription: "Schools, colleges, tuition centres, and educational institutions",
    description: "Meet Ofsted requirements and keep children safe with our education compliance pack. Fully aligned with safeguarding requirements and the Education Inspection Framework.",
    whoIsItFor: [
      "Primary schools",
      "Secondary schools",
      "Colleges and sixth forms",
      "Independent schools",
      "Tuition centres"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "staff_training", "mandatory_posters", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "slips_trips", "manual_handling", "violence", "young_persons"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "training_records", "safeguarding_review", "dbs_renewal_tracking"],
    exampleDocuments: [
      "Child Protection Policy",
      "Behaviour & Anti-Bullying Policy",
      "Health & Safety Policy",
      "Educational Visits Policy",
      "Allegations Against Staff Policy",
      "Complaints Procedure",
      "SEND Policy",
      "Staff Code of Conduct",
      "Prevent Duty Policy",
      "Online Safety Policy"
    ],
    operationalRequirements: [
      "Enhanced DBS checks for all staff",
      "Designated safeguarding lead",
      "Safeguarding training for all staff",
      "Safe recruitment practices",
      "Prevent duty compliance",
      "First aid arrangements"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Schools must follow statutory guidance on safeguarding. This pack supports your safeguarding and compliance obligations but does not replace statutory requirements.",
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
    description: "Stay compliant with construction health and safety requirements. We help you meet your health and safety duties whether you're a principal contractor, contractor, or client.",
    whoIsItFor: [
      "Building contractors",
      "Civil engineering firms",
      "Specialist subcontractors",
      "House builders",
      "Renovation companies"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "coshh", "manual_handling", "environmental"],
    riskAssessments: ["general_hs", "fire", "coshh", "manual_handling", "working_at_height", "slips_trips", "noise", "asbestos", "electrical"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records"],
    exampleDocuments: [
      "Health & Safety Policy",
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
    operationalRequirements: [
      "Site-specific risk assessments",
      "Method statements for high-risk work",
      "CSCS cards for site workers",
      "Site inductions",
      "PPE provision and use",
      "First aid arrangements",
      "Accident and incident reporting"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Construction work must comply with health and safety requirements. Principal contractors have specific duties. This pack provides guidance and templates but responsibility for compliance remains with duty holders.",
    featured: true
  },
  {
    id: "electrical",
    name: "Electrical Contractor",
    category: "Construction",
    icon: "⚡",
    regulators: ["HSE", "NICEIC"],
    shortDescription: "Electricians, electrical contractors, and testing services",
    description: "Compliance support for electrical contractors, covering electrical safety and health and safety requirements. We help you maintain professional standards and meet your legal obligations.",
    whoIsItFor: [
      "Domestic electricians",
      "Commercial electrical contractors",
      "Industrial electricians",
      "Testing and inspection services",
      "Solar installation companies"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "coshh", "manual_handling"],
    riskAssessments: ["general_hs", "fire", "electrical", "working_at_height", "manual_handling", "lone_working", "slips_trips", "asbestos"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records"],
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
    operationalRequirements: [
      "Competent person schemes (where applicable)",
      "Safe isolation procedures",
      "PPE provision and use",
      "Asbestos awareness",
      "Working at height training",
      "Tool and equipment maintenance"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Electrical work must comply with relevant standards and building regulations. Consider joining a competent person scheme such as NICEIC. This pack supports your compliance but does not replace certification requirements.",
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
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "coshh", "manual_handling"],
    riskAssessments: ["general_hs", "fire", "coshh", "manual_handling", "lone_working", "slips_trips", "asbestos"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records", "registration_renewal"],
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
    operationalRequirements: [
      "Gas Safe registration for gas work",
      "Asbestos awareness",
      "Manual handling training",
      "PPE provision and use",
      "Tool and equipment maintenance"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Gas work must only be carried out by Gas Safe registered engineers. This pack supports general compliance but does not replace Gas Safe registration for gas work.",
    featured: false
  },

  // ========== HOSPITALITY ==========
  {
    id: "hospitality",
    name: "Hotel & Hospitality",
    category: "Hospitality",
    icon: "🏨",
    regulators: ["LocalAuthority", "HSE", "ICO"],
    shortDescription: "Hotels, B&Bs, guest houses, and hospitality venues",
    description: "Complete compliance support for the hospitality industry. From fire safety to food hygiene, we help you meet your legal obligations and provide a safe environment for guests and staff.",
    whoIsItFor: [
      "Hotels and resorts",
      "Bed & breakfasts",
      "Guest houses",
      "Serviced apartments",
      "Holiday lets"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "food_safety", "fire_safety", "manual_handling"],
    riskAssessments: ["general_hs", "fire", "food_safety", "coshh", "manual_handling", "slips_trips", "legionella"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "temperature_monitoring"],
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
    operationalRequirements: [
      "Fire risk assessment and safety measures",
      "Food hygiene compliance (if serving food)",
      "Legionella risk management",
      "Guest data protection",
      "Accessibility considerations"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Hospitality businesses must comply with food hygiene regulations, fire safety requirements, and licensing conditions where applicable. This pack supports your compliance but does not replace local authority inspections.",
    featured: true
  },
  {
    id: "restaurant",
    name: "Restaurant & Café",
    category: "Hospitality",
    icon: "🍽️",
    regulators: ["LocalAuthority", "FSA", "HSE"],
    shortDescription: "Restaurants, cafes, coffee shops, and food service businesses",
    description: "Achieve and maintain your food hygiene rating with confidence. Our pack covers food safety management, allergen management, and all the policies you need to run a safe and compliant food business.",
    whoIsItFor: [
      "Restaurants and bistros",
      "Cafes and coffee shops",
      "Fast casual dining",
      "Fine dining establishments",
      "Pop-up food venues"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "food_safety", "fire_safety", "coshh"],
    riskAssessments: ["general_hs", "fire", "food_safety", "coshh", "manual_handling", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "temperature_monitoring", "supplier_review"],
    exampleDocuments: [
      "Food Safety Management System",
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
    operationalRequirements: [
      "Food business registration with local authority",
      "Food safety management system",
      "Allergen information available",
      "Temperature monitoring and records",
      "Staff food hygiene training",
      "Cleaning schedules",
      "Pest control arrangements"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Food businesses must register with their local authority and comply with food hygiene regulations. Allergen information must be provided to customers. This pack supports your compliance but does not guarantee food hygiene ratings.",
    featured: false
  },
  {
    id: "takeaway",
    name: "Takeaway & Fast Food",
    category: "Hospitality",
    icon: "🍕",
    regulators: ["LocalAuthority", "FSA", "HSE"],
    shortDescription: "Takeaways, fast food outlets, and delivery kitchens",
    description: "Food safety compliance for takeaway and fast food operations. We cover food safety management, allergen management, and food delivery safety requirements.",
    whoIsItFor: [
      "Takeaway restaurants",
      "Fast food outlets",
      "Dark kitchens",
      "Food delivery services",
      "Mobile food vendors"
    ],
    complianceAreas: ["health_safety", "gdpr", "complaints", "staff_training", "food_safety", "fire_safety", "coshh"],
    riskAssessments: ["general_hs", "fire", "food_safety", "coshh", "manual_handling", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "cleaning_schedule", "training_records", "temperature_monitoring"],
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
    operationalRequirements: [
      "Food business registration",
      "Food safety management system",
      "Allergen information available",
      "Safe food delivery practices",
      "Temperature monitoring",
      "Staff food hygiene training"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Food businesses must be registered with their local authority. Allergen information must be available for all menu items. Food hygiene ratings are displayed publicly. This pack supports compliance but does not guarantee ratings.",
    featured: false
  },

  // ========== RETAIL ==========
  {
    id: "retail",
    name: "Retail Shop",
    category: "Retail",
    icon: "🛍️",
    regulators: ["TradingStandards", "HSE", "ICO"],
    shortDescription: "High street shops, boutiques, and retail businesses",
    description: "Stay compliant with consumer law and workplace regulations. Our pack covers Trading Standards requirements, health and safety, and customer data protection for retail businesses.",
    whoIsItFor: [
      "High street retailers",
      "Independent shops",
      "Boutiques",
      "Charity shops",
      "Market traders"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "fire_safety", "manual_handling"],
    riskAssessments: ["general_hs", "fire", "manual_handling", "slips_trips", "dse", "violence"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "training_records"],
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
    operationalRequirements: [
      "Consumer rights compliance",
      "Fire safety arrangements",
      "Manual handling training",
      "Customer data protection",
      "Clear pricing and returns policy"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Retail businesses must comply with consumer protection requirements and Trading Standards requirements. This pack provides guidance but responsibility for compliance remains with the business owner.",
    featured: true
  },

  // ========== SERVICES ==========
  {
    id: "cleaning",
    name: "Cleaning Services",
    category: "Services",
    icon: "🧹",
    regulators: ["HSE", "ICO"],
    shortDescription: "Commercial and domestic cleaning companies",
    description: "Compliance support for cleaning businesses covering COSHH, manual handling, and working safely on client premises. Perfect for contract cleaners and cleaning agencies.",
    whoIsItFor: [
      "Commercial cleaning companies",
      "Domestic cleaning services",
      "Specialist cleaning (end of tenancy)",
      "Window cleaning",
      "Facilities management"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "coshh", "manual_handling", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "coshh", "manual_handling", "lone_working", "slips_trips", "working_at_height"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records"],
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
    operationalRequirements: [
      "COSHH assessments for cleaning chemicals",
      "Manual handling training",
      "Lone working procedures",
      "PPE provision",
      "Key holding and security"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Cleaning staff working in certain environments (e.g., schools, care homes) may require DBS checks. COSHH assessments are required for cleaning chemicals. This pack supports your compliance obligations.",
    featured: false
  },
  {
    id: "security",
    name: "Security Services",
    category: "Services",
    icon: "🛡️",
    regulators: ["SIA", "HSE", "ICO"],
    shortDescription: "Security guards, door supervisors, and CCTV operators",
    description: "Stay SIA compliant with our security industry pack. We cover licensing requirements, use of force policies, and CCTV operation for all types of security services.",
    whoIsItFor: [
      "Manned guarding services",
      "Door supervisors",
      "CCTV operators",
      "Close protection",
      "Key holding services"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "licensing", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "violence", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "training_records", "registration_renewal", "dbs_renewal_tracking"],
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
    operationalRequirements: [
      "SIA licences for all operatives",
      "Use of force training",
      "Conflict management training",
      "CCTV code of practice compliance",
      "Incident recording"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Security operatives must hold valid SIA licences. Companies providing security services must ensure all staff are licensed. This pack supports compliance but does not replace SIA requirements.",
    featured: false
  },

  // ========== LEISURE ==========
  {
    id: "gym",
    name: "Gym & Fitness",
    category: "Leisure",
    icon: "🏋️",
    regulators: ["HSE", "ICO"],
    shortDescription: "Gyms, fitness centres, personal trainers, and sports facilities",
    description: "Compliance support for the fitness industry. We cover equipment safety, member welfare, and health screening to help you run a safe and professional facility.",
    whoIsItFor: [
      "Gyms and fitness centres",
      "Personal training studios",
      "Yoga and Pilates studios",
      "Sports clubs",
      "Leisure centres"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "client_care", "insurance"],
    riskAssessments: ["general_hs", "fire", "manual_handling", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records", "insurance_renewal"],
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
    operationalRequirements: [
      "Member health screening",
      "Equipment maintenance and inspection",
      "First aid arrangements",
      "Emergency procedures",
      "Staff qualifications for instruction"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Fitness facilities should follow industry standards. Personal trainers should hold recognised qualifications and insurance. This pack supports good practice but does not replace professional requirements.",
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
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "fire_safety"],
    riskAssessments: ["general_hs", "fire", "dse", "slips_trips", "stress", "lone_working"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "training_records"],
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
    operationalRequirements: [
      "DSE assessments for computer users",
      "Fire safety arrangements",
      "First aid provisions",
      "Data protection compliance",
      "Homeworking arrangements (where applicable)"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Office-based businesses must comply with workplace health and safety regulations and GDPR. This pack provides essential policies but may need supplementing for regulated professions.",
    featured: false
  },

  // ========== THIRD SECTOR ==========
  {
    id: "charity",
    name: "Charity & Non-Profit",
    category: "Third Sector",
    icon: "❤️",
    regulators: ["CharityCommission", "HSE", "ICO"],
    shortDescription: "Charities, CICs, and non-profit organisations",
    description: "Governance and compliance support for the charity sector. We cover Charity Commission requirements, safeguarding, data protection, and trustee responsibilities.",
    whoIsItFor: [
      "Registered charities",
      "Community interest companies",
      "Social enterprises",
      "Voluntary organisations",
      "Faith-based organisations"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "safeguarding", "complaints", "staff_training", "dbs_checks"],
    riskAssessments: ["general_hs", "fire", "lone_working", "slips_trips"],
    auditsChecks: ["hs_audit", "fire_checks", "incident_review", "annual_policy_review", "training_records", "safeguarding_review", "dbs_renewal_tracking"],
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
    operationalRequirements: [
      "Charity Commission compliance (if registered charity)",
      "Safeguarding policies and training",
      "DBS checks for relevant roles",
      "Trustee governance",
      "Fundraising compliance"
    ],
    hasRegionalVariations: true,
    industryDisclaimer: "Charities must comply with Charity Commission guidance. Trustees have legal duties. Safeguarding requirements depend on beneficiary groups. This pack supports good governance but does not replace legal or professional advice.",
    featured: false
  },

  // ========== AUTOMOTIVE ==========
  {
    id: "motor_trade",
    name: "Motor Trade & Garage",
    category: "Automotive",
    icon: "🚗",
    regulators: ["TradingStandards", "HSE", "ICO"],
    shortDescription: "Car dealerships, garages, MOT stations, and vehicle services",
    description: "Compliance support for the motor trade covering consumer rights, workshop safety, and environmental requirements. We help you meet your obligations to customers and staff.",
    whoIsItFor: [
      "Car dealerships",
      "Independent garages",
      "MOT testing stations",
      "Body shops",
      "Tyre and exhaust centres"
    ],
    complianceAreas: ["health_safety", "gdpr", "equality", "complaints", "staff_training", "mandatory_posters", "coshh", "environmental"],
    riskAssessments: ["general_hs", "fire", "coshh", "manual_handling", "slips_trips", "noise"],
    auditsChecks: ["hs_audit", "fire_checks", "equipment_maintenance", "incident_review", "annual_policy_review", "training_records"],
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
    operationalRequirements: [
      "Consumer rights compliance",
      "COSHH assessments",
      "Waste disposal (oils, tyres, etc.)",
      "Equipment maintenance",
      "PPE provision"
    ],
    hasRegionalVariations: false,
    industryDisclaimer: "Motor trade businesses must comply with consumer protection requirements and Trading Standards requirements. MOT stations have additional requirements. This pack provides guidance but responsibility for compliance remains with the business.",
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
 * Get risk assessments for an industry
 */
export const getRiskAssessmentsForIndustry = (industryId) => {
  const industry = getIndustryById(industryId);
  if (!industry || !industry.riskAssessments) return [];
  return industry.riskAssessments.map(raId => RISK_ASSESSMENTS[raId]).filter(Boolean);
};

/**
 * Get audits and checks for an industry
 */
export const getAuditsChecksForIndustry = (industryId) => {
  const industry = getIndustryById(industryId);
  if (!industry || !industry.auditsChecks) return [];
  return industry.auditsChecks.map(acId => AUDITS_CHECKS[acId]).filter(Boolean);
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

export default UK_INDUSTRIES;
