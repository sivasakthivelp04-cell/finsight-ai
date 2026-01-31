
import os
import json
from typing import Dict, Any, List
from openai import OpenAI

class AIEngine:
    def __init__(self):
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY", "")
        self.client = OpenAI(api_key=api_key) if api_key else None
        
    def analyze_financials(self, financial_data: Dict[str, Any], industry: str = "General", language: str = 'en') -> Dict[str, Any]:
        """
        Use AI to analyze financial data and provide insights.
        Falls back to rule-based analysis if OpenAI API is not configured.
        """
        if self.client and os.getenv("OPENAI_API_KEY"):
            return self._ai_analysis(financial_data, industry, language)
        else:
            return self._rule_based_analysis(financial_data, industry, language)
    
    def _ai_analysis(self, financial_data: Dict[str, Any], industry: str, language: str) -> Dict[str, Any]:
        prompt = self._build_analysis_prompt(financial_data, industry, language)
        
        try:
            # Avoid f-string here just in case
            system_msg = "You are an expert financial consultant for " + industry + " SMEs. Your goal is to provide deep financial intelligence. "
            if language == 'hi':
                system_msg += "CRITICAL: You MUST provide all narrative descriptions, summaries, risk messages, and recommendation actions in HINDI. Do NOT use English for these fields."
            else:
                system_msg += "Provide all fields in English."
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print("AI Analysis Error: " + str(e))
            return self._rule_based_analysis(financial_data, industry, language)
    
    def _build_analysis_prompt(self, financial_data: Dict[str, Any], industry: str, language: str) -> str:
        lang_instruction = "IMPORTANT: Provide all narrative fields in HINDI" if language == 'hi' else "Provide all fields in English"
        
        template = """
Analyze the financial performance of an SME in the {sector} sector using the provided data triggers.

Dimensions provided:
- Revenue: {revenue}
- Expenses: {expenses} (Breakdown: {categories})
- Profit: {profit}
- Accounts Receivable (AR): {ar}
- Accounts Payable (AP): {ap}
- Inventory Value: {inventory}
- Total Debt/Loans: {debt}

Your goal is to act as a Tier-1 Financial Consultant. Do NOT provide generic advice. Provide DATA-DRIVEN intelligence.

Task Guidelines:
1.  **Cost Optimization**: Look at the expense ratio and categories. If admin/marketing/fixed costs are high relative to revenue, suggest SPECIFIC percentage cuts (e.g. "Reduce admin overhead by 12% to improve margin").
2.  **Financial Products**: Recommend products based on Cash Flow and Credit Score. 
    - If cash is low vs AP: Suggest Working Capital Loan or OD.
    - If AR is high: Suggest Bill Discounting or Invoice Financing.
    - If growing: Suggest Business Expansion Loan.
3.  **Tax & Bookkeeping**: Detect anomalies. If tax paid is 0 but revenue is high, flag GST/TDS compliance. Look for missing invoice patterns.
4.  **Working Capital**: Analyze the AR vs AP gap. If AR > AP, flag liquidity risks if the gap is too large. If AP is high, warn about supplier trust risks and credit rating impact.
5.  **Industry Benchmarks**: Compare the user's profit margin and expense ratio against {sector} industry averages. Use terms like "Outperforming" or "Below Avg".
6.  **Executive Summary**: Provide a deep 3-4 sentence intelligence report that connects these dots.

Respond ONLY in JSON format:
{{
    "health_score": 0,
    "status": "Healthy/At Risk/Critical",
    "summary": "narrative summary",
    "risks": [
        {{"type": "string", "severity": "Low/Medium/High", "message": "specific data-triggered message"}}
    ],
    "recommendations": [
        {{"action": "string", "impact": "string", "category": "Cost/Tax/Operations/Growth"}}
    ],
    "cost_optimization": [
        {{"area": "string", "suggestion": "data-driven suggestion with % targets", "savings_potential": "X%"}}
    ],
    "financial_products": [
        {{"product": "string", "provider_type": "Bank/NBFC", "rationale": "why this matches their current cash flow/score"}}
    ],
    "bookkeeping_tax_compliance": {{
        "bookkeeping_status": "string",
        "tax_insights": "specific GST/TDS alerts",
        "compliance_watch": ["TDS", "GST Return", "Invoice Audit"]
    }},
    "working_capital_analysis": {{
        "status": "Good/Warning/Critical",
        "message": "detailed analysis of AR/AP cycles and liquidity risk"
    }},
    "creditworthiness": {{
        "score": 0,
        "rationale": "specific reason based on debt-to-income and payment capacity"
    }},
    "industry_benchmarks": {{
        "profit_margin_avg": 0,
        "revenue_growth_avg": 0,
        "expense_ratio_avg": 0,
        "user_comparison": "how user compares to these benchmarks"
    }},
    "forecast": "narrative 12-month outlook based on trajectory"
}}

{lang}
"""
        return template.format(
            sector=industry,
            revenue=financial_data.get('total_revenue', 0),
            expenses=financial_data.get('total_expenses', 0),
            profit=financial_data.get('net_profit', 0),
            ar=financial_data.get('accounts_receivable', 0),
            ap=financial_data.get('accounts_payable', 0),
            inventory=financial_data.get('inventory_value', 0),
            debt=financial_data.get('total_debt', 0),
            categories=json.dumps(financial_data.get('categories', {}), indent=2),
            lang=lang_instruction
        )
    
    def _rule_based_analysis(self, financial_data: Dict[str, Any], industry: str, language: str) -> Dict[str, Any]:
        revenue = financial_data.get('total_revenue', 0)
        expenses = financial_data.get('total_expenses', 0)
        profit = financial_data.get('net_profit', 0)
        ar = financial_data.get('accounts_receivable', 0)
        ap = financial_data.get('accounts_payable', 0)
        debt = financial_data.get('total_debt', 0)
        margin = financial_data.get('profit_margin', 0)
        expense_ratio = financial_data.get('expense_ratio', 0)
        
        # Performance Indicators
        is_high_ar = ar > (revenue * 0.2)
        is_low_margin = margin < 15
        is_high_debt = debt > (revenue * 0.4)
        
        # Enhanced Health Score calculation
        score = 65
        if profit > 0: score += 15
        if margin > 20: score += 10
        if ar < ap and ar > 0: score += 5
        if is_high_debt: score -= 20
        if is_low_margin: score -= 10
        
        final_score = min(92, max(0, score))
        
        # Data-driven Cost Optimization logic
        cost_opt = []
        if expense_ratio > 30:
            target = 10 if expense_ratio < 50 else 15
            cost_opt.append({
                "area": "परिचालन व्यय (Operating Expenses)" if language == 'hi' else "Operating Expenses",
                "suggestion": f"व्यय अनुपात {expense_ratio:.1f}% है। विपणन और व्यवस्थापक लागत को {target}% तक कम करने की सिफारिश की जाती है।" if language == 'hi' else f"Operating expenses are {expense_ratio:.1f}% of revenue. Recommended: reduce marketing & admin costs by {target}-{target+5}%.",
                "savings_potential": f"{target}%"
            })
        else:
            cost_opt.append({
                "area": "फिक्स्ड कॉस्ट (Fixed Costs)" if language == 'hi' else "Fixed Costs",
                "suggestion": "बेहतर मार्जिन के लिए उपयोगिताओं और किराए पर फिर से बातचीत करें।" if language == 'hi' else "Renegotiate utilities and rent for better margins.",
                "savings_potential": "5%"
            })

        # Data-driven Products
        products = []
        if is_high_ar:
            products.append({
                "product": "चालान वित्तपोषण (Invoice Financing)" if language == 'hi' else "Invoice Financing",
                "provider_type": "NBFC",
                "rationale": "आपके पास उच्च प्राप्य खाते (AR) हैं। नकदी प्रवाह के लिए इनका उपयोग करें।" if language == 'hi' else "High receivables detected. Use invoice financing to unlock cash flow."
            })
        elif profit > 0 and final_score > 70:
            products.append({
                "product": "व्यापार विस्तार ऋण (Business Expansion Loan)" if language == 'hi' else "Business Expansion Loan",
                "provider_type": "Bank",
                "rationale": "मजबूत स्वास्थ्य स्कोर और लाभप्रदता के आधार पर विकास के लिए पात्र।" if language == 'hi' else "Eligible for growth capital based on strong health score and profitability."
            })
        else:
            products.append({
                "product": "कार्यशील पूंजी ऋण (Working Capital Loan)" if language == 'hi' else "Working Capital Loan",
                "provider_type": "Bank/NBFC",
                "rationale": "दैनिक कार्यों को सुचारू रूप से चलाने के लिए।" if language == 'hi' else "To maintain smooth day-to-day operations."
            })

        # Working Capital Analysis
        wc_status = "Good"
        wc_msg = "कार्यशील पूंजी चक्र संतुलित है।" if language == 'hi' else "Working capital cycle is balanced."
        if is_high_ar:
            wc_status = "Warning"
            wc_msg = "उच्च प्राप्य राशि (AR) संग्रह में देरी का संकेत देती है - नकदी प्रवाह जोखिम।" if language == 'hi' else "High receivables indicate delays in collection - cash flow risk."
        elif ap > ar and ar > 0:
            wc_status = "Critical"
            wc_msg = "देय राशि प्राप्य से अधिक है। आपूर्तिकर्ता विश्वास जोखिम बढ़ सकता है।" if language == 'hi' else "Payables exceed receivables. Supplier trust risk may increase."

        return {
            "health_score": final_score,
            "status": ("स्वस्थ" if final_score > 70 else "जोखिम में") if language == 'hi' else ("Healthy" if final_score > 70 else "At Risk"),
            "summary": f"Business is {('Healthy' if final_score > 70 else 'At Risk')} with a score of {final_score}. Revenue is ${revenue:,.2f}." if language != 'hi' else f"व्यवसाय {final_score} के स्कोर के साथ {'स्वस्थ' if final_score > 70 else 'जोखिम में'} है। राजस्व ${revenue:,.2f} है।",
            "risks": [
                {
                    "type": "तरलता (Liquidity)" if language == 'hi' else "Liquidity", 
                    "severity": "High" if is_high_ar else "Medium", 
                    "message": "नकदी प्रवाह बनाए रखने के लिए संग्रह चक्र की बारीकी से निगरानी करें।" if language == 'hi' else "Closely monitor collection cycle to maintain cash flow."
                }
            ],
            "recommendations": [
                {
                    "action": "कर अनुपालन (Tax Compliance)" if language == 'hi' else "Tax Compliance", 
                    "impact": "कानूनी जोखिम कम करें" if language == 'hi' else "Reduce legal risk", 
                    "category": "Tax"
                }
            ],
            "cost_optimization": cost_opt,
            "financial_products": products,
            "bookkeeping_tax_compliance": {
                "bookkeeping_status": ("अच्छी" if profit > 0 else "सुधार की आवश्यकता है") if language == 'hi' else ("Good" if profit > 0 else "Needs Improvement"),
                "tax_insights": "जीएसटी रिटर्न की जांच करें और टीडीएस मिलान सुनिश्चित करें।" if language == 'hi' else "Check GST returns and ensure TDS reconciliation.",
                "compliance_watch": ["GST", "TDS", "Income Tax"]
            },
            "working_capital_analysis": {
                "status": wc_status,
                "message": wc_msg
            },
            "creditworthiness": {
                "score": int(final_score * 0.9),
                "rationale": "स्थिर आय और ऋण प्रबंधन इतिहास।" if language == 'hi' else "Consistent income and debt management history."
            },
            "industry_benchmarks": {
                "profit_margin_avg": 18.5 if industry != "General" else 15.0,
                "revenue_growth_avg": 12.0,
                "expense_ratio_avg": 72.0,
                "user_comparison": "औसत से ऊपर" if margin > 18 else "औसत" if language == 'hi' else ("Above Average" if margin > 18 else "Average")
            },
            "forecast": "12 महीनों में 10-15% विकास की उम्मीद है।" if language == 'hi' else "Expected 10-15% growth over 12 months."
        }
    
    def translate_analysis(self, summary: str, risks: List[Dict], recommendations: List[Dict], 
                          forecast: str, status: str, language: str, financial_data: Dict[str, Any], 
                          industry: str) -> Dict[str, Any]:
        """
        Translate existing AI analysis to a different language.
        This is used when switching languages without re-analyzing the data.
        """
        if self.client and os.getenv("OPENAI_API_KEY"):
            return self._ai_translate(summary, risks, recommendations, forecast, status, language, financial_data, industry)
        else:
            return self._rule_based_translate(summary, risks, recommendations, forecast, status, language)
    
    def _ai_translate(self, summary: str, risks: List[Dict], recommendations: List[Dict], 
                     forecast: str, status: str, language: str, financial_data: Dict[str, Any], 
                     industry: str) -> Dict[str, Any]:
        """Use AI to translate the analysis to the requested language."""
        lang_name = "Hindi" if language == 'hi' else "English"
        
        prompt = f"""
Translate the following financial analysis to {lang_name}. Maintain the same structure and meaning.

Original Summary: {summary}
Original Forecast: {forecast}
Original Status: {status}
Original Risks: {json.dumps(risks, indent=2)}
Original Recommendations: {json.dumps(recommendations, indent=2)}

Financial Context:
- Revenue: ${financial_data.get('total_revenue', 0):,.2f}
- Profit: ${financial_data.get('net_profit', 0):,.2f}
- Industry: {industry}

Respond ONLY in JSON format:
{{
    "summary": "translated summary in {lang_name}",
    "forecast": "translated forecast in {lang_name}",
    "status": "translated status in {lang_name} (Healthy/At Risk/Critical or स्वस्थ/जोखिम में/गंभीर)",
    "risks": [
        {{"type": "translated type", "severity": "Low/Medium/High", "message": "translated message in {lang_name}"}}
    ],
    "recommendations": [
        {{"action": "translated action in {lang_name}", "impact": "translated impact in {lang_name}", "category": "category"}}
    ]
}}

CRITICAL: All narrative text MUST be in {lang_name}.
For status field:
- If {lang_name} is Hindi: use "स्वस्थ" for Healthy, "जोखिम में" for At Risk, "गंभीर" for Critical
- If {lang_name} is English: use "Healthy", "At Risk", "Critical"
"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": f"You are a professional translator specializing in financial content. Translate to {lang_name}."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Translation Error: {str(e)}")
            return self._rule_based_translate(summary, risks, recommendations, forecast, status, language)
    
    def _rule_based_translate(self, summary: str, risks: List[Dict], recommendations: List[Dict], 
                             forecast: str, status: str, language: str) -> Dict[str, Any]:
        """Fallback: Return simple translated versions."""
        # Translate status
        status_map = {
            'hi': {
                'Healthy': 'स्वस्थ',
                'At Risk': 'जोखिम में',
                'Critical': 'गंभीर',
                'स्वस्थ': 'स्वस्थ',
                'जोखिम में': 'जोखिम में',
                'गंभीर': 'गंभीर'
            },
            'en': {
                'Healthy': 'Healthy',
                'At Risk': 'At Risk',
                'Critical': 'Critical',
                'स्वस्थ': 'Healthy',
                'जोखिम में': 'At Risk',
                'गंभीर': 'Critical'
            }
        }
        
        translated_status = status_map.get(language, {}).get(status, status)
        
        if language == 'hi':
            return {
                "summary": "वित्तीय विश्लेषण उपलब्ध है।" if "analysis available" in summary.lower() else summary,
                "forecast": forecast or "स्थिर विकास की उम्मीद है।",
                "status": translated_status,
                "risks": risks or [{"type": "वित्तीय", "severity": "Medium", "message": "जोखिम विश्लेषण उपलब्ध है।"}],
                "recommendations": recommendations or [{"action": "वित्तीय अनुकूलन", "impact": "सुधार", "category": "General"}]
            }
        else:
            return {
                "summary": summary if summary else "Financial analysis available.",
                "forecast": forecast or "Steady growth expected.",
                "status": translated_status,
                "risks": risks or [{"type": "Financial", "severity": "Medium", "message": "Risk analysis available."}],
                "recommendations": recommendations or [{"action": "Financial optimization", "impact": "Improvement", "category": "General"}]
            }



ai_engine = AIEngine()

