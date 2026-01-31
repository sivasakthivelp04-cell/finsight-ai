import json
import random
from typing import Dict, Any
from app.schemas.financial import AIAnalysisResult, RiskItem, Recommendation

class AIService:
    def __init__(self):
        # In a real app, initialize OpenAI client here
        # self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        pass

    async def analyze_financials(self, financial_data: Dict[str, Any], industry: str) -> AIAnalysisResult:
        """
        Main entry point for AI analysis.
        For Hackathon/Demo mode, we will use a sophisticated deterministic mock if no key is present,
        or we can simulate the LLM response.
        """
        # Logic to extract key metrics from the raw data would go here
        # For now, we assume the data_processor gave us some summary stats, 
        # or we just mock the intelligence based on the "industry" and "randomness"
        
        # Mock specific industry insights
        if industry.lower() == "manufacturing":
             return self._generate_manufacturing_mock()
        elif industry.lower() == "retail":
             return self._generate_retail_mock()
        else:
             return self._generate_generic_mock()

    def _generate_manufacturing_mock(self) -> AIAnalysisResult:
        return AIAnalysisResult(
            health_score=72,
            health_summary="Your manufacturing unit shows strong order book but high inventory holding costs. Liquidity is moderate.",
            risks=[
                RiskItem(category="Inventory", severity="High", message="Raw material inventory turnover has slowed by 15%."),
                RiskItem(category="Cash Flow", severity="Medium", message="Payment delays from 2 major distributors.")
            ],
            recommendations=[
                Recommendation(title="Negotiate Supplier Terms", description="Extend payment terms with steel vendor from 30 to 45 days.", impact="Save ₹2.5L working capital", action_type="Cost"),
                Recommendation(title="Invoice Discounting", description="Use invoice financing for the pending ₹50L receivables.", impact="Immediate liquidity", action_type="Loan")
            ],
            forecast_narrative="Q3 output is projected to grow by 8%, but energy costs may rise. Focus on machine efficiency.",
            benchmarks={"industry_average_margin": "12%", "your_margin": "10.5%"}
        )

    def _generate_retail_mock(self) -> AIAnalysisResult:
        return AIAnalysisResult(
            health_score=85,
            health_summary="Excellent sales velocity. Seasonal inventory is well managed.",
            risks=[
                RiskItem(category="Competition", severity="Low", message="New local competitor entering market."),
            ],
            recommendations=[
                Recommendation(title="Loyalty Program", description="Launch points system to retain holiday shoppers.", impact="Increase LTV by 20%", action_type="Revenue"),
            ],
            forecast_narrative="Holiday season projected to break records. Ensure staffing is adequate.",
            benchmarks={"industry_average_margin": "18%", "your_margin": "22%"}
        )

    def _generate_generic_mock(self) -> AIAnalysisResult:
        return AIAnalysisResult(
            health_score=65,
            health_summary="Business is stable but operating costs are higher than industry average.",
            risks=[
                RiskItem(category="Opex", severity="High", message="Office rental and utilizing costs are 20% above benchmark."),
            ],
            recommendations=[
                Recommendation(title="Remote Work Policy", description="Reduce office space to save rental costs.", impact="Save ₹1.2L/month", action_type="Cost"),
            ],
            forecast_narrative="Stable growth expected. Watch out for regulatory changes in Q4.",
            benchmarks={"industry_average_margin": "15%", "your_margin": "11%"}
        )

ai_service = AIService()
