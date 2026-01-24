from fastapi import APIRouter, Depends
from app.dependencies.admin import require_admin

router = APIRouter()

@router.get("/health")
def admin_health(current_user=Depends(require_admin)):
    return {
        "ok": True,
        "email": current_user.get("email"),
        "role": current_user.get("role"),
    }
