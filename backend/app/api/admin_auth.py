import os
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext

admin_auth_router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD_HASH = os.environ["ADMIN_PASSWORD_HASH"]


def create_token(email: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(hours=24)
    return jwt.encode({"sub": email, "exp": exp}, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def require_admin(token: str = Depends(oauth2)) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        if payload.get("sub") != ADMIN_EMAIL:
            raise HTTPException(status_code=401, detail="Not authorized")
        return ADMIN_EMAIL
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@admin_auth_router.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    if form.username != ADMIN_EMAIL or not pwd.verify(form.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": create_token(ADMIN_EMAIL), "token_type": "bearer"}


@admin_auth_router.get("/me")
def me(_: str = Depends(require_admin)):
    return {"ok": True}
