import os
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2 = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]

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
