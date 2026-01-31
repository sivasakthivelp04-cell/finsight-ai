from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None
    industry: Optional[str] = None
    tax_id: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    company_id: int
    company_name: str
    email: str
