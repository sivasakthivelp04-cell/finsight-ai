# FinSight AI - Implementation Plan & Architecture

## 1. Application Structure
```text
finsight-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Entry point
│   │   ├── core/
│   │   │   ├── config.py        # Settings (DB, API Keys)
│   │   │   └── security.py      # JWT & Password hashing
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py
│   │   │   │   │   ├── business.py
│   │   │   │   │   ├── financial.py
│   │   │   │   │   └── reports.py
│   │   │   │   └── api.py
│   │   ├── models/              # SQLAlchemy Models
│   │   │   ├── user.py
│   │   │   ├── business.py
│   │   │   └── financial_data.py
│   │   ├── schemas/             # Pydantic Schemas
│   │   │   ├── user.py
│   │   │   └── business.py
│   │   ├── services/
│   │   │   ├── ai_engine.py     # LLM Logic (GPT/Claude)
│   │   │   ├── data_processor.py # Pandas: CSV/PDF intake
│   │   │   └── risk_engine.py   # Risk calculations
│   │   └── utils/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/          # Buttons, Cards, Inputs
│   │   │   ├── layout/          # Sidebar, Navbar
│   │   │   └── widgets/         # Charts, Scorecards
│   │   ├── context/             # AuthContext, LanguageContext
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/            # API calls
│   │   ├── translations/        # en.json, hi.json
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 2. Frontend UI Layout (React + Tailwind)
*   **Theme**: Professional Fintech (Dark Navy/Slate Blue + Gold/Green accents). Glassmorphism for cards.
*   **Layout**: Sidebar navigation (Logo, Dashboard, Upload, Analytics, Settings). Top bar (User profile, Language Toggle).
*   **Dashboard**:
    *   *Hero Section*: "Financial Health Score" (Gauge Chart) + Quick Status (Good/Risk).
    *   *Grid*: 4 Key Metrics (Profitability, Liquidity, Burn Rate, Cash Flow).
    *   *Charts*: Month-over-Month Revenue (Bar), Expense Breakdown (Pie).
    *   *Risk Panel*: Alerts for high-risk areas.
    *   *AI Insights*: Scrollable feed of text insights.

## 3. Backend API Routes (FastAPI)
*   `POST /auth/login` - Returns JWT.
*   `POST /auth/signup` - Create user.
*   `POST /business/onboard` - Set industry, company name.
*   `POST /financial/upload` - Upload PDF/CSV. (Triggers Async Processing).
*   `GET /financial/dashboard` - Get aggregated metrics.
*   `GET /financial/score` - Get calculated health score.
*   `GET /reports/ai-analysis` - Trigger/Get LLM analysis.

## 4. AI Prompt Templates
**Role**: Financial Analyst for SMEs.
**Task**: Analyze the provided financial JSON/CSV summary.
**Output JSON format**:
```json
{
  "health_score": 78,
  "summary": "Your business is stable but inventory costs are high.",
  "risks": [
    {"type": "Inventory", "severity": "Medium", "message": "Holding cost increased by 15%"}
  ],
  "recommendations": [
    {"action": "Negotiate with vendor X", "impact": "Save $2k/mo"}
  ],
  "forecast_narrative": "Based on current trends, revenue will dip in Q3."
}
```

## 5. Security Model
*   **Auth**: OAuth2 with Password Flow (JWT).
*   **Data**: Financial data stored in 'Financials' table. Sensitive fields encrypted.
*   **Access**: `owner` role implies full access to own business data.

## 6. Demo Walkthrough Logic
1.  User Logs in (Demo User).
2.  Data upload is pre-filled with "Demo_Manufacturing_Pvt_Ltd.csv".
3.  System simulates "Processing..." (2 seconds).
4.  Dashboard populates with mock manufacturing data.
5.  Language toggle instantly translates labels to Hindi.

## 7. Next Steps
I will now commence the build process:
1.  Initialize Frontend (Vite).
2.  Initialize Backend (FastAPI).
3.  Create the Core Logic (Data Processing & AI Mock).
4.  Assemble the Dashboard.
