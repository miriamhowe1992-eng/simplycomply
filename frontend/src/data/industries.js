// Single source of truth for all UK business sectors/industries
// Used by: Landing page, Signup flow, Onboarding, Backend sync

export const UK_INDUSTRIES = [
  {
    id: "dental",
    name: "Dental Practice",
    industry: "Healthcare",
    icon: "🦷",
    regulator: "CQC",
    shortDescription: "Private and NHS dental practices, orthodontists, and dental laboratories",
    description: "Complete compliance pack for dental practices in the UK. Whether you're running an NHS practice, private clinic, or specialist dental service, we cover all regulatory requirements from the Care Quality Commission (CQC) and General Dental Council (GDC).",
    whoIsItFor: [
      "NHS and private dental practices",
      "Orthodontic clinics",
      "Dental laboratories",
      "Mobile dental services",
      "Dental hygienist practices"
    ],
    regulatoryBodies: [
      { name: "CQC", full: "Care Quality Commission", description: "Healthcare regulator for dental services" },
      { name: "GDC", full: "General Dental Council", description: "Professional standards for dental professionals" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace health and safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Data protection compliance" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Safeguarding", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Mandatory Posters", included: true },
      { name: "Infection Control", included: true },
      { name: "CQC Registration", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Infection Control Policy (HTM 01-05)",
      "GDPR Patient Data Policy",
      "Safeguarding Policy",
      "Complaints Procedure",
      "Clinical Risk Assessment",
      "Sharps & Needlestick Protocol",
      "Fire Safety Policy",
      "Staff Handbook",
      "GDC Standards Guidance"
    ],
    featured: true
  },
  {
    id: "healthcare",
    name: "Healthcare Provider",
    industry: "Healthcare",
    icon: "🏥",
    regulator: "CQC",
    shortDescription: "GP surgeries, clinics, nursing services, and healthcare providers",
    description: "Comprehensive compliance framework for healthcare providers regulated by the Care Quality Commission. From GP practices to specialist clinics, we ensure you meet all five CQC key questions: Safe, Effective, Caring, Responsive, and Well-led.",
    whoIsItFor: [
      "GP surgeries and primary care",
      "Private clinics and hospitals",
      "Community nursing services",
      "Diagnostic services",
      "Home healthcare providers"
    ],
    regulatoryBodies: [
      { name: "CQC", full: "Care Quality Commission", description: "Main healthcare regulator" },
      { name: "NHS England", full: "NHS England", description: "NHS service standards" },
      { name: "GMC/NMC", full: "General Medical/Nursing Council", description: "Professional registration" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Patient data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Safeguarding", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Mandatory Posters", included: true },
      { name: "Infection Control", included: true },
      { name: "Mental Capacity & DoLS", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Data Protection Policy (Caldicott)",
      "Safeguarding Adults & Children Policy",
      "Infection Prevention & Control Policy",
      "Complaints Policy (NHS Standards)",
      "Clinical Risk Assessment Framework",
      "Mental Capacity & DoLS Policy",
      "Staff Handbook",
      "CQC Key Lines of Enquiry Guide"
    ],
    featured: true
  },
  {
    id: "care_home",
    name: "Care Home",
    industry: "Healthcare",
    icon: "🏡",
    regulator: "CQC",
    shortDescription: "Residential care homes, nursing homes, and supported living",
    description: "Everything you need to run a compliant care home in the UK. Our pack covers residential care, nursing homes, and supported living services, ensuring you meet CQC fundamental standards and provide outstanding care.",
    whoIsItFor: [
      "Residential care homes",
      "Nursing homes",
      "Supported living services",
      "Dementia care specialists",
      "Respite care providers"
    ],
    regulatoryBodies: [
      { name: "CQC", full: "Care Quality Commission", description: "Adult social care regulator" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Resident data protection" },
      { name: "Local Authority", full: "Local Authority", description: "Safeguarding partnerships" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Safeguarding Adults", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Mandatory Posters", included: true },
      { name: "Medication Management", included: true },
      { name: "Mental Capacity & DoLS", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Safeguarding Adults Policy",
      "Medication Management Policy",
      "Falls Prevention Policy",
      "DoLS & Mental Capacity Policy",
      "Moving & Handling Risk Assessment",
      "Complaints Procedure",
      "Care Worker Handbook",
      "CQC Single Assessment Framework Guide"
    ],
    featured: true
  },
  {
    id: "veterinary",
    name: "Veterinary Practice",
    industry: "Healthcare",
    icon: "🐾",
    regulator: "RCVS",
    shortDescription: "Veterinary surgeries, animal hospitals, and pet clinics",
    description: "Complete compliance pack for veterinary practices, from small animal clinics to equine hospitals. We cover RCVS Practice Standards Scheme requirements and ensure your practice meets all professional and legal obligations.",
    whoIsItFor: [
      "Small animal veterinary practices",
      "Equine veterinary services",
      "Farm animal practices",
      "Emergency veterinary hospitals",
      "Mobile veterinary services"
    ],
    regulatoryBodies: [
      { name: "RCVS", full: "Royal College of Veterinary Surgeons", description: "Professional regulator" },
      { name: "VMD", full: "Veterinary Medicines Directorate", description: "Medicines regulation" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Client data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Controlled Drugs", included: true },
      { name: "Radiation Protection", included: true },
      { name: "Infection Control", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "RCVS Practice Standards Guide",
      "Controlled Drugs Policy",
      "Radiation Protection Policy",
      "Clinical Risk Assessment",
      "Infection Control & Biosecurity",
      "Client Data Protection Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: true
  },
  {
    id: "nursery",
    name: "Nursery & Childcare",
    industry: "Education",
    icon: "👶",
    regulator: "Ofsted",
    shortDescription: "Day nurseries, pre-schools, childminders, and early years providers",
    description: "Keep your early years setting fully compliant with Ofsted requirements and the Early Years Foundation Stage (EYFS). Our pack ensures you're prepared for inspections and focused on providing outstanding childcare.",
    whoIsItFor: [
      "Day nurseries",
      "Pre-schools and playgroups",
      "Childminders",
      "Out-of-school clubs",
      "Holiday clubs"
    ],
    regulatoryBodies: [
      { name: "Ofsted", full: "Office for Standards in Education", description: "Early years regulator" },
      { name: "DfE", full: "Department for Education", description: "EYFS framework" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "Local Authority", full: "Local Safeguarding Partnership", description: "Child protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Child Safeguarding", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "EYFS Curriculum", included: true },
      { name: "Food Safety", included: true },
      { name: "Prevent Duty", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Child Safeguarding Policy",
      "EYFS Curriculum Policy",
      "Prevent Duty Policy",
      "Food Safety Policy",
      "Paediatric First Aid Requirements",
      "Daily Risk Assessments",
      "Data Protection (Photos & Records)",
      "Ofsted Inspection Guide"
    ],
    featured: true
  },
  {
    id: "construction",
    name: "Construction",
    industry: "Construction",
    icon: "🏗️",
    regulator: "HSE",
    shortDescription: "Building contractors, civil engineering, and construction companies",
    description: "Stay CDM 2015 compliant with our comprehensive construction compliance pack. From principal contractors to subcontractors, we cover all health and safety requirements for the construction industry.",
    whoIsItFor: [
      "Building contractors",
      "Civil engineering firms",
      "Specialist subcontractors",
      "House builders",
      "Renovation companies"
    ],
    regulatoryBodies: [
      { name: "HSE", full: "Health and Safety Executive", description: "CDM 2015 enforcement" },
      { name: "CITB", full: "Construction Industry Training Board", description: "Skills and training" },
      { name: "Environment Agency", full: "Environment Agency", description: "Waste and pollution" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "CDM Compliance", included: true },
      { name: "Asbestos Management", included: true },
      { name: "COSHH", included: true },
      { name: "Environmental", included: true }
    ],
    typicalDocuments: [
      "Construction H&S Policy (CDM 2015)",
      "Site Risk Assessment Templates",
      "COSHH Assessment",
      "Asbestos Management Plan",
      "Method Statement Templates",
      "Working at Height Procedures",
      "Environmental Policy",
      "Site Worker Handbook",
      "HSE CDM Guide"
    ],
    featured: true
  },
  {
    id: "hospitality",
    name: "Hotel & Hospitality",
    industry: "Hospitality",
    icon: "🏨",
    regulator: "EHO",
    shortDescription: "Hotels, B&Bs, guest houses, and hospitality venues",
    description: "Complete compliance pack for the hospitality industry. From boutique B&Bs to large hotels, we cover food safety, fire safety, licensing, and guest welfare requirements.",
    whoIsItFor: [
      "Hotels and resorts",
      "Bed & breakfasts",
      "Guest houses",
      "Serviced apartments",
      "Holiday lets"
    ],
    regulatoryBodies: [
      { name: "EHO", full: "Environmental Health Office", description: "Food and hygiene standards" },
      { name: "Fire Service", full: "Fire and Rescue Service", description: "Fire safety compliance" },
      { name: "Licensing Authority", full: "Local Authority Licensing", description: "Alcohol and entertainment" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Food Safety", included: true },
      { name: "Fire Safety", included: true },
      { name: "Licensing", included: true },
      { name: "Allergen Management", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Food Safety Management (HACCP)",
      "Fire Safety Policy & Risk Assessment",
      "Allergen Management Policy",
      "Guest Data Protection Policy",
      "Accessibility Policy",
      "Complaints Procedure",
      "Staff Handbook",
      "Licensing Compliance Guide"
    ],
    featured: true
  },
  {
    id: "restaurant",
    name: "Restaurant & Cafe",
    industry: "Hospitality",
    icon: "🍽️",
    regulator: "EHO/FSA",
    shortDescription: "Restaurants, cafes, coffee shops, and food service businesses",
    description: "Achieve and maintain your 5-star food hygiene rating with our restaurant compliance pack. We cover everything from HACCP to allergen management, ensuring you meet all Food Standards Agency requirements.",
    whoIsItFor: [
      "Restaurants and bistros",
      "Cafes and coffee shops",
      "Fast casual dining",
      "Fine dining establishments",
      "Pop-up food venues"
    ],
    regulatoryBodies: [
      { name: "FSA", full: "Food Standards Agency", description: "Food safety standards" },
      { name: "EHO", full: "Environmental Health Office", description: "Local enforcement" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "Licensing", full: "Local Authority Licensing", description: "Alcohol licensing" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Food Safety (HACCP)", included: true },
      { name: "Fire Safety", included: true },
      { name: "Allergen Management", included: true }
    ],
    typicalDocuments: [
      "Food Safety Management System",
      "HACCP Plan",
      "Allergen Policy (Natasha's Law)",
      "Fire Safety Policy",
      "Health & Safety Policy",
      "Customer Data Policy",
      "Complaints Procedure",
      "Staff Handbook",
      "Food Hygiene Rating Guide"
    ],
    featured: false
  },
  {
    id: "retail",
    name: "Retail Shop",
    industry: "Retail",
    icon: "🛍️",
    regulator: "Trading Standards",
    shortDescription: "High street shops, boutiques, and retail businesses",
    description: "Stay compliant with consumer law and workplace regulations in retail. From Trading Standards requirements to staff safety, we've got your retail business covered.",
    whoIsItFor: [
      "High street retailers",
      "Independent shops",
      "Boutiques",
      "Charity shops",
      "Market traders"
    ],
    regulatoryBodies: [
      { name: "Trading Standards", full: "Trading Standards", description: "Consumer protection" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Customer data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Consumer Rights", included: true },
      { name: "Fire Safety", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Customer Data Protection Policy",
      "Complaints & Returns Policy",
      "Store Risk Assessment",
      "Fire Safety Policy",
      "Manual Handling Procedures",
      "Staff Handbook",
      "Consumer Rights Act Guide"
    ],
    featured: true
  },
  {
    id: "salon",
    name: "Hair & Beauty Salon",
    industry: "Personal Services",
    icon: "💇",
    regulator: "EHO",
    shortDescription: "Hair salons, beauty parlours, nail bars, and spas",
    description: "Keep your salon compliant with hygiene standards and treatment regulations. Our pack covers everything from infection control to chemical safety for all beauty and hair services.",
    whoIsItFor: [
      "Hair salons and barbers",
      "Beauty salons and spas",
      "Nail bars",
      "Massage therapists",
      "Aesthetic clinics"
    ],
    regulatoryBodies: [
      { name: "EHO", full: "Environmental Health Office", description: "Hygiene standards" },
      { name: "HSE", full: "Health and Safety Executive", description: "Chemical safety (COSHH)" },
      { name: "Local Authority", full: "Local Authority", description: "Premises licensing" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Infection Control", included: true },
      { name: "COSHH", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Hygiene & Infection Control Policy",
      "COSHH Assessment",
      "Treatment Risk Assessments",
      "Client Data Protection Policy",
      "Complaints Procedure",
      "Insurance Requirements",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "education",
    name: "School & College",
    industry: "Education",
    icon: "📚",
    regulator: "Ofsted",
    shortDescription: "Schools, colleges, tuition centres, and educational institutions",
    description: "Meet Ofsted requirements and keep children safe with our education compliance pack. Fully aligned with Keeping Children Safe in Education (KCSIE) and the Education Inspection Framework.",
    whoIsItFor: [
      "Primary and secondary schools",
      "Colleges and sixth forms",
      "Independent schools",
      "Tuition centres",
      "Alternative provision"
    ],
    regulatoryBodies: [
      { name: "Ofsted", full: "Office for Standards in Education", description: "School inspection" },
      { name: "DfE", full: "Department for Education", description: "Education standards" },
      { name: "ISI", full: "Independent Schools Inspectorate", description: "Independent school inspection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Child Safeguarding", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Prevent Duty", included: true },
      { name: "Behaviour Policy", included: true }
    ],
    typicalDocuments: [
      "Child Protection Policy (KCSIE)",
      "Health & Safety Policy",
      "Prevent Duty Policy",
      "Behaviour Policy",
      "Equality & Accessibility Plan",
      "Educational Visit Risk Assessment",
      "Data Protection Policy",
      "Staff Handbook",
      "Ofsted Inspection Guide"
    ],
    featured: false
  },
  {
    id: "office",
    name: "Office & Professional",
    industry: "Professional Services",
    icon: "💼",
    regulator: "HSE/ICO",
    shortDescription: "Offices, consultancies, and professional service firms",
    description: "Simple compliance for office-based businesses. From DSE assessments to GDPR, we cover all the essentials for professional service providers.",
    whoIsItFor: [
      "Professional service firms",
      "Consultancies",
      "Tech companies",
      "Marketing agencies",
      "Financial advisors"
    ],
    regulatoryBodies: [
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "DSE Compliance", included: true },
      { name: "Fire Safety", included: true },
      { name: "Remote Working", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Data Protection Policy",
      "DSE Risk Assessment",
      "Fire Safety Policy",
      "Remote Working Policy",
      "Complaints Procedure",
      "Staff Handbook",
      "ICO GDPR Guide"
    ],
    featured: false
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    industry: "Services",
    icon: "🧹",
    regulator: "HSE",
    shortDescription: "Commercial and domestic cleaning companies",
    description: "Compliance pack for cleaning businesses, covering COSHH, manual handling, and client premises safety. Perfect for contract cleaners and cleaning agencies.",
    whoIsItFor: [
      "Commercial cleaning companies",
      "Domestic cleaning services",
      "Specialist cleaning (biohazard, industrial)",
      "Window cleaning",
      "Facilities management"
    ],
    regulatoryBodies: [
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace and chemical safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Client data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "COSHH", included: true },
      { name: "Manual Handling", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "COSHH Assessment",
      "Manual Handling Policy",
      "Client Premises Risk Assessment",
      "Data Protection Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "security",
    name: "Security Services",
    industry: "Services",
    icon: "🛡️",
    regulator: "SIA",
    shortDescription: "Security guards, door supervisors, and CCTV operators",
    description: "Stay SIA compliant with our security industry pack. Covers licensing requirements, use of force policies, and CCTV operation for all types of security services.",
    whoIsItFor: [
      "Manned guarding services",
      "Door supervisors",
      "CCTV operators",
      "Close protection",
      "Key holding services"
    ],
    regulatoryBodies: [
      { name: "SIA", full: "Security Industry Authority", description: "Licensing and standards" },
      { name: "ICO", full: "Information Commissioner's Office", description: "CCTV and data protection" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "SIA Licensing", included: true },
      { name: "CCTV Compliance", included: true },
      { name: "Use of Force", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "SIA Compliance Guide",
      "CCTV Policy (Surveillance Camera Code)",
      "Use of Force Policy",
      "Conflict Management Procedures",
      "Violence & Aggression Risk Assessment",
      "Data Protection Policy",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    industry: "Healthcare",
    icon: "💊",
    regulator: "GPhC",
    shortDescription: "Community pharmacies, dispensing chemists, and pharmacy services",
    description: "Complete compliance pack for community pharmacies, covering GPhC standards, controlled drugs regulations, and patient safety requirements.",
    whoIsItFor: [
      "Community pharmacies",
      "Dispensing doctors",
      "Hospital pharmacy services",
      "Online pharmacies",
      "Pharmacy chains"
    ],
    regulatoryBodies: [
      { name: "GPhC", full: "General Pharmaceutical Council", description: "Pharmacy regulator" },
      { name: "MHRA", full: "Medicines and Healthcare products Regulatory Agency", description: "Medicines regulation" },
      { name: "CQC", full: "Care Quality Commission", description: "Healthcare services" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Controlled Drugs", included: true },
      { name: "Dispensing Standards", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Controlled Drugs Policy",
      "Dispensing SOPs",
      "Patient Data Protection Policy",
      "Complaints Procedure",
      "Clinical Governance",
      "Staff Handbook",
      "GPhC Standards Guide"
    ],
    featured: false
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    industry: "Leisure",
    icon: "🏋️",
    regulator: "HSE",
    shortDescription: "Gyms, fitness centres, personal trainers, and sports facilities",
    description: "Keep your gym or fitness centre compliant with health and safety requirements. Covers equipment safety, first aid, and member welfare for all fitness businesses.",
    whoIsItFor: [
      "Gyms and fitness centres",
      "Personal training studios",
      "Yoga and pilates studios",
      "Sports clubs",
      "Leisure centres"
    ],
    regulatoryBodies: [
      { name: "HSE", full: "Health and Safety Executive", description: "Equipment and workplace safety" },
      { name: "CIMSPA", full: "Chartered Institute for Sport", description: "Industry standards" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Member data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Equipment Safety", included: true },
      { name: "First Aid", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Equipment Safety & Maintenance",
      "Member Risk Assessment",
      "First Aid Policy",
      "Emergency Procedures",
      "Member Data Protection Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "electrical",
    name: "Electrical Contractor",
    industry: "Construction",
    icon: "⚡",
    regulator: "HSE/NICEIC",
    shortDescription: "Electricians, electrical contractors, and testing services",
    description: "Compliance pack for electrical contractors covering BS 7671, Part P, and all health and safety requirements for electrical work.",
    whoIsItFor: [
      "Domestic electricians",
      "Commercial electrical contractors",
      "Industrial electricians",
      "Testing and inspection services",
      "Solar installation companies"
    ],
    regulatoryBodies: [
      { name: "HSE", full: "Health and Safety Executive", description: "Electrical safety at work" },
      { name: "NICEIC", full: "National Inspection Council", description: "Contractor competence" },
      { name: "Building Control", full: "Local Authority Building Control", description: "Part P compliance" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Electrical Safety", included: true },
      { name: "Part P Compliance", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Electrical Safety Policy",
      "Risk Assessment Templates",
      "Safe Isolation Procedures",
      "Part P Compliance Guide",
      "Customer Data Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "plumbing",
    name: "Plumbing & Heating",
    industry: "Construction",
    icon: "🔧",
    regulator: "HSE/Gas Safe",
    shortDescription: "Plumbers, heating engineers, and gas installers",
    description: "Comprehensive compliance for plumbing and heating businesses. Includes Gas Safe requirements for gas work and general H&S for all plumbing services.",
    whoIsItFor: [
      "Plumbing contractors",
      "Gas engineers",
      "Heating installers",
      "Boiler service engineers",
      "Bathroom fitters"
    ],
    regulatoryBodies: [
      { name: "Gas Safe", full: "Gas Safe Register", description: "Gas work certification" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "Building Control", full: "Local Authority Building Control", description: "Building regulations" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Gas Safety", included: true },
      { name: "Asbestos Awareness", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Gas Safety Procedures",
      "Risk Assessment Templates",
      "Asbestos Awareness Policy",
      "Customer Data Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "takeaway",
    name: "Takeaway & Fast Food",
    industry: "Hospitality",
    icon: "🍕",
    regulator: "EHO/FSA",
    shortDescription: "Takeaways, fast food outlets, and delivery kitchens",
    description: "Everything you need for food hygiene compliance in takeaway and fast food operations. Covers HACCP, allergens, and food delivery safety.",
    whoIsItFor: [
      "Takeaway restaurants",
      "Fast food outlets",
      "Dark kitchens",
      "Food delivery services",
      "Mobile food vendors"
    ],
    regulatoryBodies: [
      { name: "FSA", full: "Food Standards Agency", description: "Food safety standards" },
      { name: "EHO", full: "Environmental Health Office", description: "Local enforcement" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Food Safety (HACCP)", included: true },
      { name: "Fire Safety", included: true },
      { name: "Allergen Management", included: true }
    ],
    typicalDocuments: [
      "Food Safety Management System",
      "HACCP Plan",
      "Allergen Policy",
      "Fire Safety Policy",
      "Delivery Safety Procedures",
      "Health & Safety Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: false
  },
  {
    id: "charity",
    name: "Charity & Non-Profit",
    industry: "Third Sector",
    icon: "❤️",
    regulator: "Charity Commission",
    shortDescription: "Charities, CICs, and non-profit organisations",
    description: "Governance and compliance pack for the charity sector. Covers Charity Commission requirements, safeguarding, and trustee responsibilities.",
    whoIsItFor: [
      "Registered charities",
      "Community interest companies (CICs)",
      "Social enterprises",
      "Voluntary organisations",
      "Faith-based organisations"
    ],
    regulatoryBodies: [
      { name: "Charity Commission", full: "Charity Commission", description: "Charity regulator" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workplace safety" },
      { name: "ICO", full: "Information Commissioner's Office", description: "Donor data protection" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Safeguarding", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Governance", included: true },
      { name: "Fundraising Compliance", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Safeguarding Policy",
      "Trustee Governance Guide",
      "Donor Data Protection Policy",
      "Fundraising Compliance Policy",
      "Complaints Procedure",
      "Volunteer Handbook",
      "Charity Commission Guide"
    ],
    featured: false
  },
  {
    id: "motor_trade",
    name: "Motor Trade & Garage",
    industry: "Automotive",
    icon: "🚗",
    regulator: "Trading Standards",
    shortDescription: "Car dealerships, garages, MOT stations, and vehicle services",
    description: "Stay compliant in the motor trade with our comprehensive pack covering consumer rights, MOT authorisation, and workshop safety.",
    whoIsItFor: [
      "Car dealerships",
      "Independent garages",
      "MOT testing stations",
      "Body shops",
      "Tyre and exhaust centres"
    ],
    regulatoryBodies: [
      { name: "DVSA", full: "Driver and Vehicle Standards Agency", description: "MOT authorisation" },
      { name: "Trading Standards", full: "Trading Standards", description: "Consumer protection" },
      { name: "HSE", full: "Health and Safety Executive", description: "Workshop safety" },
      { name: "Environment Agency", full: "Environment Agency", description: "Waste disposal" }
    ],
    complianceAreas: [
      { name: "Health & Safety", included: true },
      { name: "GDPR & Data Protection", included: true },
      { name: "Equality & Diversity", included: true },
      { name: "Complaints Procedures", included: true },
      { name: "Risk Assessments", included: true },
      { name: "Staff Handbook", included: true },
      { name: "Consumer Rights", included: true },
      { name: "Environmental", included: true }
    ],
    typicalDocuments: [
      "Health & Safety Policy",
      "Workshop Risk Assessment",
      "Consumer Rights Policy",
      "MOT Compliance Guide",
      "Environmental Policy (Waste)",
      "Customer Data Policy",
      "Complaints Procedure",
      "Staff Handbook"
    ],
    featured: false
  }
];

// Get featured industries (for homepage display)
export const getFeaturedIndustries = (limit = 8) => {
  const featured = UK_INDUSTRIES.filter(ind => ind.featured);
  const nonFeatured = UK_INDUSTRIES.filter(ind => !ind.featured);
  return [...featured, ...nonFeatured].slice(0, limit);
};

// Get all industries
export const getAllIndustries = () => UK_INDUSTRIES;

// Get industry by ID
export const getIndustryById = (id) => UK_INDUSTRIES.find(ind => ind.id === id);

// Get industries grouped by category
export const getIndustriesGroupedByCategory = () => {
  return UK_INDUSTRIES.reduce((acc, ind) => {
    if (!acc[ind.industry]) {
      acc[ind.industry] = [];
    }
    acc[ind.industry].push(ind);
    return acc;
  }, {});
};

export default UK_INDUSTRIES;
