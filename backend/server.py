from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
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
    size: str  # small, medium, large
    uk_nation: str  # England, Scotland, Wales, Northern Ireland
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
    status: str  # complete, needs_review, not_started
    last_reviewed: Optional[str]
    next_review_due: Optional[str]

class NotificationResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    message: str
    type: str  # info, warning, reminder
    is_read: bool
    created_at: str

class CheckoutRequest(BaseModel):
    plan: str  # monthly or annual
    origin_url: str

class SubscriptionPlans(BaseModel):
    model_config = ConfigDict(extra="ignore")
    plan_id: str
    name: str
    price: float
    currency: str
    interval: str

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

# ======================= SUBSCRIPTION PLANS =======================

SUBSCRIPTION_PLANS = {
    "monthly": {"name": "Monthly Plan", "price": 29.00, "currency": "gbp", "interval": "month"},
    "annual": {"name": "Annual Plan", "price": 290.00, "currency": "gbp", "interval": "year"}
}

# ======================= UK SECTORS & COMPLIANCE DATA =======================

UK_SECTORS = [
    {"id": "dental", "name": "Dental Practice", "industry": "Healthcare"},
    {"id": "healthcare", "name": "Healthcare Provider", "industry": "Healthcare"},
    {"id": "care_home", "name": "Care Home", "industry": "Healthcare"},
    {"id": "construction", "name": "Construction", "industry": "Construction"},
    {"id": "hospitality", "name": "Hospitality", "industry": "Hospitality"},
    {"id": "retail", "name": "Retail", "industry": "Retail"},
    {"id": "education", "name": "Education", "industry": "Education"},
    {"id": "office", "name": "Office/Professional Services", "industry": "Professional Services"}
]

UK_NATIONS = ["England", "Scotland", "Wales", "Northern Ireland"]

BUSINESS_SIZES = [
    {"id": "micro", "name": "Micro (1-9 employees)"},
    {"id": "small", "name": "Small (10-49 employees)"},
    {"id": "medium", "name": "Medium (50-249 employees)"},
    {"id": "large", "name": "Large (250+ employees)"}
]

# Compliance document categories
COMPLIANCE_CATEGORIES = [
    "Health & Safety",
    "GDPR & Data Protection",
    "Equality & Diversity",
    "Safeguarding",
    "Complaints Procedures",
    "Risk Assessments",
    "Staff Handbook",
    "Mandatory Posters",
    "Regulatory Guidance"
]

