import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

from app.api.admin_auth import create_token

admin_router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD_HASH = os.environ["ADMIN_PASSWORD_HASH"]

@admin_router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    if form.username != ADMIN_EMAIL or not pwd.verify(form.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token(ADMIN_EMAIL), "token_type": "bearer"}

@admin_router.get("/me")
def me():
    return {"ok": True}

# include documents router at the very bottom
from app.api.admin_documents import router as admin_docs_router
admin_router.include_router(admin_docs_router)
