from fastapi import Depends, HTTPException

# ✅ In your project, get_current_user is defined in backend/server.py
from server import get_current_user


async def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    role = current_user.get("role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
