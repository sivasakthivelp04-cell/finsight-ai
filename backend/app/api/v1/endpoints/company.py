
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.database import Company
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse

router = APIRouter()

# Demo company ID
DEMO_COMPANY_ID = 1

@router.get("/", response_model=CompanyResponse)
async def get_company_settings(
    id: int = DEMO_COMPANY_ID,
    db: Session = Depends(get_db)
):
    """
    Get company settings/details.
    """
    company = db.query(Company).filter(Company.id == id).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return company

@router.put("/", response_model=CompanyResponse)
async def update_company_settings(
    company_update: CompanyUpdate,
    id: int = DEMO_COMPANY_ID,
    db: Session = Depends(get_db)
):
    """
    Update company settings/details.
    """
    company = db.query(Company).filter(Company.id == id).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Update fields
    update_data = company_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)
    
    db.commit()
    db.refresh(company)
    
    return company