# Sample compliance documents per sector
COMPLIANCE_DOCUMENTS = {
    "dental": [
        {"id": "dental_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Comprehensive health and safety policy for dental practices", "is_mandatory": True, "version": "2.1"},
        {"id": "dental_gdpr_001", "title": "GDPR Patient Data Policy", "category": "GDPR & Data Protection", "description": "Data protection policy compliant with UK GDPR for patient records", "is_mandatory": True, "version": "3.0"},
        {"id": "dental_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Equal opportunities policy for dental practices", "is_mandatory": True, "version": "1.5"},
        {"id": "dental_sg_001", "title": "Safeguarding Policy", "category": "Safeguarding", "description": "Child and vulnerable adult safeguarding procedures", "is_mandatory": True, "version": "2.0"},
        {"id": "dental_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Patient complaints handling procedure", "is_mandatory": True, "version": "1.8"},
        {"id": "dental_ra_001", "title": "Clinical Risk Assessment", "category": "Risk Assessments", "description": "Risk assessment template for dental procedures", "is_mandatory": True, "version": "2.2"},
        {"id": "dental_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Employee handbook for dental practice staff", "is_mandatory": True, "version": "4.0"},
        {"id": "dental_mp_001", "title": "CQC Registration Poster", "category": "Mandatory Posters", "description": "CQC registration display requirements", "is_mandatory": True, "version": "1.0"},
        {"id": "dental_rg_001", "title": "CQC Compliance Guide", "category": "Regulatory Guidance", "description": "Guide to CQC fundamental standards for dental", "is_mandatory": False, "version": "2.5"},
        {"id": "dental_ra_002", "title": "Infection Control Risk Assessment", "category": "Risk Assessments", "description": "HTM 01-05 compliant infection control assessment", "is_mandatory": True, "version": "3.1"},
    ],
    "healthcare": [
        {"id": "health_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "NHS compliant health and safety policy", "is_mandatory": True, "version": "3.0"},
        {"id": "health_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "UK GDPR compliant data protection policy", "is_mandatory": True, "version": "2.5"},
        {"id": "health_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "NHS equality framework compliant policy", "is_mandatory": True, "version": "2.0"},
        {"id": "health_sg_001", "title": "Safeguarding Policy", "category": "Safeguarding", "description": "Adult and child safeguarding procedures", "is_mandatory": True, "version": "3.0"},
        {"id": "health_cp_001", "title": "Complaints Policy", "category": "Complaints Procedures", "description": "NHS complaints procedure template", "is_mandatory": True, "version": "2.2"},
        {"id": "health_ra_001", "title": "Clinical Risk Assessment", "category": "Risk Assessments", "description": "Healthcare risk assessment framework", "is_mandatory": True, "version": "2.8"},
        {"id": "health_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Healthcare worker handbook", "is_mandatory": True, "version": "4.5"},
        {"id": "health_mp_001", "title": "Health & Safety Law Poster", "category": "Mandatory Posters", "description": "HSE approved poster", "is_mandatory": True, "version": "1.0"},
        {"id": "health_rg_001", "title": "CQC Compliance Guide", "category": "Regulatory Guidance", "description": "Complete CQC compliance guidance", "is_mandatory": False, "version": "3.0"},
    ],
    "care_home": [
        {"id": "care_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Care home health and safety policy", "is_mandatory": True, "version": "2.5"},
        {"id": "care_gdpr_001", "title": "Resident Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for resident information", "is_mandatory": True, "version": "2.0"},
        {"id": "care_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Care sector equality policy", "is_mandatory": True, "version": "1.8"},
        {"id": "care_sg_001", "title": "Safeguarding Adults Policy", "category": "Safeguarding", "description": "Adult safeguarding and protection procedures", "is_mandatory": True, "version": "3.5"},
        {"id": "care_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Resident and family complaints handling", "is_mandatory": True, "version": "2.0"},
        {"id": "care_ra_001", "title": "Moving & Handling Risk Assessment", "category": "Risk Assessments", "description": "Manual handling risk assessment template", "is_mandatory": True, "version": "2.2"},
        {"id": "care_sh_001", "title": "Care Worker Handbook", "category": "Staff Handbook", "description": "Staff handbook for care workers", "is_mandatory": True, "version": "3.5"},
        {"id": "care_mp_001", "title": "CQC Rating Display", "category": "Mandatory Posters", "description": "CQC rating display requirements", "is_mandatory": True, "version": "1.0"},
        {"id": "care_rg_001", "title": "CQC Key Lines of Enquiry", "category": "Regulatory Guidance", "description": "CQC inspection framework guide", "is_mandatory": False, "version": "2.8"},
    ],
    "construction": [
        {"id": "const_hs_001", "title": "Construction Health & Safety Policy", "category": "Health & Safety", "description": "CDM 2015 compliant H&S policy", "is_mandatory": True, "version": "3.2"},
        {"id": "const_gdpr_001", "title": "Employee Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for construction businesses", "is_mandatory": True, "version": "1.5"},
        {"id": "const_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Construction industry equality policy", "is_mandatory": True, "version": "1.8"},
        {"id": "const_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client complaints handling procedure", "is_mandatory": True, "version": "1.5"},
        {"id": "const_ra_001", "title": "Site Risk Assessment", "category": "Risk Assessments", "description": "Construction site risk assessment template", "is_mandatory": True, "version": "4.0"},
        {"id": "const_ra_002", "title": "COSHH Assessment", "category": "Risk Assessments", "description": "Hazardous substances assessment", "is_mandatory": True, "version": "2.5"},
        {"id": "const_sh_001", "title": "Site Worker Handbook", "category": "Staff Handbook", "description": "Construction worker safety handbook", "is_mandatory": True, "version": "3.0"},
        {"id": "const_mp_001", "title": "HSE Construction Poster", "category": "Mandatory Posters", "description": "Health and safety law poster for sites", "is_mandatory": True, "version": "1.0"},
        {"id": "const_rg_001", "title": "HSE CDM Guide", "category": "Regulatory Guidance", "description": "HSE CDM 2015 compliance guide", "is_mandatory": False, "version": "2.0"},
    ],
    "hospitality": [
        {"id": "hosp_hs_001", "title": "Health & Safety Policy", "category": "Health & Safety", "description": "Hospitality sector H&S policy", "is_mandatory": True, "version": "2.8"},
        {"id": "hosp_gdpr_001", "title": "Customer Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for guest data", "is_mandatory": True, "version": "2.0"},
        {"id": "hosp_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Hospitality equality and inclusion policy", "is_mandatory": True, "version": "1.5"},
        {"id": "hosp_cp_001", "title": "Guest Complaints Procedure", "category": "Complaints Procedures", "description": "Guest complaints handling procedure", "is_mandatory": True, "version": "2.2"},
        {"id": "hosp_ra_001", "title": "Food Safety Risk Assessment", "category": "Risk Assessments", "description": "HACCP compliant food safety assessment", "is_mandatory": True, "version": "3.5"},
        {"id": "hosp_ra_002", "title": "Fire Risk Assessment", "category": "Risk Assessments", "description": "Fire safety risk assessment template", "is_mandatory": True, "version": "2.0"},
        {"id": "hosp_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Hospitality staff handbook", "is_mandatory": True, "version": "3.2"},
        {"id": "hosp_mp_001", "title": "Food Hygiene Rating", "category": "Mandatory Posters", "description": "Food hygiene rating display requirements", "is_mandatory": True, "version": "1.0"},
        {"id": "hosp_rg_001", "title": "Environmental Health Guide", "category": "Regulatory Guidance", "description": "EHO inspection preparation guide", "is_mandatory": False, "version": "2.5"},
    ],
    "retail": [
        {"id": "ret_hs_001", "title": "Retail Health & Safety Policy", "category": "Health & Safety", "description": "Retail sector H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "ret_gdpr_001", "title": "Customer Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for retail customer data", "is_mandatory": True, "version": "2.2"},
        {"id": "ret_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Retail equality policy", "is_mandatory": True, "version": "1.8"},
        {"id": "ret_cp_001", "title": "Customer Complaints Policy", "category": "Complaints Procedures", "description": "Customer complaints handling procedure", "is_mandatory": True, "version": "2.0"},
        {"id": "ret_ra_001", "title": "Store Risk Assessment", "category": "Risk Assessments", "description": "Retail store risk assessment template", "is_mandatory": True, "version": "2.5"},
        {"id": "ret_sh_001", "title": "Retail Staff Handbook", "category": "Staff Handbook", "description": "Employee handbook for retail staff", "is_mandatory": True, "version": "3.0"},
        {"id": "ret_mp_001", "title": "Consumer Rights Poster", "category": "Mandatory Posters", "description": "Consumer rights display requirements", "is_mandatory": True, "version": "1.0"},
        {"id": "ret_rg_001", "title": "Trading Standards Guide", "category": "Regulatory Guidance", "description": "Trading standards compliance guide", "is_mandatory": False, "version": "2.0"},
    ],
    "education": [
        {"id": "edu_hs_001", "title": "Education Health & Safety Policy", "category": "Health & Safety", "description": "School/college H&S policy", "is_mandatory": True, "version": "3.0"},
        {"id": "edu_gdpr_001", "title": "Student Data Protection Policy", "category": "GDPR & Data Protection", "description": "GDPR policy for student records", "is_mandatory": True, "version": "2.5"},
        {"id": "edu_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Education sector equality policy", "is_mandatory": True, "version": "2.0"},
        {"id": "edu_sg_001", "title": "Child Safeguarding Policy", "category": "Safeguarding", "description": "Keeping Children Safe in Education compliant", "is_mandatory": True, "version": "4.0"},
        {"id": "edu_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Parent/student complaints procedure", "is_mandatory": True, "version": "2.2"},
        {"id": "edu_ra_001", "title": "Educational Trip Risk Assessment", "category": "Risk Assessments", "description": "School trip risk assessment template", "is_mandatory": True, "version": "2.8"},
        {"id": "edu_sh_001", "title": "Staff Handbook", "category": "Staff Handbook", "description": "Teaching staff handbook", "is_mandatory": True, "version": "3.5"},
        {"id": "edu_mp_001", "title": "Ofsted Rating Display", "category": "Mandatory Posters", "description": "Ofsted rating display requirements", "is_mandatory": True, "version": "1.0"},
        {"id": "edu_rg_001", "title": "Ofsted Framework Guide", "category": "Regulatory Guidance", "description": "Ofsted inspection framework guide", "is_mandatory": False, "version": "3.0"},
    ],
    "office": [
        {"id": "off_hs_001", "title": "Office Health & Safety Policy", "category": "Health & Safety", "description": "Office/professional services H&S policy", "is_mandatory": True, "version": "2.5"},
        {"id": "off_gdpr_001", "title": "Data Protection Policy", "category": "GDPR & Data Protection", "description": "UK GDPR policy for professional services", "is_mandatory": True, "version": "2.8"},
        {"id": "off_eq_001", "title": "Equality & Diversity Policy", "category": "Equality & Diversity", "description": "Office equality and inclusion policy", "is_mandatory": True, "version": "2.0"},
        {"id": "off_cp_001", "title": "Complaints Procedure", "category": "Complaints Procedures", "description": "Client complaints handling procedure", "is_mandatory": True, "version": "1.8"},
        {"id": "off_ra_001", "title": "DSE Risk Assessment", "category": "Risk Assessments", "description": "Display screen equipment assessment", "is_mandatory": True, "version": "2.2"},
        {"id": "off_ra_002", "title": "Office Fire Risk Assessment", "category": "Risk Assessments", "description": "Fire safety risk assessment for offices", "is_mandatory": True, "version": "2.0"},
        {"id": "off_sh_001", "title": "Employee Handbook", "category": "Staff Handbook", "description": "Professional services staff handbook", "is_mandatory": True, "version": "3.5"},
        {"id": "off_mp_001", "title": "Health & Safety Law Poster", "category": "Mandatory Posters", "description": "HSE approved office poster", "is_mandatory": True, "version": "1.0"},
        {"id": "off_rg_001", "title": "ICO GDPR Guide", "category": "Regulatory Guidance", "description": "ICO UK GDPR compliance guide", "is_mandatory": False, "version": "2.5"},
    ]
}

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
    
    # Generate compliance checklist for this business
    await generate_compliance_checklist(business_id, business_data.sector)
    
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
    
    # If sector changed, regenerate checklist
    if business["sector"] != business_data.sector:
        await db.checklists.delete_many({"business_id": business["id"]})
        await generate_compliance_checklist(business["id"], business_data.sector)
    
    await db.businesses.update_one({"id": business["id"]}, {"$set": update_data})
    updated = await db.businesses.find_one({"id": business["id"]}, {"_id": 0})
    return BusinessResponse(**updated)

# ======================= COMPLIANCE CHECKLIST ROUTES =======================

async def generate_compliance_checklist(business_id: str, sector: str):
    documents = COMPLIANCE_DOCUMENTS.get(sector, [])
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
    documents = COMPLIANCE_DOCUMENTS.get(sector, [])
    
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
    documents = COMPLIANCE_DOCUMENTS.get(sector, [])
    
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
    
    # Create payment transaction record
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
    
    # Update transaction status
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    
    if transaction and transaction["payment_status"] != "paid" and status.payment_status == "paid":
        # Update transaction
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid", "completed_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        # Activate subscription
        plan = transaction.get("plan", "monthly")
        await db.businesses.update_one(
            {"user_id": current_user["id"]},
            {"$set": {"subscription_status": "active", "subscription_plan": plan}}
        )
        
        # Create notification
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
            "upcoming_reviews": []
        }
    
    checklist_items = await db.checklists.find({"business_id": business["id"]}, {"_id": 0}).to_list(1000)
    
    total = len(checklist_items)
    completed = sum(1 for item in checklist_items if item["status"] == "complete")
    needs_review = sum(1 for item in checklist_items if item["status"] == "needs_review")
    not_started = sum(1 for item in checklist_items if item["status"] == "not_started")
    
    # Get upcoming reviews (within next 30 days)
    now = datetime.now(timezone.utc)
    thirty_days = now + timedelta(days=30)
    upcoming = []
    
    for item in checklist_items:
        if item.get("next_review_due"):
            review_date = datetime.fromisoformat(item["next_review_due"].replace('Z', '+00:00'))
            if now <= review_date <= thirty_days:
                upcoming.append({
                    "id": item["id"],
                    "title": item["title"],
                    "due_date": item["next_review_due"]
                })
    
    return {
        "has_business": True,
        "business": business,
        "total_documents": total,
        "completed": completed,
        "needs_review": needs_review,
        "not_started": not_started,
        "completion_percentage": round((completed / total * 100) if total > 0 else 0),
        "upcoming_reviews": sorted(upcoming, key=lambda x: x["due_date"])[:5]
    }

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
