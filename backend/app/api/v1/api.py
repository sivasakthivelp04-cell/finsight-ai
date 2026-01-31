from fastapi import APIRouter
from app.api.v1.endpoints import financial, company, auth

api_router = APIRouter()
api_router.include_router(financial.router, prefix="/financial", tags=["financial"])
api_router.include_router(company.router, prefix="/company", tags=["company"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

