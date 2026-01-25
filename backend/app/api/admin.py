import os
import uuid
from datetime import datetime, timezone

import boto3
from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.db import db              # adjust if your db import differs
from app.api.admin import require_admin # this imports your guard from admin.py

router = APIRouter()

S3_BUCKET = os.environ["S3_BUCKET"]
S3_ENDPOINT_URL = os.environ.get("S3_ENDPOINT_URL")  # required for R2, optional for AWS
S3_REGION = os.environ.get("S3_REGION", "auto")

s3 = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT_URL,
    region_name=S3_REGION,
    aws_access_key_id=os.environ.get("S3_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("S3_SECRET_ACCESS_KEY"),
)

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # docx
    "text/plain",
}
MAX_BYTES = 20 * 1024 * 1024  # 20MB


@router.post("/documents")
async def upload_document(
    title: str = Form(...),
    file: UploadFile = File(...),
    _: str = Depends(require_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")

    ext = (file.filename or "").split(".")[-1].lower()
    key = f"private-documents/{uuid.uuid4().hex}.{ext if ext else 'bin'}"

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=key,
        Body=data,
        ContentType=file.content_type or "application/octet-stream",
    )

    doc = {
        "title": title,
        "key": key,
        "content_type": file.content_type,
        "size": len(data),
        "created_at": datetime.now(timezone.utc),
    }

    res = await db.documents.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return doc


@router.get("/documents")
async def list_documents(_: str = Depends(require_admin)):
    items = []
    async for d in db.documents.find({}).sort("created_at", -1):
        d["_id"] = str(d["_id"])
        items.append(d)
    return items


@router.get("/documents/{doc_id}/download")
async def get_download_url(doc_id: str, _: str = Depends(require_admin)):
    doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")

    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": S3_BUCKET, "Key": doc["key"]},
        ExpiresIn=300,  # 5 minutes
    )
    return {"url": url}


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str, _: str = Depends(require_admin)):
    doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")

    s3.delete_object(Bucket=S3_BUCKET, Key=doc["key"])
    await db.documents.delete_one({"_id": ObjectId(doc_id)})
    return {"ok": True}
