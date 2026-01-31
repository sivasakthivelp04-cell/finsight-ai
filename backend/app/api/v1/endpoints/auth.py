from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.database import Company
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.core.security import verify_password, get_password_hash

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.email == login_data.email).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found. Please register."
        )
    
    if not company.password_hash:
         # For old demo accounts or partial setup, we might want to allow update or block
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account setup incomplete (no password). Please register again."
        )

    if not verify_password(login_data.password, company.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    return {
        "access_token": "fake-jwt-token",
        "token_type": "bearer",
        "company_id": company.id,
        "company_name": company.name,
        "email": company.email
    }

@router.post("/register", response_model=Token)
async def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    existing_company = db.query(Company).filter(Company.email == register_data.email).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(register_data.password)
    
    new_company = Company(
        name=register_data.name,
        email=register_data.email,
        password_hash=hashed_password,
        phone=register_data.phone,
        address=register_data.address,
        industry=register_data.industry,
        tax_id=register_data.tax_id
    )
    
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return {
        "access_token": "fake-jwt-token-registered",
        "token_type": "bearer",
        "company_id": new_company.id,
        "company_name": new_company.name,
        "email": new_company.email
    }

import secrets
import string

@router.post("/forgot-password")
async def forgot_password(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    company = db.query(Company).filter(Company.email == email).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Account not found. Please enter a registered email or register first."
        )
    
    # Generate new random password
    new_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for i in range(10))
    hashed_password = get_password_hash(new_password)
    
    company.password_hash = hashed_password
    db.commit()
    
    from app.services.email_service import email_service
    
    subject = "Your New FinSight AI Password"
    body = f"Hello {company.name},\n\nYour new password is: {new_password}\n\nPlease log in and change your password in settings.\n\nBest regards,\nFinSight AI Team"
    
    try:
        email_service.send_email(email, subject, body)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send email. Password was updated but could not be sent.")
    
    return {"message": "A new password has been generated and sent to your registered email address."}
