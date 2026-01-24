# backend/app/core/db.py

import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.environ["MONGO_URL"]

client = AsyncIOMotorClient(MONGO_URL)
db = client.get_default_database()
