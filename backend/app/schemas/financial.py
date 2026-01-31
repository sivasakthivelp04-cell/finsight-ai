
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class FinancialDataUpload(BaseModel):
    data: Dict[str, Any]
    industry: Optional[str] = "General"
    language: Optional[str] = "en"

class AIRecommendation(BaseModel):
    action: str
    impact: str
    category: Optional[str] = None

class AIRisk(BaseModel):
    type: str
    severity: str
    message: str

class AIAnalysisResult(BaseModel):
    health_score: int
    status: str
    summary: str
    risks: List[AIRisk]
    recommendations: List[AIRecommendation]
    forecast_narrative: str
    working_capital_analysis: Optional[Dict[str, str]] = None
    creditworthiness_score: Optional[int] = None
