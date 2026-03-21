from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class ScanBase(BaseModel):
    type: str
    target: str

class ScanCreate(ScanBase):
    pass

class Scan(ScanBase):
    id: int
    result: str
    confidence: float
    explanation: str
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    scans: List[Scan] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ScanRequest(BaseModel):
    url: Optional[str] = None
    email_text: Optional[str] = None
    deep_scan: Optional[bool] = True

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str
