from typing import Optional
from fastapi import Header, HTTPException
import os
import jwt

# ✅ Import db from server (this is safe because server will NOT import this file at top-level anymore)
from app.core.db import db

JWT_SECRET = os.environ.get("JWT_SECRET_KEY", "simplycomply_secret")
JWT_ALGORITHM = "HS256"


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
