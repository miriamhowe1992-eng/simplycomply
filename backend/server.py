from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'simplycomply_secret')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Stripe Config
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Create the main app
app = FastAPI(title="SimplyComply API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ======================= MODELS =======================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    full_name: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class BusinessCreate(BaseModel):
    name: str
    industry: str
    sector: str
    size: str
    uk_nation: str
    address: Optional[str] = None
    phone: Optional[str] = None

class BusinessResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    name: str
    industry: str
    sector: str
    size: str
    uk_nation: str
    address: Optional[str]
    phone: Optional[str]
    subscription_status: str
    subscription_plan: Optional[str]
    created_at: str

class DocumentResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    category: str
    description: str
    sector: str
    file_url: Optional[str]
    version: str
    last_updated: str
    is_mandatory: bool

class ChecklistItemResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    document_id: str
    title: str
    category: str
    status: str
    last_reviewed: Optional[str]
    next_review_due: Optional[str]

class NotificationResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str

class CheckoutRequest(BaseModel):
    plan: str
    origin_url: str

# ======================= COMPLIANCE ITEM MODELS =======================

class ComplianceItemType(str, Enum):
    POLICY = "policy"
    PROCEDURE = "procedure"
    RISK_ASSESSMENT = "risk_assessment"
    AUDIT = "audit"
    POSTER = "poster"
    TEMPLATE = "template"
    OPERATIONAL = "operational"

class ComplianceItemStatus(str, Enum):
    MISSING = "missing"
    DRAFT = "draft"
    UPLOADED = "uploaded"
    ACKNOWLEDGED = "acknowledged"
    APPROVED = "approved"
    NEEDS_REVIEW = "needs_review"
    OVERDUE = "overdue"

class ComplianceItemUpdate(BaseModel):
    status: Optional[str] = None
    is_acknowledged: Optional[bool] = None
    is_customised: Optional[bool] = None
    custom_content: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    notes: Optional[str] = None

class ComplianceItemResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    business_id: str
    item_type: str
    item_key: str
    title: str
    description: Optional[str]
    category: str
    is_required: bool
    status: str
    is_acknowledged: bool
    acknowledged_at: Optional[str]
    is_customised: bool
    custom_content: Optional[str]
    file_url: Optional[str]
    file_name: Optional[str]
    version: Optional[str]
    last_reviewed: Optional[str]
    next_review_due: Optional[str]
    notes: Optional[str]
    created_at: str
    updated_at: Optional[str]
    contributes_to_score: bool

class ComplianceScoreResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    business_id: str
    industry_id: str
    score_percent: int
    required_total: int
    completed_total: int
    missing_count: int
    overdue_count: int
    needs_review_count: int
    status_label: str  # "on_track", "needs_attention", "overdue"
    last_calculated_at: str
    next_review_due_at: Optional[str]
    breakdown: Dict

# ======================= EMPLOYEE MODELS =======================

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    job_title: str
    department: Optional[str] = None
    start_date: str
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    is_active: Optional[bool] = None

class EmployeeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    business_id: str
    first_name: str
    last_name: str
    email: Optional[str]
    job_title: str
    department: Optional[str]
    start_date: str
    phone: Optional[str]
    emergency_contact: Optional[str]
    is_active: bool
    created_at: str
    compliance_summary: Optional[Dict] = None

class EmployeeRequirementCreate(BaseModel):
    requirement_type: str  # dbs, right_to_work, training, certification, health_check, etc.
    title: str
    description: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    reference_number: Optional[str] = None
    status: str = "pending"  # pending, valid, expired, expiring_soon

class EmployeeRequirementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    reference_number: Optional[str] = None
    status: Optional[str] = None

class EmployeeRequirementResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    employee_id: str
    requirement_type: str
    title: str
    description: Optional[str]
    issue_date: Optional[str]
    expiry_date: Optional[str]
    reference_number: Optional[str]
    status: str
    days_until_expiry: Optional[int]
    created_at: str

# ======================= HELPER FUNCTIONS =======================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def calculate_requirement_status(expiry_date_str: Optional[str]) -> tuple:
    """Calculate status and days until expiry"""
    if not expiry_date_str:
        return "pending", None
    
    try:
        expiry_date = datetime.fromisoformat(expiry_date_str.replace('Z', '+00:00'))
        now = datetime.now(timezone.utc)
        days_until = (expiry_date - now).days
        
        if days_until < 0:
            return "expired", days_until
        elif days_until <= 30:
            return "expiring_soon", days_until
        else:
            return "valid", days_until
    except:
        return "pending", None

# ======================= SUBSCRIPTION PLANS =======================

SUBSCRIPTION_PLANS = {
    "monthly": {"name": "Monthly Plan", "price": 29.00, "currency": "gbp", "interval": "month"},
    "annual": {"name": "Annual Plan", "price": 290.00, "currency": "gbp", "interval": "year"}
}

# ======================= EXPANDED UK SECTORS =======================

UK_SECTORS = [
    # Healthcare & Medical
    {"id": "dental", "name": "Dental Practice", "industry": "Healthcare", "regulator": "CQC"},
    {"id": "healthcare", "name": "Healthcare Provider", "industry": "Healthcare", "regulator": "CQC"},
    {"id": "care_home", "name": "Care Home", "industry": "Healthcare", "regulator": "CQC"},
    {"id": "veterinary", "name": "Veterinary Practice", "industry": "Healthcare", "regulator": "RCVS"},
    {"id": "pharmacy", "name": "Pharmacy", "industry": "Healthcare", "regulator": "GPhC"},
    {"id": "optician", "name": "Optician / Optometrist", "industry": "Healthcare", "regulator": "GOC"},
    {"id": "physiotherapy", "name": "Physiotherapy / Sports Therapy", "industry": "Healthcare", "regulator": "HCPC"},
    {"id": "mental_health", "name": "Mental Health Services", "industry": "Healthcare", "regulator": "CQC"},
    
    # Construction & Trades
    {"id": "construction", "name": "Construction", "industry": "Construction", "regulator": "HSE"},
    {"id": "electrical", "name": "Electrical Contractor", "industry": "Construction", "regulator": "HSE/NICEIC"},
    {"id": "plumbing", "name": "Plumbing & Heating", "industry": "Construction", "regulator": "HSE/Gas Safe"},
    {"id": "roofing", "name": "Roofing Contractor", "industry": "Construction", "regulator": "HSE"},
    
    # Hospitality & Food
    {"id": "hospitality", "name": "Hotel / B&B", "industry": "Hospitality", "regulator": "EHO"},
    {"id": "restaurant", "name": "Restaurant / Cafe", "industry": "Hospitality", "regulator": "EHO/FSA"},
    {"id": "pub", "name": "Pub / Bar", "industry": "Hospitality", "regulator": "EHO/Licensing"},
    {"id": "catering", "name": "Catering Services", "industry": "Hospitality", "regulator": "EHO/FSA"},
    {"id": "takeaway", "name": "Takeaway / Fast Food", "industry": "Hospitality", "regulator": "EHO/FSA"},
    
    # Retail & Services
    {"id": "retail", "name": "Retail Shop", "industry": "Retail", "regulator": "Trading Standards"},
    {"id": "salon", "name": "Hair / Beauty Salon", "industry": "Personal Services", "regulator": "EHO"},
    {"id": "tattoo", "name": "Tattoo / Piercing Studio", "industry": "Personal Services", "regulator": "EHO"},
    {"id": "gym", "name": "Gym / Fitness Centre", "industry": "Leisure", "regulator": "HSE"},
    
    # Education & Childcare
    {"id": "education", "name": "School / College", "industry": "Education", "regulator": "Ofsted"},
    {"id": "nursery", "name": "Nursery / Childcare", "industry": "Education", "regulator": "Ofsted"},
    {"id": "tuition", "name": "Tuition Centre", "industry": "Education", "regulator": "Ofsted"},
    
    # Professional Services
    {"id": "office", "name": "Office / Professional Services", "industry": "Professional Services", "regulator": "HSE/ICO"},
    {"id": "accountancy", "name": "Accountancy Practice", "industry": "Professional Services", "regulator": "ICAEW/ACCA"},
    {"id": "legal", "name": "Legal Practice", "industry": "Professional Services", "regulator": "SRA"},
    {"id": "estate_agent", "name": "Estate Agency", "industry": "Professional Services", "regulator": "Trading Standards"},
    {"id": "recruitment", "name": "Recruitment Agency", "industry": "Professional Services", "regulator": "ICO/HMRC"},
    
    # Other Small Businesses
    {"id": "cleaning", "name": "Cleaning Services", "industry": "Services", "regulator": "HSE"},
    {"id": "security", "name": "Security Services", "industry": "Services", "regulator": "SIA"},
    {"id": "transport", "name": "Transport / Logistics", "industry": "Transport", "regulator": "DVSA"},
    {"id": "motor_trade", "name": "Motor Trade / Garage", "industry": "Automotive", "regulator": "Trading Standards"},
    {"id": "agriculture", "name": "Farm / Agriculture", "industry": "Agriculture", "regulator": "HSE"},
    {"id": "manufacturing", "name": "Manufacturing", "industry": "Manufacturing", "regulator": "HSE"},
    {"id": "warehouse", "name": "Warehouse / Distribution", "industry": "Logistics", "regulator": "HSE"},
    {"id": "charity", "name": "Charity / Non-Profit", "industry": "Third Sector", "regulator": "Charity Commission"},
]

UK_NATIONS = ["England", "Scotland", "Wales", "Northern Ireland"]

BUSINESS_SIZES = [
    {"id": "micro", "name": "Micro (1-9 employees)"},
    {"id": "small", "name": "Small (10-49 employees)"},
    {"id": "medium", "name": "Medium (50-249 employees)"},
    {"id": "large", "name": "Large (250+ employees)"}
]

COMPLIANCE_CATEGORIES = [
    "Health & Safety",
    "GDPR & Data Protection",
    "Equality & Diversity",
    "Safeguarding",
    "Complaints Procedures",
    "Risk Assessments",
    "Staff Handbook",
    "Mandatory Posters",
    "Regulatory Guidance",
    "Fire Safety",
    "Food Safety",
    "Infection Control",
    "Environmental"
]

# ======================= EMPLOYEE REQUIREMENT TYPES BY SECTOR =======================

EMPLOYEE_REQUIREMENTS = {
    # Healthcare sectors - comprehensive requirements
    "dental": [
        {"type": "dbs", "title": "Enhanced DBS Check", "description": "Enhanced Disclosure and Barring Service check required for patient-facing roles", "renewal_months": 36, "mandatory": True},
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "gdc_registration", "title": "GDC Registration", "description": "General Dental Council registration for dentists and dental nurses", "renewal_months": 12, "mandatory": True},
        {"type": "indemnity", "title": "Professional Indemnity", "description": "Valid professional indemnity insurance", "renewal_months": 12, "mandatory": True},
        {"type": "cpd", "title": "CPD Record", "description": "Continuing Professional Development hours", "renewal_months": 12, "mandatory": True},
        {"type": "hep_b", "title": "Hepatitis B Vaccination", "description": "Hepatitis B vaccination and immunity check", "renewal_months": 60, "mandatory": True},
        {"type": "basic_life_support", "title": "Basic Life Support Training", "description": "BLS/CPR certification", "renewal_months": 12, "mandatory": True},
        {"type": "safeguarding", "title": "Safeguarding Training", "description": "Adult and child safeguarding awareness", "renewal_months": 36, "mandatory": True},
        {"type": "infection_control", "title": "Infection Control Training", "description": "HTM 01-05 compliant training", "renewal_months": 12, "mandatory": True},
        {"type": "radiation_protection", "title": "Radiation Protection Training", "description": "IR(ME)R training for radiography", "renewal_months": 36, "mandatory": False},
    ],
    "healthcare": [
        {"type": "dbs", "title": "Enhanced DBS Check", "description": "Enhanced DBS with barred lists check", "renewal_months": 36, "mandatory": True},
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "nmc_registration", "title": "NMC Registration", "description": "Nursing and Midwifery Council registration", "renewal_months": 12, "mandatory": True},
        {"type": "indemnity", "title": "Professional Indemnity", "description": "Valid professional indemnity insurance", "renewal_months": 12, "mandatory": True},
        {"type": "revalidation", "title": "Professional Revalidation", "description": "NMC/GMC revalidation completed", "renewal_months": 36, "mandatory": True},
        {"type": "hep_b", "title": "Hepatitis B Vaccination", "description": "Hepatitis B vaccination status", "renewal_months": 60, "mandatory": True},
        {"type": "basic_life_support", "title": "Basic Life Support Training", "description": "BLS/ILS certification", "renewal_months": 12, "mandatory": True},
        {"type": "safeguarding", "title": "Safeguarding Training", "description": "Level 3 safeguarding training", "renewal_months": 36, "mandatory": True},
        {"type": "manual_handling", "title": "Manual Handling Training", "description": "Moving and handling certification", "renewal_months": 12, "mandatory": True},
        {"type": "infection_control", "title": "Infection Control Training", "description": "Infection prevention and control", "renewal_months": 12, "mandatory": True},
        {"type": "information_governance", "title": "Information Governance", "description": "Data Security & Protection Toolkit", "renewal_months": 12, "mandatory": True},
    ],
    "care_home": [
        {"type": "dbs", "title": "Enhanced DBS Check", "description": "Enhanced DBS with adults barred list", "renewal_months": 36, "mandatory": True},
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "care_certificate", "title": "Care Certificate", "description": "15 standards care certificate completion", "renewal_months": None, "mandatory": True},
        {"type": "safeguarding", "title": "Safeguarding Adults Training", "description": "Adult safeguarding level 2", "renewal_months": 36, "mandatory": True},
        {"type": "manual_handling", "title": "Manual Handling Training", "description": "Moving and handling of residents", "renewal_months": 12, "mandatory": True},
        {"type": "medication", "title": "Medication Administration", "description": "Safe handling of medication", "renewal_months": 12, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "First aid at work certificate", "renewal_months": 36, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire awareness and evacuation", "renewal_months": 12, "mandatory": True},
        {"type": "food_hygiene", "title": "Food Hygiene Certificate", "description": "Level 2 food hygiene", "renewal_months": 36, "mandatory": False},
        {"type": "dementia", "title": "Dementia Awareness", "description": "Dementia care training", "renewal_months": 24, "mandatory": False},
    ],
    "veterinary": [
        {"type": "dbs", "title": "Basic DBS Check", "description": "Basic criminal record check", "renewal_months": 36, "mandatory": True},
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "rcvs_registration", "title": "RCVS Registration", "description": "Royal College of Veterinary Surgeons registration", "renewal_months": 12, "mandatory": True},
        {"type": "cpd", "title": "CPD Record", "description": "35 hours CPD annually", "renewal_months": 12, "mandatory": True},
        {"type": "indemnity", "title": "Professional Indemnity", "description": "Veterinary defence insurance", "renewal_months": 12, "mandatory": True},
        {"type": "controlled_drugs", "title": "Controlled Drugs Training", "description": "Handling of veterinary medicines", "renewal_months": 24, "mandatory": True},
        {"type": "radiation_protection", "title": "Radiation Protection", "description": "X-ray safety training", "renewal_months": 36, "mandatory": False},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Workplace first aid", "renewal_months": 36, "mandatory": True},
    ],
    "nursery": [
        {"type": "dbs", "title": "Enhanced DBS Check", "description": "Enhanced DBS with children's barred list", "renewal_months": 36, "mandatory": True},
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "childcare_qualification", "title": "Childcare Qualification", "description": "Level 2/3 childcare qualification", "renewal_months": None, "mandatory": True},
        {"type": "safeguarding", "title": "Child Safeguarding Training", "description": "Keeping Children Safe training", "renewal_months": 36, "mandatory": True},
        {"type": "paediatric_first_aid", "title": "Paediatric First Aid", "description": "12-hour paediatric first aid certificate", "renewal_months": 36, "mandatory": True},
        {"type": "food_hygiene", "title": "Food Hygiene Certificate", "description": "Level 2 food safety", "renewal_months": 36, "mandatory": True},
        {"type": "prevent", "title": "Prevent Training", "description": "Counter-terrorism awareness", "renewal_months": 36, "mandatory": True},
        {"type": "health_safety", "title": "Health & Safety Training", "description": "Workplace H&S awareness", "renewal_months": 24, "mandatory": True},
    ],
    "education": [
        {"type": "dbs", "title": "Enhanced DBS Check", "description": "Enhanced DBS with children's barred list", "renewal_months": 36, "mandatory": True},
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "qts", "title": "Qualified Teacher Status", "description": "QTS or equivalent qualification", "renewal_months": None, "mandatory": True},
        {"type": "safeguarding", "title": "Safeguarding Training", "description": "KCSIE compliant training", "renewal_months": 12, "mandatory": True},
        {"type": "prevent", "title": "Prevent Training", "description": "Counter-terrorism duty training", "renewal_months": 36, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "First aid at work", "renewal_months": 36, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire warden training", "renewal_months": 12, "mandatory": True},
    ],
    "construction": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "cscs", "title": "CSCS Card", "description": "Construction Skills Certification Scheme card", "renewal_months": 60, "mandatory": True},
        {"type": "health_safety", "title": "Site Safety (SMSTS/SSSTS)", "description": "Site management safety training scheme", "renewal_months": 60, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid at work", "renewal_months": 36, "mandatory": True},
        {"type": "asbestos", "title": "Asbestos Awareness", "description": "CAT A asbestos awareness", "renewal_months": 12, "mandatory": True},
        {"type": "working_at_height", "title": "Working at Height", "description": "Ladder and scaffold safety", "renewal_months": 36, "mandatory": True},
        {"type": "manual_handling", "title": "Manual Handling", "description": "Safe lifting techniques", "renewal_months": 36, "mandatory": True},
        {"type": "coshh", "title": "COSHH Training", "description": "Control of substances hazardous to health", "renewal_months": 36, "mandatory": True},
    ],
    "hospitality": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "food_hygiene", "title": "Food Hygiene Certificate", "description": "Level 2 food safety in catering", "renewal_months": 36, "mandatory": True},
        {"type": "allergen_training", "title": "Allergen Awareness", "description": "Food allergen training (Natasha's Law)", "renewal_months": 36, "mandatory": True},
        {"type": "personal_licence", "title": "Personal Licence", "description": "Alcohol licensing qualification", "renewal_months": None, "mandatory": False},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid", "renewal_months": 36, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire awareness and evacuation", "renewal_months": 12, "mandatory": True},
        {"type": "health_safety", "title": "Health & Safety", "description": "General H&S awareness", "renewal_months": 36, "mandatory": True},
    ],
    "restaurant": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "food_hygiene", "title": "Food Hygiene Certificate", "description": "Level 2 food safety", "renewal_months": 36, "mandatory": True},
        {"type": "allergen_training", "title": "Allergen Awareness", "description": "14 allergens training", "renewal_months": 36, "mandatory": True},
        {"type": "haccp", "title": "HACCP Training", "description": "Food safety management", "renewal_months": 36, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid", "renewal_months": 36, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire safety awareness", "renewal_months": 12, "mandatory": True},
    ],
    "salon": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "nvq_qualification", "title": "NVQ Qualification", "description": "Level 2/3 hairdressing or beauty", "renewal_months": None, "mandatory": True},
        {"type": "insurance", "title": "Public Liability Insurance", "description": "Treatment liability cover", "renewal_months": 12, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid", "renewal_months": 36, "mandatory": True},
        {"type": "infection_control", "title": "Infection Control", "description": "Hygiene and sterilisation", "renewal_months": 24, "mandatory": True},
        {"type": "coshh", "title": "COSHH Training", "description": "Chemical handling safety", "renewal_months": 36, "mandatory": True},
    ],
    "security": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "sia_licence", "title": "SIA Licence", "description": "Security Industry Authority licence", "renewal_months": 36, "mandatory": True},
        {"type": "dbs", "title": "Enhanced DBS Check", "description": "Criminal record check", "renewal_months": 36, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid", "renewal_months": 36, "mandatory": True},
        {"type": "conflict_management", "title": "Conflict Management", "description": "De-escalation training", "renewal_months": 24, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire warden duties", "renewal_months": 12, "mandatory": True},
    ],
    "cleaning": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "dbs", "title": "Basic DBS Check", "description": "Criminal record check", "renewal_months": 36, "mandatory": True},
        {"type": "coshh", "title": "COSHH Training", "description": "Safe use of cleaning chemicals", "renewal_months": 36, "mandatory": True},
        {"type": "manual_handling", "title": "Manual Handling", "description": "Safe lifting and carrying", "renewal_months": 36, "mandatory": True},
        {"type": "health_safety", "title": "Health & Safety", "description": "General H&S awareness", "renewal_months": 36, "mandatory": True},
    ],
    "retail": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid", "renewal_months": 36, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire awareness", "renewal_months": 12, "mandatory": True},
        {"type": "manual_handling", "title": "Manual Handling", "description": "Safe lifting", "renewal_months": 36, "mandatory": True},
        {"type": "health_safety", "title": "Health & Safety", "description": "General H&S awareness", "renewal_months": 36, "mandatory": True},
    ],
    "office": [
        {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
        {"type": "dse", "title": "DSE Assessment", "description": "Display screen equipment assessment", "renewal_months": 24, "mandatory": True},
        {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid", "renewal_months": 36, "mandatory": True},
        {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire warden training", "renewal_months": 12, "mandatory": True},
        {"type": "gdpr", "title": "GDPR Training", "description": "Data protection awareness", "renewal_months": 12, "mandatory": True},
        {"type": "health_safety", "title": "Health & Safety", "description": "Office H&S awareness", "renewal_months": 36, "mandatory": True},
    ],
}

# Default requirements for sectors not specifically defined
DEFAULT_EMPLOYEE_REQUIREMENTS = [
    {"type": "right_to_work", "title": "Right to Work", "description": "Proof of eligibility to work in the UK", "renewal_months": None, "mandatory": True},
    {"type": "first_aid", "title": "First Aid Certificate", "description": "Emergency first aid at work", "renewal_months": 36, "mandatory": True},
    {"type": "fire_safety", "title": "Fire Safety Training", "description": "Fire awareness and evacuation", "renewal_months": 12, "mandatory": True},
    {"type": "health_safety", "title": "Health & Safety", "description": "General H&S induction", "renewal_months": 36, "mandatory": True},
]

# ======================= COMPREHENSIVE COMPLIANCE DOCUMENTS =======================

COMPLIANCE_DOCUMENTS = {
    "dental": [
        {"id": "dental_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Comprehensive health and safety policy for dental practices compliant with Health and Safety at Work Act 1974", "is_mandatory": True, "version": "2.1"},
        {"id": "dental_gdpr_001", "title": "GDPR Patient Data Policy", "category": "GDPR & Data Protection", "description": "Data protection policy compliant with UK GDPR for patient records, including SAR procedures", "is_mandatory": True, "version": "3.0"},
        {"id": "dental_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Equal opportunities policy compliant with Equality Act 2010", "is_mandatory": True, "version": "1.5"},
        {"id": "dental_sg_001", "title": "Safeguarding Policy", "category": "Safeguarding", "description": "Child and vulnerable adult safeguarding procedures per CQC requirements", "is_mandatory": True, "version": "2.0"},
        {"id": "dental_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "NHS complaints procedure (Local Authority Social Services and NHS Complaints Regulations 2009)", "is_mandatory": True, "version": "1.8"},
        {"id": "dental_ra_001", "title": "Clinical Risk Assessment", "category": "Risk Assessments", "description": "Risk assessment template for dental procedures", "is_mandatory": True, "version": "2.2"},
        {"id": "dental_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Employee handbook covering contracts, policies, and GDC standards", "is_mandatory": True, "version": "4.0"},
        {"id": "dental_mp_001", "title": "CQC Registration Certificate", "category": "Mandatory Posters", "description": "CQC registration display requirements", "is_mandatory": True, "version": "1.0"},
        {"id": "dental_rg_001", "title": "CQC Fundamental Standards Guide", "category": "Regulatory Guidance", "description": "Guide to CQC's 5 key questions: Safe, Effective, Caring, Responsive, Well-led", "is_mandatory": True, "version": "2.5"},
        {"id": "dental_ic_001", "title": "Infection Control Policy (HTM 01-05)", "category": "Infection Control", "description": "Decontamination in primary care dental practices per HTM 01-05", "is_mandatory": True, "version": "3.1"},
        {"id": "dental_ra_002", "title": "Sharps & Needlestick Injury Protocol", "category": "Risk Assessments", "description": "Sharps injury prevention and post-exposure management", "is_mandatory": True, "version": "2.0"},
        {"id": "dental_rg_002", "title": "GDC Standards Guidance", "category": "Regulatory Guidance", "description": "General Dental Council Standards for the Dental Team", "is_mandatory": True, "version": "1.5"},
        {"id": "dental_fire_001", "title": "Fire Safety Policy", "category": "Fire Safety", "description": "Fire risk assessment and evacuation procedures", "is_mandatory": True, "version": "2.0"},
    ],
    "healthcare": [
        {"id": "health_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "NHS compliant health and safety policy", "is_mandatory": True, "version": "3.0"},
        {"id": "health_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "UK GDPR and Caldicott principles compliant policy", "is_mandatory": True, "version": "2.5"},
        {"id": "health_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "NHS equality framework compliant policy with EDS2 alignment", "is_mandatory": True, "version": "2.0"},
        {"id": "health_sg_001", "title": "Safeguarding Policy", "category": "Safeguarding", "description": "Adult and child safeguarding per Care Act 2014 and Children Act 2004", "is_mandatory": True, "version": "3.0"},
        {"id": "health_cp_001", "title": "Complaints Policy", "category": "Complaints Procedures", "description": "NHS complaints procedure with PALS guidance", "is_mandatory": True, "version": "2.2"},
        {"id": "health_ra_001", "title": "Clinical Risk Assessment Framework", "category": "Risk Assessments", "description": "NHS clinical risk management framework", "is_mandatory": True, "version": "2.8"},
        {"id": "health_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Healthcare worker handbook including NHS employment standards", "is_mandatory": True, "version": "4.5"},
        {"id": "health_mp_001", "title": "Health & Safety Law Poster", "category": "Mandatory Posters", "description": "HSE approved poster", "is_mandatory": True, "version": "1.0"},
        {"id": "health_rg_001", "title": "CQC Key Lines of Enquiry", "category": "Regulatory Guidance", "description": "Complete CQC KLOEs and quality statements", "is_mandatory": True, "version": "3.0"},
        {"id": "health_ic_001", "title": "Infection Prevention & Control Policy", "category": "Infection Control", "description": "IPC policy aligned with NHS England guidance", "is_mandatory": True, "version": "3.5"},
        {"id": "health_dols_001", "title": "Mental Capacity & DoLS Policy", "category": "Regulatory Guidance", "description": "Mental Capacity Act 2005 and Deprivation of Liberty Safeguards", "is_mandatory": True, "version": "2.0"},
    ],
    "care_home": [
        {"id": "care_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Care home health and safety policy", "is_mandatory": True, "version": "2.5"},
        {"id": "care_gdpr_001", "title": "Resident Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for resident personal and medical information", "is_mandatory": True, "version": "2.0"},
        {"id": "care_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Care sector equality and human rights policy", "is_mandatory": True, "version": "1.8"},
        {"id": "care_sg_001", "title": "Safeguarding Adults Policy", "category": "Safeguarding", "description": "Adult safeguarding per Care Act 2014 s42-46", "is_mandatory": True, "version": "3.5"},
        {"id": "care_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Resident and family complaints handling", "is_mandatory": True, "version": "2.0"},
        {"id": "care_ra_001", "title": "Moving & Handling Risk Assessment", "category": "Risk Assessments", "description": "LOLER and manual handling assessment", "is_mandatory": True, "version": "2.2"},
        {"id": "care_sh_001", "title": "Care Worker Handbook", "category": "Staff Handbook", "description": "Staff handbook including Care Certificate standards", "is_mandatory": True, "version": "3.5"},
        {"id": "care_mp_001", "title": "CQC Rating Display", "category": "Mandatory Posters", "description": "CQC rating and registration certificate display", "is_mandatory": True, "version": "1.0"},
        {"id": "care_rg_001", "title": "CQC Single Assessment Framework", "category": "Regulatory Guidance", "description": "CQC inspection framework and quality statements", "is_mandatory": True, "version": "2.8"},
        {"id": "care_dols_001", "title": "DoLS & Mental Capacity Policy", "category": "Regulatory Guidance", "description": "Deprivation of Liberty Safeguards procedures", "is_mandatory": True, "version": "2.5"},
        {"id": "care_med_001", "title": "Medication Management Policy", "category": "Regulatory Guidance", "description": "Safe handling, storage, and administration of medicines", "is_mandatory": True, "version": "3.0"},
        {"id": "care_falls_001", "title": "Falls Prevention Policy", "category": "Risk Assessments", "description": "Falls risk assessment and prevention strategy", "is_mandatory": True, "version": "2.0"},
    ],
    "veterinary": [
        {"id": "vet_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Veterinary practice H&S policy including animal handling risks", "is_mandatory": True, "version": "2.5"},
        {"id": "vet_gdpr_001", "title": "Client Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for client and animal records", "is_mandatory": True, "version": "2.0"},
        {"id": "vet_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Equal opportunities policy", "is_mandatory": True, "version": "1.5"},
        {"id": "vet_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client complaints handling aligned with RCVS guidance", "is_mandatory": True, "version": "1.8"},
        {"id": "vet_ra_001", "title": "Clinical Risk Assessment", "category": "Risk Assessments", "description": "Veterinary clinical and zoonotic risk assessment", "is_mandatory": True, "version": "2.2"},
        {"id": "vet_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Employee handbook including RCVS Code of Conduct", "is_mandatory": True, "version": "3.0"},
        {"id": "vet_rg_001", "title": "RCVS Practice Standards", "category": "Regulatory Guidance", "description": "RCVS Practice Standards Scheme requirements", "is_mandatory": True, "version": "2.5"},
        {"id": "vet_cd_001", "title": "Controlled Drugs Policy", "category": "Regulatory Guidance", "description": "Veterinary medicines and controlled drugs handling", "is_mandatory": True, "version": "2.0"},
        {"id": "vet_ic_001", "title": "Infection Control Policy", "category": "Infection Control", "description": "Biosecurity and infection prevention", "is_mandatory": True, "version": "2.0"},
        {"id": "vet_rad_001", "title": "Radiation Protection Policy", "category": "Health & Safety", "description": "IR(ME)R and ionising radiation safety", "is_mandatory": True, "version": "1.5"},
    ],
    "nursery": [
        {"id": "nur_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Early years health and safety policy", "is_mandatory": True, "version": "3.0"},
        {"id": "nur_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for children's records and photographs", "is_mandatory": True, "version": "2.5"},
        {"id": "nur_eq_001", "title": "Equality & Inclusion Policy", "category": "Equality & Diversity", "description": "SEND and equality policy for early years", "is_mandatory": True, "version": "2.0"},
        {"id": "nur_sg_001", "title": "Child Safeguarding Policy", "category": "Safeguarding", "description": "Safeguarding children per Working Together 2023 and KCSIE", "is_mandatory": True, "version": "4.0"},
        {"id": "nur_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Parent complaints handling", "is_mandatory": True, "version": "2.0"},
        {"id": "nur_ra_001", "title": "Daily Risk Assessments", "category": "Risk Assessments", "description": "Indoor and outdoor activity risk assessments", "is_mandatory": True, "version": "2.5"},
        {"id": "nur_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "EYFS requirements and staff conduct", "is_mandatory": True, "version": "3.5"},
        {"id": "nur_rg_001", "title": "Ofsted Requirements Guide", "category": "Regulatory Guidance", "description": "Early Years Inspection Framework guidance", "is_mandatory": True, "version": "3.0"},
        {"id": "nur_prevent_001", "title": "Prevent Duty Policy", "category": "Safeguarding", "description": "Counter-terrorism and British values", "is_mandatory": True, "version": "2.0"},
        {"id": "nur_food_001", "title": "Food Safety Policy", "category": "Food Safety", "description": "Food hygiene and allergy management", "is_mandatory": True, "version": "2.5"},
        {"id": "nur_eyfs_001", "title": "EYFS Curriculum Policy", "category": "Regulatory Guidance", "description": "Early Years Foundation Stage delivery", "is_mandatory": True, "version": "2.0"},
    ],
    "education": [
        {"id": "edu_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "School/college H&S policy", "is_mandatory": True, "version": "3.0"},
        {"id": "edu_gdpr_001", "title": "Student Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for student records and consent", "is_mandatory": True, "version": "2.5"},
        {"id": "edu_eq_001", "title": "Equality & Accessibility Plan", "category": "Equality & Diversity", "description": "Public Sector Equality Duty compliance", "is_mandatory": True, "version": "2.0"},
        {"id": "edu_sg_001", "title": "Child Protection Policy", "category": "Safeguarding", "description": "Keeping Children Safe in Education 2024 compliant", "is_mandatory": True, "version": "4.0"},
        {"id": "edu_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Parent and student complaints procedure", "is_mandatory": True, "version": "2.2"},
        {"id": "edu_ra_001", "title": "Educational Visit Risk Assessment", "category": "Risk Assessments", "description": "School trip and activity risk assessments", "is_mandatory": True, "version": "2.8"},
        {"id": "edu_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Staff code of conduct and professional standards", "is_mandatory": True, "version": "3.5"},
        {"id": "edu_rg_001", "title": "Ofsted Framework Guide", "category": "Regulatory Guidance", "description": "Education Inspection Framework guidance", "is_mandatory": True, "version": "3.0"},
        {"id": "edu_prevent_001", "title": "Prevent Duty Policy", "category": "Safeguarding", "description": "Counter-terrorism duty in education", "is_mandatory": True, "version": "2.5"},
        {"id": "edu_behaviour_001", "title": "Behaviour Policy", "category": "Regulatory Guidance", "description": "Behaviour in schools guidance compliance", "is_mandatory": True, "version": "2.0"},
    ],
    "construction": [
        {"id": "const_hs_001", "title": "Construction H&S Policy", "category": "Health & Safety", "description": "CDM 2015 compliant health and safety policy", "is_mandatory": True, "version": "3.2"},
        {"id": "const_gdpr_001", "title": "Employee Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for workforce data", "is_mandatory": True, "version": "1.5"},
        {"id": "const_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Construction industry equality policy", "is_mandatory": True, "version": "1.8"},
        {"id": "const_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client and subcontractor complaints", "is_mandatory": True, "version": "1.5"},
        {"id": "const_ra_001", "title": "Site Risk Assessment", "category": "Risk Assessments", "description": "CDM principal contractor risk assessment", "is_mandatory": True, "version": "4.0"},
        {"id": "const_ra_002", "title": "COSHH Assessment", "category": "Risk Assessments", "description": "Hazardous substances assessment", "is_mandatory": True, "version": "2.5"},
        {"id": "const_sh_001", "title": "Site Worker Handbook", "category": "Staff Handbook", "description": "Construction worker safety rules and induction", "is_mandatory": True, "version": "3.0"},
        {"id": "const_rg_001", "title": "HSE CDM 2015 Guide", "category": "Regulatory Guidance", "description": "Construction Design and Management Regulations guidance", "is_mandatory": True, "version": "2.0"},
        {"id": "const_asb_001", "title": "Asbestos Management Plan", "category": "Health & Safety", "description": "Control of Asbestos Regulations 2012 compliance", "is_mandatory": True, "version": "2.5"},
        {"id": "const_method_001", "title": "Method Statement Templates", "category": "Risk Assessments", "description": "Safe system of work templates", "is_mandatory": True, "version": "2.0"},
        {"id": "const_env_001", "title": "Environmental Policy", "category": "Environmental", "description": "Site waste management and environmental protection", "is_mandatory": True, "version": "2.0"},
    ],
    "hospitality": [
        {"id": "hosp_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Hospitality sector H&S policy", "is_mandatory": True, "version": "2.8"},
        {"id": "hosp_gdpr_001", "title": "Guest Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for guest data and CCTV", "is_mandatory": True, "version": "2.0"},
        {"id": "hosp_eq_001", "title": "Equality & Accessibility Policy", "category": "Equality & Diversity", "description": "Accessible premises and services", "is_mandatory": True, "version": "1.5"},
        {"id": "hosp_cp_001", "title": "Guest Complaints Procedure", "category": "Complaints Procedures", "description": "Guest complaints and feedback handling", "is_mandatory": True, "version": "2.2"},
        {"id": "hosp_ra_001", "title": "Food Safety Risk Assessment", "category": "Food Safety", "description": "HACCP-based food safety management", "is_mandatory": True, "version": "3.5"},
        {"id": "hosp_fire_001", "title": "Fire Safety Policy", "category": "Fire Safety", "description": "Fire risk assessment and evacuation per Regulatory Reform Order 2005", "is_mandatory": True, "version": "2.0"},
        {"id": "hosp_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Hospitality staff handbook", "is_mandatory": True, "version": "3.2"},
        {"id": "hosp_allergen_001", "title": "Allergen Management Policy", "category": "Food Safety", "description": "14 allergens compliance and Natasha's Law", "is_mandatory": True, "version": "2.5"},
        {"id": "hosp_lic_001", "title": "Licensing Compliance Guide", "category": "Regulatory Guidance", "description": "Premises licence and licensing objectives", "is_mandatory": True, "version": "2.0"},
    ],
    "restaurant": [
        {"id": "rest_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Restaurant H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "rest_gdpr_001", "title": "Customer Data Policy", "category": "GDPR & Data Protection", "description": "Booking and payment data protection", "is_mandatory": True, "version": "2.0"},
        {"id": "rest_food_001", "title": "Food Safety Management System", "category": "Food Safety", "description": "HACCP and Safer Food Better Business", "is_mandatory": True, "version": "3.0"},
        {"id": "rest_allergen_001", "title": "Allergen Policy", "category": "Food Safety", "description": "Allergen information and cross-contamination prevention", "is_mandatory": True, "version": "2.5"},
        {"id": "rest_fire_001", "title": "Fire Safety Policy", "category": "Fire Safety", "description": "Kitchen fire safety and evacuation", "is_mandatory": True, "version": "2.0"},
        {"id": "rest_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Restaurant staff policies", "is_mandatory": True, "version": "2.5"},
        {"id": "rest_rg_001", "title": "Food Hygiene Rating Guide", "category": "Regulatory Guidance", "description": "Achieving and maintaining 5-star rating", "is_mandatory": True, "version": "2.0"},
    ],
    "retail": [
        {"id": "ret_hs_001", "title": "Retail Health & Safety Policy", "category": "Health & Safety", "description": "Retail sector H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "ret_gdpr_001", "title": "Customer Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR for retail customers and loyalty schemes", "is_mandatory": True, "version": "2.2"},
        {"id": "ret_eq_001", "title": "Equality & Accessibility Policy", "category": "Equality & Diversity", "description": "Accessible retail premises", "is_mandatory": True, "version": "1.8"},
        {"id": "ret_cp_001", "title": "Customer Complaints Policy", "category": "Complaints Procedures", "description": "Returns, refunds, and complaints", "is_mandatory": True, "version": "2.0"},
        {"id": "ret_ra_001", "title": "Store Risk Assessment", "category": "Risk Assessments", "description": "Retail premises risk assessment", "is_mandatory": True, "version": "2.5"},
        {"id": "ret_sh_001", "title": "Retail Staff Handbook", "category": "Staff Handbook", "description": "Employee handbook for retail staff", "is_mandatory": True, "version": "3.0"},
        {"id": "ret_rg_001", "title": "Trading Standards Guide", "category": "Regulatory Guidance", "description": "Consumer Rights Act 2015 compliance", "is_mandatory": True, "version": "2.0"},
        {"id": "ret_fire_001", "title": "Fire Safety Policy", "category": "Fire Safety", "description": "Retail fire safety and evacuation", "is_mandatory": True, "version": "2.0"},
    ],
    "office": [
        {"id": "off_hs_001", "title": "Office Health & Safety Policy", "category": "Health & Safety", "description": "Office and professional services H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "off_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "UK GDPR policy for professional services", "is_mandatory": True, "version": "2.8"},
        {"id": "off_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Office equality and inclusion policy", "is_mandatory": True, "version": "2.0"},
        {"id": "off_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client complaints handling", "is_mandatory": True, "version": "1.8"},
        {"id": "off_ra_001", "title": "DSE Risk Assessment", "category": "Risk Assessments", "description": "Display screen equipment assessment", "is_mandatory": True, "version": "2.2"},
        {"id": "off_fire_001", "title": "Fire Safety Policy", "category": "Fire Safety", "description": "Office fire risk assessment and evacuation", "is_mandatory": True, "version": "2.0"},
        {"id": "off_sh_001", "title": "Employee Handbook", "category": "Staff Handbook", "description": "Professional services staff handbook", "is_mandatory": True, "version": "3.5"},
        {"id": "off_rg_001", "title": "ICO GDPR Guide", "category": "Regulatory Guidance", "description": "Information Commissioner's Office guidance", "is_mandatory": True, "version": "2.5"},
        {"id": "off_wfh_001", "title": "Remote Working Policy", "category": "Health & Safety", "description": "Home working health and safety", "is_mandatory": True, "version": "2.0"},
    ],
    "salon": [
        {"id": "salon_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Salon H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "salon_gdpr_001", "title": "Client Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR for client records and photos", "is_mandatory": True, "version": "2.0"},
        {"id": "salon_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client complaints handling", "is_mandatory": True, "version": "1.5"},
        {"id": "salon_ic_001", "title": "Hygiene & Infection Control", "category": "Infection Control", "description": "Tool sterilisation and hygiene protocols", "is_mandatory": True, "version": "2.5"},
        {"id": "salon_ra_001", "title": "Treatment Risk Assessments", "category": "Risk Assessments", "description": "Risk assessments for salon treatments", "is_mandatory": True, "version": "2.0"},
        {"id": "salon_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Salon employee handbook", "is_mandatory": True, "version": "2.5"},
        {"id": "salon_coshh_001", "title": "COSHH Assessment", "category": "Health & Safety", "description": "Chemical product risk assessment", "is_mandatory": True, "version": "2.0"},
    ],
    "cleaning": [
        {"id": "clean_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Cleaning services H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "clean_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "Client premises access and data handling", "is_mandatory": True, "version": "1.5"},
        {"id": "clean_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client complaints handling", "is_mandatory": True, "version": "1.5"},
        {"id": "clean_coshh_001", "title": "COSHH Assessment", "category": "Health & Safety", "description": "Cleaning chemicals risk assessment", "is_mandatory": True, "version": "2.5"},
        {"id": "clean_mh_001", "title": "Manual Handling Policy", "category": "Health & Safety", "description": "Safe lifting and equipment use", "is_mandatory": True, "version": "2.0"},
        {"id": "clean_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Cleaning staff handbook", "is_mandatory": True, "version": "2.0"},
    ],
    "security": [
        {"id": "sec_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Security services H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "sec_gdpr_001", "title": "Data Protection & CCTV Policy", "category": "GDPR & Data Protection", "description": "GDPR and surveillance camera code compliance", "is_mandatory": True, "version": "2.5"},
        {"id": "sec_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Non-discriminatory security practices", "is_mandatory": True, "version": "2.0"},
        {"id": "sec_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Public complaints handling", "is_mandatory": True, "version": "1.5"},
        {"id": "sec_ra_001", "title": "Violence & Aggression Risk Assessment", "category": "Risk Assessments", "description": "Lone working and conflict situations", "is_mandatory": True, "version": "2.5"},
        {"id": "sec_sh_001", "title": "Security Officer Handbook", "category": "Staff Handbook", "description": "SIA licence holder handbook", "is_mandatory": True, "version": "2.5"},
        {"id": "sec_rg_001", "title": "SIA Compliance Guide", "category": "Regulatory Guidance", "description": "Security Industry Authority requirements", "is_mandatory": True, "version": "2.0"},
    ],
}

# Default documents for sectors not specifically defined
DEFAULT_COMPLIANCE_DOCUMENTS = [
    {"id": "gen_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "General workplace health and safety policy", "is_mandatory": True, "version": "2.0"},
    {"id": "gen_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "UK GDPR compliance policy", "is_mandatory": True, "version": "2.0"},
    {"id": "gen_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Equal opportunities policy", "is_mandatory": True, "version": "1.5"},
    {"id": "gen_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Customer and employee complaints handling", "is_mandatory": True, "version": "1.5"},
    {"id": "gen_ra_001", "title": "Workplace Risk Assessment", "category": "Risk Assessments", "description": "General workplace risk assessment template", "is_mandatory": True, "version": "2.0"},
    {"id": "gen_fire_001", "title": "Fire Safety Policy", "category": "Fire Safety", "description": "Fire risk assessment and evacuation", "is_mandatory": True, "version": "2.0"},
    {"id": "gen_sh_001", "title": "Employee Handbook", "category": "Staff Handbook", "description": "General employee handbook", "is_mandatory": True, "version": "2.5"},
    {"id": "gen_mp_001", "title": "Health & Safety Law Poster", "category": "Mandatory Posters", "description": "HSE approved poster", "is_mandatory": True, "version": "1.0"},
]

# ======================= AUTH ROUTES =======================

@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "role": "business_owner",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    
    token = create_token(user_id, user_data.email, "business_owner")
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            full_name=user_data.full_name,
            role="business_owner",
            created_at=user["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"], user["role"])
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        role=current_user["role"],
        created_at=current_user["created_at"]
    )

# ======================= BUSINESS ROUTES =======================

@api_router.post("/business", response_model=BusinessResponse)
async def create_business(business_data: BusinessCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.businesses.find_one({"user_id": current_user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Business already exists for this user")
    
    business_id = str(uuid.uuid4())
    business = {
        "id": business_id,
        "user_id": current_user["id"],
        "name": business_data.name,
        "industry": business_data.industry,
        "sector": business_data.sector,
        "size": business_data.size,
        "uk_nation": business_data.uk_nation,
        "address": business_data.address,
        "phone": business_data.phone,
        "subscription_status": "inactive",
        "subscription_plan": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.businesses.insert_one(business)
    
    await generate_compliance_checklist(business_id, business_data.sector)
    
    # Generate compliance items for the new compliance score system
    await generate_business_compliance_items(business_id, business_data.sector)
    
    return BusinessResponse(**{k: v for k, v in business.items() if k != "_id"})

@api_router.get("/business", response_model=Optional[BusinessResponse])
async def get_business(current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        return None
    return BusinessResponse(**business)

@api_router.put("/business", response_model=BusinessResponse)
async def update_business(business_data: BusinessCreate, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    update_data = {
        "name": business_data.name,
        "industry": business_data.industry,
        "sector": business_data.sector,
        "size": business_data.size,
        "uk_nation": business_data.uk_nation,
        "address": business_data.address,
        "phone": business_data.phone
    }
    
    if business["sector"] != business_data.sector:
        # Delete old checklist items
        await db.checklists.delete_many({"business_id": business["id"]})
        await generate_compliance_checklist(business["id"], business_data.sector)
        
        # Archive old compliance items (don't delete - keep history)
        await db.compliance_items.update_many(
            {"business_id": business["id"]},
            {"$set": {"archived": True, "archived_at": datetime.now(timezone.utc).isoformat()}}
        )
        # Generate new compliance items for new industry
        await generate_business_compliance_items(business["id"], business_data.sector)
        # Recalculate score
        await calculate_compliance_score(business["id"])
    
    await db.businesses.update_one({"id": business["id"]}, {"$set": update_data})
    updated = await db.businesses.find_one({"id": business["id"]}, {"_id": 0})
    return BusinessResponse(**updated)

# ======================= COMPLIANCE CHECKLIST ROUTES =======================

async def generate_compliance_checklist(business_id: str, sector: str):
    documents = COMPLIANCE_DOCUMENTS.get(sector, DEFAULT_COMPLIANCE_DOCUMENTS)
    now = datetime.now(timezone.utc)
    
    for doc in documents:
        checklist_item = {
            "id": str(uuid.uuid4()),
            "business_id": business_id,
            "document_id": doc["id"],
            "title": doc["title"],
            "category": doc["category"],
            "description": doc["description"],
            "status": "not_started",
            "is_mandatory": doc["is_mandatory"],
            "version": doc["version"],
            "last_reviewed": None,
            "next_review_due": (now + timedelta(days=365)).isoformat(),
            "created_at": now.isoformat()
        }
        await db.checklists.insert_one(checklist_item)

@api_router.get("/checklist", response_model=List[ChecklistItemResponse])
async def get_checklist(current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found. Please complete onboarding.")
    
    items = await db.checklists.find({"business_id": business["id"]}, {"_id": 0}).to_list(1000)
    return [ChecklistItemResponse(**item) for item in items]

@api_router.put("/checklist/{item_id}/status")
async def update_checklist_status(item_id: str, status: str, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    item = await db.checklists.find_one({"id": item_id, "business_id": business["id"]})
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    
    if status not in ["complete", "needs_review", "not_started"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    now = datetime.now(timezone.utc)
    update_data = {"status": status}
    
    if status == "complete":
        update_data["last_reviewed"] = now.isoformat()
        update_data["next_review_due"] = (now + timedelta(days=365)).isoformat()
    
    await db.checklists.update_one({"id": item_id}, {"$set": update_data})
    return {"message": "Status updated successfully"}

# ======================= DOCUMENTS ROUTES =======================

@api_router.get("/documents", response_model=List[DocumentResponse])
async def get_documents(current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found. Please complete onboarding.")
    
    sector = business["sector"]
    documents = COMPLIANCE_DOCUMENTS.get(sector, DEFAULT_COMPLIANCE_DOCUMENTS)
    
    return [DocumentResponse(
        id=doc["id"],
        title=doc["title"],
        category=doc["category"],
        description=doc["description"],
        sector=sector,
        file_url=None,
        version=doc["version"],
        last_updated=datetime.now(timezone.utc).isoformat(),
        is_mandatory=doc["is_mandatory"]
    ) for doc in documents]

@api_router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    sector = business["sector"]
    documents = COMPLIANCE_DOCUMENTS.get(sector, DEFAULT_COMPLIANCE_DOCUMENTS)
    
    doc = next((d for d in documents if d["id"] == document_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return DocumentResponse(
        id=doc["id"],
        title=doc["title"],
        category=doc["category"],
        description=doc["description"],
        sector=sector,
        file_url=None,
        version=doc["version"],
        last_updated=datetime.now(timezone.utc).isoformat(),
        is_mandatory=doc["is_mandatory"]
    )

# ======================= EMPLOYEE ROUTES =======================

@api_router.post("/employees", response_model=EmployeeResponse)
async def create_employee(employee_data: EmployeeCreate, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found. Please complete onboarding.")
    
    employee_id = str(uuid.uuid4())
    employee = {
        "id": employee_id,
        "business_id": business["id"],
        "first_name": employee_data.first_name,
        "last_name": employee_data.last_name,
        "email": employee_data.email,
        "job_title": employee_data.job_title,
        "department": employee_data.department,
        "start_date": employee_data.start_date,
        "phone": employee_data.phone,
        "emergency_contact": employee_data.emergency_contact,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.employees.insert_one(employee)
    
    # Auto-generate required compliance items for the employee based on sector
    sector = business["sector"]
    requirements = EMPLOYEE_REQUIREMENTS.get(sector, DEFAULT_EMPLOYEE_REQUIREMENTS)
    
    for req in requirements:
        requirement = {
            "id": str(uuid.uuid4()),
            "employee_id": employee_id,
            "requirement_type": req["type"],
            "title": req["title"],
            "description": req["description"],
            "issue_date": None,
            "expiry_date": None,
            "reference_number": None,
            "status": "pending",
            "is_mandatory": req["mandatory"],
            "renewal_months": req["renewal_months"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.employee_requirements.insert_one(requirement)
    
    return EmployeeResponse(**{k: v for k, v in employee.items() if k != "_id"})

@api_router.get("/employees", response_model=List[EmployeeResponse])
async def get_employees(current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found. Please complete onboarding.")
    
    employees = await db.employees.find({"business_id": business["id"]}, {"_id": 0}).to_list(1000)
    
    # Add compliance summary for each employee
    result = []
    for emp in employees:
        requirements = await db.employee_requirements.find({"employee_id": emp["id"]}, {"_id": 0}).to_list(100)
        
        total = len(requirements)
        valid = sum(1 for r in requirements if r["status"] == "valid")
        expired = sum(1 for r in requirements if r["status"] == "expired")
        expiring = sum(1 for r in requirements if r["status"] == "expiring_soon")
        pending = sum(1 for r in requirements if r["status"] == "pending")
        
        emp["compliance_summary"] = {
            "total": total,
            "valid": valid,
            "expired": expired,
            "expiring_soon": expiring,
            "pending": pending,
            "compliance_rate": round((valid / total * 100) if total > 0 else 0)
        }
        result.append(EmployeeResponse(**emp))
    
    return result

@api_router.get("/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: str, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employee = await db.employees.find_one({"id": employee_id, "business_id": business["id"]}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    requirements = await db.employee_requirements.find({"employee_id": employee_id}, {"_id": 0}).to_list(100)
    
    total = len(requirements)
    valid = sum(1 for r in requirements if r["status"] == "valid")
    expired = sum(1 for r in requirements if r["status"] == "expired")
    expiring = sum(1 for r in requirements if r["status"] == "expiring_soon")
    pending = sum(1 for r in requirements if r["status"] == "pending")
    
    employee["compliance_summary"] = {
        "total": total,
        "valid": valid,
        "expired": expired,
        "expiring_soon": expiring,
        "pending": pending,
        "compliance_rate": round((valid / total * 100) if total > 0 else 0)
    }
    
    return EmployeeResponse(**employee)

@api_router.put("/employees/{employee_id}", response_model=EmployeeResponse)
async def update_employee(employee_id: str, employee_data: EmployeeUpdate, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employee = await db.employees.find_one({"id": employee_id, "business_id": business["id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = {k: v for k, v in employee_data.model_dump().items() if v is not None}
    
    if update_data:
        await db.employees.update_one({"id": employee_id}, {"$set": update_data})
    
    updated = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    return EmployeeResponse(**updated)

@api_router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employee = await db.employees.find_one({"id": employee_id, "business_id": business["id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Delete employee requirements first
    await db.employee_requirements.delete_many({"employee_id": employee_id})
    await db.employees.delete_one({"id": employee_id})
    
    return {"message": "Employee deleted successfully"}

# ======================= EMPLOYEE REQUIREMENTS ROUTES =======================

@api_router.get("/employees/{employee_id}/requirements", response_model=List[EmployeeRequirementResponse])
async def get_employee_requirements(employee_id: str, current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employee = await db.employees.find_one({"id": employee_id, "business_id": business["id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    requirements = await db.employee_requirements.find({"employee_id": employee_id}, {"_id": 0}).to_list(100)
    
    result = []
    for req in requirements:
        status, days_until = calculate_requirement_status(req.get("expiry_date"))
        req["status"] = status
        req["days_until_expiry"] = days_until
        result.append(EmployeeRequirementResponse(**req))
    
    return result

@api_router.put("/employees/{employee_id}/requirements/{requirement_id}", response_model=EmployeeRequirementResponse)
async def update_employee_requirement(
    employee_id: str, 
    requirement_id: str, 
    requirement_data: EmployeeRequirementUpdate,
    current_user: dict = Depends(get_current_user)
):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employee = await db.employees.find_one({"id": employee_id, "business_id": business["id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    requirement = await db.employee_requirements.find_one({"id": requirement_id, "employee_id": employee_id})
    if not requirement:
        raise HTTPException(status_code=404, detail="Requirement not found")
    
    update_data = {k: v for k, v in requirement_data.model_dump().items() if v is not None}
    
    # Auto-calculate status based on expiry date
    if "expiry_date" in update_data:
        status, _ = calculate_requirement_status(update_data["expiry_date"])
        update_data["status"] = status
    
    if update_data:
        await db.employee_requirements.update_one({"id": requirement_id}, {"$set": update_data})
    
    updated = await db.employee_requirements.find_one({"id": requirement_id}, {"_id": 0})
    status, days_until = calculate_requirement_status(updated.get("expiry_date"))
    updated["status"] = status
    updated["days_until_expiry"] = days_until
    
    return EmployeeRequirementResponse(**updated)

@api_router.post("/employees/{employee_id}/requirements", response_model=EmployeeRequirementResponse)
async def add_employee_requirement(
    employee_id: str,
    requirement_data: EmployeeRequirementCreate,
    current_user: dict = Depends(get_current_user)
):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employee = await db.employees.find_one({"id": employee_id, "business_id": business["id"]})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    status, days_until = calculate_requirement_status(requirement_data.expiry_date)
    
    requirement = {
        "id": str(uuid.uuid4()),
        "employee_id": employee_id,
        "requirement_type": requirement_data.requirement_type,
        "title": requirement_data.title,
        "description": requirement_data.description,
        "issue_date": requirement_data.issue_date,
        "expiry_date": requirement_data.expiry_date,
        "reference_number": requirement_data.reference_number,
        "status": status,
        "is_mandatory": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.employee_requirements.insert_one(requirement)
    
    requirement["days_until_expiry"] = days_until
    return EmployeeRequirementResponse(**{k: v for k, v in requirement.items() if k != "_id"})

# ======================= EMPLOYEE COMPLIANCE OVERVIEW =======================

@api_router.get("/employees/compliance/overview")
async def get_employee_compliance_overview(current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    employees = await db.employees.find({"business_id": business["id"], "is_active": True}, {"_id": 0}).to_list(1000)
    
    total_employees = len(employees)
    total_requirements = 0
    valid_requirements = 0
    expired_requirements = 0
    expiring_requirements = 0
    pending_requirements = 0
    
    overdue_items = []
    expiring_soon_items = []
    
    for emp in employees:
        requirements = await db.employee_requirements.find({"employee_id": emp["id"]}, {"_id": 0}).to_list(100)
        
        for req in requirements:
            total_requirements += 1
            status, days_until = calculate_requirement_status(req.get("expiry_date"))
            
            if status == "valid":
                valid_requirements += 1
            elif status == "expired":
                expired_requirements += 1
                overdue_items.append({
                    "employee_name": f"{emp['first_name']} {emp['last_name']}",
                    "employee_id": emp["id"],
                    "requirement": req["title"],
                    "requirement_id": req["id"],
                    "expiry_date": req.get("expiry_date"),
                    "days_overdue": abs(days_until) if days_until else None
                })
            elif status == "expiring_soon":
                expiring_requirements += 1
                expiring_soon_items.append({
                    "employee_name": f"{emp['first_name']} {emp['last_name']}",
                    "employee_id": emp["id"],
                    "requirement": req["title"],
                    "requirement_id": req["id"],
                    "expiry_date": req.get("expiry_date"),
                    "days_until_expiry": days_until
                })
            else:
                pending_requirements += 1
    
    compliance_rate = round((valid_requirements / total_requirements * 100) if total_requirements > 0 else 0)
    
    return {
        "total_employees": total_employees,
        "total_requirements": total_requirements,
        "valid_requirements": valid_requirements,
        "expired_requirements": expired_requirements,
        "expiring_soon_requirements": expiring_requirements,
        "pending_requirements": pending_requirements,
        "overall_compliance_rate": compliance_rate,
        "overdue_items": sorted(overdue_items, key=lambda x: x.get("days_overdue") or 0, reverse=True)[:10],
        "expiring_soon_items": sorted(expiring_soon_items, key=lambda x: x.get("days_until_expiry") or 999)[:10]
    }

@api_router.get("/employees/requirements/types")
async def get_requirement_types(current_user: dict = Depends(get_current_user)):
    """Get available requirement types for the business sector"""
    business = await db.businesses.find_one({"user_id": current_user["id"]})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    sector = business["sector"]
    requirements = EMPLOYEE_REQUIREMENTS.get(sector, DEFAULT_EMPLOYEE_REQUIREMENTS)
    
    return [{"type": req["type"], "title": req["title"], "description": req["description"]} for req in requirements]

# ======================= NOTIFICATIONS ROUTES =======================

@api_router.get("/notifications", response_model=List[NotificationResponse])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    return [NotificationResponse(**n) for n in notifications]

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.notifications.update_one(
        {"id": notification_id, "user_id": current_user["id"]},
        {"$set": {"is_read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}

@api_router.post("/notifications/mark-all-read")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user["id"]},
        {"$set": {"is_read": True}}
    )
    return {"message": "All notifications marked as read"}

# ======================= SUBSCRIPTION/STRIPE ROUTES =======================

@api_router.get("/subscription/plans")
async def get_subscription_plans():
    return [
        {"plan_id": "monthly", **SUBSCRIPTION_PLANS["monthly"]},
        {"plan_id": "annual", **SUBSCRIPTION_PLANS["annual"]}
    ]

@api_router.post("/subscription/checkout")
async def create_checkout(checkout_data: CheckoutRequest, request: Request, current_user: dict = Depends(get_current_user)):
    if checkout_data.plan not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    plan = SUBSCRIPTION_PLANS[checkout_data.plan]
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{checkout_data.origin_url}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{checkout_data.origin_url}/subscription"
    
    checkout_request = CheckoutSessionRequest(
        amount=plan["price"],
        currency=plan["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user["id"],
            "plan": checkout_data.plan,
            "source": "simplycomply_web"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": current_user["id"],
        "amount": plan["price"],
        "currency": plan["currency"],
        "plan": checkout_data.plan,
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/subscription/status/{session_id}")
async def get_checkout_status(session_id: str, request: Request, current_user: dict = Depends(get_current_user)):
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    
    if transaction and transaction["payment_status"] != "paid" and status.payment_status == "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid", "completed_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        plan = transaction.get("plan", "monthly")
        await db.businesses.update_one(
            {"user_id": current_user["id"]},
            {"$set": {"subscription_status": "active", "subscription_plan": plan}}
        )
        
        notification = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "title": "Subscription Activated",
            "message": f"Your {plan} subscription is now active. Access all compliance documents.",
            "type": "info",
            "is_read": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.notifications.insert_one(notification)
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            
            if transaction and transaction["payment_status"] != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"payment_status": "paid", "completed_at": datetime.now(timezone.utc).isoformat()}}
                )
                
                user_id = webhook_response.metadata.get("user_id")
                plan = webhook_response.metadata.get("plan", "monthly")
                
                if user_id:
                    await db.businesses.update_one(
                        {"user_id": user_id},
                        {"$set": {"subscription_status": "active", "subscription_plan": plan}}
                    )
        
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        return {"status": "error", "message": str(e)}

# ======================= REFERENCE DATA ROUTES =======================

@api_router.get("/reference/sectors")
async def get_sectors():
    return UK_SECTORS

@api_router.get("/reference/nations")
async def get_nations():
    return UK_NATIONS

@api_router.get("/reference/business-sizes")
async def get_business_sizes():
    return BUSINESS_SIZES

@api_router.get("/reference/categories")
async def get_categories():
    return COMPLIANCE_CATEGORIES

# ======================= DASHBOARD STATS ROUTES =======================

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        return {
            "has_business": False,
            "total_documents": 0,
            "completed": 0,
            "needs_review": 0,
            "not_started": 0,
            "completion_percentage": 0,
            "upcoming_reviews": [],
            "employee_stats": None
        }
    
    checklist_items = await db.checklists.find({"business_id": business["id"]}, {"_id": 0}).to_list(1000)
    
    total = len(checklist_items)
    completed = sum(1 for item in checklist_items if item["status"] == "complete")
    needs_review = sum(1 for item in checklist_items if item["status"] == "needs_review")
    not_started = sum(1 for item in checklist_items if item["status"] == "not_started")
    
    now = datetime.now(timezone.utc)
    thirty_days = now + timedelta(days=30)
    upcoming = []
    
    for item in checklist_items:
        if item.get("next_review_due"):
            try:
                review_date = datetime.fromisoformat(item["next_review_due"].replace('Z', '+00:00'))
                if now <= review_date <= thirty_days:
                    upcoming.append({
                        "id": item["id"],
                        "title": item["title"],
                        "due_date": item["next_review_due"]
                    })
            except:
                pass
    
    # Get employee compliance stats
    employees = await db.employees.find({"business_id": business["id"], "is_active": True}, {"_id": 0}).to_list(1000)
    total_employees = len(employees)
    
    employee_expired = 0
    employee_expiring = 0
    
    for emp in employees:
        requirements = await db.employee_requirements.find({"employee_id": emp["id"]}, {"_id": 0}).to_list(100)
        for req in requirements:
            status, _ = calculate_requirement_status(req.get("expiry_date"))
            if status == "expired":
                employee_expired += 1
            elif status == "expiring_soon":
                employee_expiring += 1
    
    return {
        "has_business": True,
        "business": business,
        "total_documents": total,
        "completed": completed,
        "needs_review": needs_review,
        "not_started": not_started,
        "completion_percentage": round((completed / total * 100) if total > 0 else 0),
        "upcoming_reviews": sorted(upcoming, key=lambda x: x["due_date"])[:5],
        "employee_stats": {
            "total_employees": total_employees,
            "expired_requirements": employee_expired,
            "expiring_soon": employee_expiring
        }
    }

# ======================= COMPLIANCE ITEMS & SCORE SYSTEM =======================

# Industry-specific compliance requirements structure
# This maps to the frontend industries.js and serves as the single source of truth for backend
INDUSTRY_COMPLIANCE_MODEL = {
    # Personal & Body Art Services
    "tattoo_studio": {
        "name": "Tattoo Artist / Studio",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "infection_control_policy", "title": "Infection Prevention & Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "client_consent_form", "title": "Client Consultation & Consent Form", "type": "template", "category": "Client Care", "required": True},
            {"key": "aftercare_sheet", "title": "Aftercare Advice Sheet", "type": "template", "category": "Client Care", "required": True},
            {"key": "medical_questionnaire", "title": "Medical History Questionnaire", "type": "template", "category": "Client Care", "required": True},
            {"key": "coshh_assessment", "title": "COSHH Assessment (Inks, Cleaning Agents)", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "sharps_procedure", "title": "Sharps & Clinical Waste Disposal Procedure", "type": "procedure", "category": "Infection Control", "required": True},
            {"key": "autoclave_log", "title": "Autoclave Maintenance & Testing Log", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "sterilisation_records", "title": "Sterilisation Records", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "cleaning_checklist", "title": "Equipment Cleaning Checklist", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "gdpr_privacy_notice", "title": "Client Privacy Notice (GDPR)", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "staff_training_records", "title": "Staff Training Records", "type": "audit", "category": "Staff Management", "required": True},
            {"key": "accident_report_form", "title": "Accident & Incident Report Form", "type": "template", "category": "Health & Safety", "required": True},
            {"key": "age_verification_policy", "title": "Age Verification Policy", "type": "policy", "category": "Client Care", "required": True},
            {"key": "allergy_screening_form", "title": "Allergy & Sensitivity Screening Form", "type": "template", "category": "Client Care", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "general_hs_risk_assessment", "title": "General Health & Safety Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "infection_control_risk_assessment", "title": "Infection Control Risk Assessment", "type": "risk_assessment", "category": "Infection Control", "required": True},
            {"key": "lone_working_risk_assessment", "title": "Lone Working Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": False},
            {"key": "annual_policy_review", "title": "Annual Policy Review", "type": "audit", "category": "Compliance", "required": True},
            {"key": "hs_law_poster", "title": "Health & Safety Law Poster", "type": "poster", "category": "Mandatory Posters", "required": True},
            {"key": "insurance_certificate", "title": "Public Liability Insurance Certificate", "type": "operational", "category": "Insurance", "required": True},
            {"key": "local_authority_registration", "title": "Local Authority Registration", "type": "operational", "category": "Licensing", "required": True},
        ]
    },
    "piercing_studio": {
        "name": "Piercing Studio",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "infection_control_policy", "title": "Infection Prevention & Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "client_consent_form", "title": "Client Consultation & Consent Form", "type": "template", "category": "Client Care", "required": True},
            {"key": "parental_consent_form", "title": "Parental Consent Form (for minors)", "type": "template", "category": "Client Care", "required": True},
            {"key": "aftercare_instructions", "title": "Aftercare Instructions", "type": "template", "category": "Client Care", "required": True},
            {"key": "medical_questionnaire", "title": "Medical History Questionnaire", "type": "template", "category": "Client Care", "required": True},
            {"key": "coshh_assessment", "title": "COSHH Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "sharps_procedure", "title": "Sharps & Clinical Waste Procedure", "type": "procedure", "category": "Infection Control", "required": True},
            {"key": "sterilisation_records", "title": "Sterilisation Records & Autoclave Log", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "cleaning_checklist", "title": "Equipment Cleaning Checklist", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "gdpr_privacy_notice", "title": "Client Privacy Notice (GDPR)", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "staff_training_records", "title": "Staff Training Records", "type": "audit", "category": "Staff Management", "required": True},
            {"key": "accident_report_form", "title": "Accident & Incident Report Form", "type": "template", "category": "Health & Safety", "required": True},
            {"key": "age_verification_policy", "title": "Age Verification Policy", "type": "policy", "category": "Client Care", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "general_hs_risk_assessment", "title": "General Health & Safety Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
        ]
    },
    "microblading_pmu": {
        "name": "Microblading / PMU",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "infection_control_policy", "title": "Infection Prevention & Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "client_consent_form", "title": "Client Consultation & Consent Form", "type": "template", "category": "Client Care", "required": True},
            {"key": "patch_test_record", "title": "Patch Test Record & Policy", "type": "template", "category": "Client Care", "required": True},
            {"key": "contraindications_checklist", "title": "Contraindications Checklist", "type": "template", "category": "Client Care", "required": True},
            {"key": "aftercare_instructions", "title": "Aftercare Instructions", "type": "template", "category": "Client Care", "required": True},
            {"key": "medical_questionnaire", "title": "Medical History Questionnaire", "type": "template", "category": "Client Care", "required": True},
            {"key": "coshh_assessment", "title": "COSHH Assessment (Pigments, Numbing)", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "sharps_procedure", "title": "Sharps & Clinical Waste Procedure", "type": "procedure", "category": "Infection Control", "required": True},
            {"key": "sterilisation_records", "title": "Sterilisation Records", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "cleaning_checklist", "title": "Equipment Cleaning Checklist", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "gdpr_privacy_notice", "title": "Client Privacy Notice (GDPR)", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "photo_consent", "title": "Before & After Photo Consent", "type": "template", "category": "GDPR & Data Protection", "required": True},
            {"key": "colour_expectations_record", "title": "Colour Selection & Expectations Record", "type": "template", "category": "Client Care", "required": True},
            {"key": "touchup_policy", "title": "Touch-Up & Aftercare Policy", "type": "policy", "category": "Client Care", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "general_hs_risk_assessment", "title": "General Health & Safety Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
        ]
    },
    "aesthetics_clinic": {
        "name": "Aesthetics Clinic",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "infection_control_policy", "title": "Infection Prevention & Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "client_assessment_form", "title": "Client Consultation & Assessment Form", "type": "template", "category": "Client Care", "required": True},
            {"key": "treatment_consent_form", "title": "Treatment Consent Form", "type": "template", "category": "Client Care", "required": True},
            {"key": "medical_questionnaire", "title": "Medical History Questionnaire", "type": "template", "category": "Client Care", "required": True},
            {"key": "contraindications_checklist", "title": "Contraindications & Screening Checklist", "type": "template", "category": "Client Care", "required": True},
            {"key": "aftercare_instructions", "title": "Aftercare Instructions (per treatment)", "type": "template", "category": "Client Care", "required": True},
            {"key": "coshh_assessment", "title": "COSHH Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "sharps_procedure", "title": "Sharps & Clinical Waste Procedure", "type": "procedure", "category": "Infection Control", "required": True},
            {"key": "equipment_maintenance_log", "title": "Equipment Maintenance Log", "type": "audit", "category": "Equipment", "required": True},
            {"key": "product_batch_records", "title": "Product Batch & Traceability Records", "type": "audit", "category": "Equipment", "required": True},
            {"key": "gdpr_privacy_notice", "title": "Client Privacy Notice (GDPR)", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints & Complications Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "emergency_protocol", "title": "Emergency & Adverse Reaction Protocol", "type": "procedure", "category": "Health & Safety", "required": True},
            {"key": "photo_consent", "title": "Before & After Photo Consent", "type": "template", "category": "GDPR & Data Protection", "required": True},
            {"key": "cooling_off_policy", "title": "Cooling-Off Period Policy", "type": "policy", "category": "Client Care", "required": True},
            {"key": "staff_qualifications_records", "title": "Staff Qualifications & Insurance Records", "type": "audit", "category": "Staff Management", "required": True},
            {"key": "prescriber_documentation", "title": "Prescriber Arrangement Documentation", "type": "operational", "category": "Regulatory", "required": False},
            {"key": "clinical_procedures_risk_assessment", "title": "Clinical Procedures Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
        ]
    },
    "barber_hairdresser": {
        "name": "Barber / Hairdresser",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "hygiene_policy", "title": "Hygiene & Infection Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "client_consultation_card", "title": "Client Consultation Card", "type": "template", "category": "Client Care", "required": True},
            {"key": "allergy_test_record", "title": "Allergy Alert Test Record (colours)", "type": "template", "category": "Client Care", "required": True},
            {"key": "coshh_assessment", "title": "COSHH Assessment (Hair Products)", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "sharps_procedure", "title": "Sharps Procedure (razors)", "type": "procedure", "category": "Infection Control", "required": True},
            {"key": "cleaning_checklist", "title": "Equipment Cleaning & Sterilisation Checklist", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "gdpr_privacy_notice", "title": "Client Privacy Notice (GDPR)", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "staff_handbook", "title": "Staff Handbook", "type": "policy", "category": "Staff Management", "required": True},
            {"key": "accident_report_form", "title": "Accident & Incident Report Form", "type": "template", "category": "Health & Safety", "required": True},
            {"key": "first_aid_procedures", "title": "First Aid Procedures", "type": "procedure", "category": "Health & Safety", "required": True},
            {"key": "fire_safety_procedures", "title": "Fire Safety Procedures", "type": "procedure", "category": "Fire Safety", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "general_hs_risk_assessment", "title": "General Health & Safety Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
        ]
    },
    # Healthcare
    "dental": {
        "name": "Dental Practice",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "infection_control_policy", "title": "Infection Control Policy (Decontamination)", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "safeguarding_policy", "title": "Safeguarding Adults & Children Policy", "type": "policy", "category": "Safeguarding", "required": True},
            {"key": "gdpr_privacy_notice", "title": "GDPR Patient Privacy Notice", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Handling Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "sharps_protocol", "title": "Sharps & Needlestick Protocol", "type": "procedure", "category": "Infection Control", "required": True},
            {"key": "radiation_protection_policy", "title": "Radiation Protection Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "medical_emergency_procedures", "title": "Medical Emergency Procedures", "type": "procedure", "category": "Health & Safety", "required": True},
            {"key": "staff_induction_checklist", "title": "Staff Induction Checklist", "type": "template", "category": "Staff Management", "required": True},
            {"key": "cqc_statement_of_purpose", "title": "CQC Statement of Purpose", "type": "operational", "category": "Regulatory", "required": True},
            {"key": "clinical_risk_assessment", "title": "Clinical Risk Assessment", "type": "risk_assessment", "category": "Risk Assessments", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "coshh_assessment", "title": "COSHH Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
            {"key": "staff_handbook", "title": "Staff Handbook", "type": "policy", "category": "Staff Management", "required": True},
            {"key": "hs_law_poster", "title": "Health & Safety Law Poster", "type": "poster", "category": "Mandatory Posters", "required": True},
            {"key": "cqc_rating_display", "title": "CQC Registration Certificate Display", "type": "poster", "category": "Mandatory Posters", "required": True},
            {"key": "sterilisation_log", "title": "Sterilisation & Autoclave Log", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "waste_disposal_log", "title": "Clinical Waste Disposal Log", "type": "audit", "category": "Infection Control", "required": True},
            {"key": "annual_policy_review", "title": "Annual Policy Review", "type": "audit", "category": "Compliance", "required": True},
        ]
    },
    "healthcare": {
        "name": "Healthcare Provider",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "safeguarding_policy", "title": "Safeguarding Policy (Adults & Children)", "type": "policy", "category": "Safeguarding", "required": True},
            {"key": "infection_control_policy", "title": "Infection Prevention & Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "medicines_management_policy", "title": "Medicines Management Policy", "type": "policy", "category": "Medication", "required": True},
            {"key": "information_governance_policy", "title": "Information Governance Policy", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "clinical_risk_assessment", "title": "Clinical Risk Assessment", "type": "risk_assessment", "category": "Risk Assessments", "required": True},
            {"key": "consent_policy", "title": "Consent Policy", "type": "policy", "category": "Client Care", "required": True},
            {"key": "duty_of_candour_policy", "title": "Duty of Candour Policy", "type": "policy", "category": "Regulatory", "required": True},
            {"key": "staff_training_matrix", "title": "Staff Training Matrix", "type": "audit", "category": "Staff Management", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "cqc_statement_of_purpose", "title": "CQC Statement of Purpose", "type": "operational", "category": "Regulatory", "required": True},
        ]
    },
    "care_home": {
        "name": "Care Home",
        "items": [
            {"key": "safeguarding_adults_policy", "title": "Safeguarding Adults Policy", "type": "policy", "category": "Safeguarding", "required": True},
            {"key": "mental_capacity_policy", "title": "Mental Capacity & Best Interests Policy", "type": "policy", "category": "Regulatory", "required": True},
            {"key": "medication_administration_policy", "title": "Medication Administration Policy", "type": "policy", "category": "Medication", "required": True},
            {"key": "falls_prevention_policy", "title": "Falls Prevention Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "moving_handling_policy", "title": "Moving & Handling Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "infection_control_policy", "title": "Infection Control Policy", "type": "policy", "category": "Infection Control", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "care_plan_templates", "title": "Care Plan Templates", "type": "template", "category": "Client Care", "required": True},
            {"key": "staff_supervision_policy", "title": "Staff Supervision Policy", "type": "policy", "category": "Staff Management", "required": True},
            {"key": "resident_privacy_notice", "title": "Resident Privacy Notice", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "manual_handling_risk_assessment", "title": "Manual Handling Risk Assessment", "type": "risk_assessment", "category": "Health & Safety", "required": True},
        ]
    },
    # Default items for industries not specifically defined
    "_default": {
        "name": "Default",
        "items": [
            {"key": "health_safety_policy", "title": "Health & Safety Policy", "type": "policy", "category": "Health & Safety", "required": True},
            {"key": "gdpr_privacy_notice", "title": "Data Protection Policy", "type": "policy", "category": "GDPR & Data Protection", "required": True},
            {"key": "equality_diversity_policy", "title": "Equality & Diversity Policy", "type": "policy", "category": "Equality & Diversity", "required": True},
            {"key": "complaints_procedure", "title": "Complaints Procedure", "type": "procedure", "category": "Complaints", "required": True},
            {"key": "workplace_risk_assessment", "title": "Workplace Risk Assessment", "type": "risk_assessment", "category": "Risk Assessments", "required": True},
            {"key": "fire_risk_assessment", "title": "Fire Risk Assessment", "type": "risk_assessment", "category": "Fire Safety", "required": True},
            {"key": "staff_handbook", "title": "Employee Handbook", "type": "policy", "category": "Staff Management", "required": True},
            {"key": "hs_law_poster", "title": "Health & Safety Law Poster", "type": "poster", "category": "Mandatory Posters", "required": True},
            {"key": "accident_report_form", "title": "Accident Report Form", "type": "template", "category": "Health & Safety", "required": True},
            {"key": "annual_policy_review", "title": "Annual Policy Review", "type": "audit", "category": "Compliance", "required": True},
        ]
    }
}

def get_industry_compliance_items(industry_id: str) -> List[dict]:
    """Get compliance items for an industry, falling back to default"""
    industry_data = INDUSTRY_COMPLIANCE_MODEL.get(industry_id, INDUSTRY_COMPLIANCE_MODEL["_default"])
    return industry_data["items"]

async def generate_business_compliance_items(business_id: str, industry_id: str):
    """Generate compliance items for a business based on industry"""
    items = get_industry_compliance_items(industry_id)
    now = datetime.now(timezone.utc)
    
    for item in items:
        compliance_item = {
            "id": str(uuid.uuid4()),
            "business_id": business_id,
            "industry_id": industry_id,
            "item_type": item["type"],
            "item_key": item["key"],
            "title": item["title"],
            "description": item.get("description", ""),
            "category": item["category"],
            "is_required": item["required"],
            "status": "missing",
            "is_acknowledged": False,
            "acknowledged_at": None,
            "is_customised": False,
            "custom_content": None,
            "file_url": None,
            "file_name": None,
            "version": "1.0",
            "last_reviewed": None,
            "next_review_due": (now + timedelta(days=365)).isoformat(),
            "notes": None,
            "created_at": now.isoformat(),
            "updated_at": None,
            "contributes_to_score": item["required"]
        }
        await db.compliance_items.insert_one(compliance_item)

async def calculate_compliance_score(business_id: str) -> dict:
    """Calculate compliance readiness score for a business"""
    business = await db.businesses.find_one({"id": business_id}, {"_id": 0})
    if not business:
        return None
    
    industry_id = business.get("sector", "_default")
    
    items = await db.compliance_items.find({"business_id": business_id}, {"_id": 0}).to_list(500)
    
    now = datetime.now(timezone.utc)
    
    # Count required items only for score
    required_items = [i for i in items if i.get("is_required", True)]
    required_total = len(required_items)
    
    completed_statuses = ["uploaded", "acknowledged", "approved"]
    completed_items = [i for i in required_items if i["status"] in completed_statuses]
    completed_total = len(completed_items)
    
    missing_count = sum(1 for i in required_items if i["status"] == "missing")
    overdue_count = 0
    needs_review_count = 0
    
    # Check for overdue reviews
    for item in required_items:
        if item.get("next_review_due"):
            try:
                review_date = datetime.fromisoformat(item["next_review_due"].replace('Z', '+00:00'))
                if review_date < now:
                    overdue_count += 1
                elif (review_date - now).days <= 30:
                    needs_review_count += 1
            except:
                pass
        if item["status"] == "needs_review":
            needs_review_count += 1
    
    # Calculate percentage
    score_percent = round((completed_total / required_total * 100) if required_total > 0 else 0)
    
    # Determine status label
    if overdue_count > 0:
        status_label = "overdue"
    elif missing_count > required_total * 0.3 or score_percent < 50:
        status_label = "needs_attention"
    else:
        status_label = "on_track"
    
    # Calculate breakdown by category
    categories = {}
    for item in items:
        cat = item["category"]
        if cat not in categories:
            categories[cat] = {"total": 0, "completed": 0, "required_total": 0, "required_completed": 0}
        categories[cat]["total"] += 1
        if item["status"] in completed_statuses:
            categories[cat]["completed"] += 1
        if item.get("is_required"):
            categories[cat]["required_total"] += 1
            if item["status"] in completed_statuses:
                categories[cat]["required_completed"] += 1
    
    # Find next review due
    next_review_due = None
    for item in items:
        if item.get("next_review_due") and item["status"] in completed_statuses:
            if not next_review_due or item["next_review_due"] < next_review_due:
                next_review_due = item["next_review_due"]
    
    score_data = {
        "business_id": business_id,
        "industry_id": industry_id,
        "score_percent": score_percent,
        "required_total": required_total,
        "completed_total": completed_total,
        "missing_count": missing_count,
        "overdue_count": overdue_count,
        "needs_review_count": needs_review_count,
        "status_label": status_label,
        "last_calculated_at": now.isoformat(),
        "next_review_due_at": next_review_due,
        "breakdown": categories
    }
    
    # Cache the score
    await db.compliance_scores.update_one(
        {"business_id": business_id},
        {"$set": score_data},
        upsert=True
    )
    
    return score_data

# ======================= COMPLIANCE SCORE API ROUTES =======================

@api_router.get("/compliance/score", response_model=ComplianceScoreResponse)
async def get_compliance_score(current_user: dict = Depends(get_current_user)):
    """Get compliance readiness score for current business"""
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found. Please complete onboarding.")
    
    # Check if compliance items exist, if not generate them
    items_count = await db.compliance_items.count_documents({"business_id": business["id"]})
    if items_count == 0:
        await generate_business_compliance_items(business["id"], business.get("sector", "_default"))
    
    score = await calculate_compliance_score(business["id"])
    return ComplianceScoreResponse(**score)

@api_router.get("/compliance/items", response_model=List[ComplianceItemResponse])
async def get_compliance_items(
    category: Optional[str] = None,
    item_type: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all compliance items for the current business"""
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found. Please complete onboarding.")
    
    # Check if compliance items exist, if not generate them
    items_count = await db.compliance_items.count_documents({"business_id": business["id"]})
    if items_count == 0:
        await generate_business_compliance_items(business["id"], business.get("sector", "_default"))
    
    # Build query
    query = {"business_id": business["id"]}
    if category:
        query["category"] = category
    if item_type:
        query["item_type"] = item_type
    if status:
        query["status"] = status
    
    items = await db.compliance_items.find(query, {"_id": 0}).to_list(500)
    return [ComplianceItemResponse(**item) for item in items]

@api_router.get("/compliance/items/{item_id}", response_model=ComplianceItemResponse)
async def get_compliance_item(item_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single compliance item"""
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    item = await db.compliance_items.find_one({"id": item_id, "business_id": business["id"]}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Compliance item not found")
    
    return ComplianceItemResponse(**item)

@api_router.put("/compliance/items/{item_id}", response_model=ComplianceItemResponse)
async def update_compliance_item(
    item_id: str,
    update_data: ComplianceItemUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a compliance item (acknowledge, upload, customise)"""
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    item = await db.compliance_items.find_one({"id": item_id, "business_id": business["id"]})
    if not item:
        raise HTTPException(status_code=404, detail="Compliance item not found")
    
    now = datetime.now(timezone.utc)
    updates = {"updated_at": now.isoformat()}
    
    # Handle acknowledgement
    if update_data.is_acknowledged is not None:
        updates["is_acknowledged"] = update_data.is_acknowledged
        if update_data.is_acknowledged:
            updates["acknowledged_at"] = now.isoformat()
            if item["status"] == "missing":
                updates["status"] = "acknowledged"
                updates["last_reviewed"] = now.isoformat()
                updates["next_review_due"] = (now + timedelta(days=365)).isoformat()
    
    # Handle customisation
    if update_data.is_customised is not None:
        updates["is_customised"] = update_data.is_customised
    if update_data.custom_content is not None:
        updates["custom_content"] = update_data.custom_content
        updates["is_customised"] = True
        if item["status"] in ["missing", "draft"]:
            updates["status"] = "draft"
    
    # Handle file upload
    if update_data.file_url is not None:
        updates["file_url"] = update_data.file_url
        updates["file_name"] = update_data.file_name
        updates["status"] = "uploaded"
        updates["last_reviewed"] = now.isoformat()
        updates["next_review_due"] = (now + timedelta(days=365)).isoformat()
    
    # Handle direct status update
    if update_data.status is not None:
        updates["status"] = update_data.status
        if update_data.status in ["uploaded", "acknowledged", "approved"]:
            updates["last_reviewed"] = now.isoformat()
            updates["next_review_due"] = (now + timedelta(days=365)).isoformat()
    
    if update_data.notes is not None:
        updates["notes"] = update_data.notes
    
    await db.compliance_items.update_one({"id": item_id}, {"$set": updates})
    
    # Recalculate score after update
    await calculate_compliance_score(business["id"])
    
    # Create notification for completion
    if updates.get("status") in ["uploaded", "acknowledged", "approved"]:
        notification = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "title": "Compliance Item Updated",
            "message": f"'{item['title']}' has been marked as {updates['status']}.",
            "type": "success",
            "is_read": False,
            "created_at": now.isoformat()
        }
        await db.notifications.insert_one(notification)
    
    updated = await db.compliance_items.find_one({"id": item_id}, {"_id": 0})
    return ComplianceItemResponse(**updated)

@api_router.post("/compliance/items/{item_id}/acknowledge")
async def acknowledge_compliance_item(item_id: str, current_user: dict = Depends(get_current_user)):
    """Quick acknowledge endpoint for a compliance item"""
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    item = await db.compliance_items.find_one({"id": item_id, "business_id": business["id"]})
    if not item:
        raise HTTPException(status_code=404, detail="Compliance item not found")
    
    now = datetime.now(timezone.utc)
    await db.compliance_items.update_one(
        {"id": item_id},
        {"$set": {
            "is_acknowledged": True,
            "acknowledged_at": now.isoformat(),
            "status": "acknowledged",
            "last_reviewed": now.isoformat(),
            "next_review_due": (now + timedelta(days=365)).isoformat(),
            "updated_at": now.isoformat()
        }}
    )
    
    # Recalculate score
    await calculate_compliance_score(business["id"])
    
    return {"message": "Item acknowledged", "item_id": item_id}

@api_router.get("/compliance/categories")
async def get_compliance_categories(current_user: dict = Depends(get_current_user)):
    """Get list of compliance categories for the business"""
    business = await db.businesses.find_one({"user_id": current_user["id"]}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    items = await db.compliance_items.find({"business_id": business["id"]}, {"category": 1, "_id": 0}).to_list(500)
    categories = list(set(item["category"] for item in items))
    return sorted(categories)

@api_router.get("/compliance/types")
async def get_compliance_types(current_user: dict = Depends(get_current_user)):
    """Get list of compliance item types"""
    return [
        {"id": "policy", "name": "Policy"},
        {"id": "procedure", "name": "Procedure"},
        {"id": "risk_assessment", "name": "Risk Assessment"},
        {"id": "audit", "name": "Audit / Check"},
        {"id": "poster", "name": "Poster / Notice"},
        {"id": "template", "name": "Template / Form"},
        {"id": "operational", "name": "Operational Requirement"}
    ]

# ======================= ADMIN ROUTES =======================

async def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@api_router.get("/admin/users")
async def admin_get_users(admin: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users

@api_router.get("/admin/businesses")
async def admin_get_businesses(admin: dict = Depends(require_admin)):
    businesses = await db.businesses.find({}, {"_id": 0}).to_list(1000)
    return businesses

@api_router.get("/admin/stats")
async def admin_get_stats(admin: dict = Depends(require_admin)):
    total_users = await db.users.count_documents({})
    total_businesses = await db.businesses.count_documents({})
    active_subscriptions = await db.businesses.count_documents({"subscription_status": "active"})
    total_transactions = await db.payment_transactions.count_documents({})
    paid_transactions = await db.payment_transactions.count_documents({"payment_status": "paid"})
    
    return {
        "total_users": total_users,
        "total_businesses": total_businesses,
        "active_subscriptions": active_subscriptions,
        "total_transactions": total_transactions,
        "paid_transactions": paid_transactions
    }

# ======================= ROOT ROUTE =======================

@api_router.get("/")
async def root():
    return {"message": "SimplyComply API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
