# FinSight AI - Financial Health Platform for SMEs

FinSight AI is a production-grade SaaS web application that helps Small & Medium Enterprises (SMEs) analyze their financial health using AI-powered insights with **PostgreSQL database storage**.

## 🚀 Features

- **Database-Backed Storage**: All financial data and analyses stored in PostgreSQL
- **Intelligent Data Processing**: Upload CSV/Excel financial documents
- **AI-Powered Analysis**: Real financial analysis using OpenAI GPT (with intelligent fallback)
- **Automatic Column Detection**: Smart parsing of various financial data formats
- **Financial Health Scoring**: 0-100 score based on profitability, liquidity, and efficiency
- **Risk Detection**: Identifies cost control, margin pressure, and revenue risks
- **Actionable Recommendations**: Specific steps with estimated impact
- **Reports Management**: View and download historical financial reports
- **Company Settings**: Manage company details and preferences
- **Visual Dashboards**: Charts, KPIs, and trend analysis
- **Multi-language Support**: Toggle between English and Hindi
- **Secure Authentication**: User registration and login system

## 📋 Prerequisites

- Python 3.10+
- Node.js 16+ & npm
- PostgreSQL 12+ (or use SQLite for development)
- (Optional) OpenAI API key for enhanced AI analysis

## 🛠️ Database Setup

### Option 1: SQLite (Development - Default)
No setup required! The app will create `finsight_v2.db` automatically.

### Option 2: PostgreSQL (Production - Recommended)

1. **Install PostgreSQL** (if not already installed)
2. **Create Database**:
   ```sql
   CREATE DATABASE finsight_db;
   CREATE USER finsight_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE finsight_db TO finsight_user;
   ```

3. **Update `.env` file**:
   ```env
   DATABASE_URL=postgresql://finsight_user:your_password@localhost:5432/finsight_db
   ```

## 🔧 Installation

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and configure your database and API keys

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run at:** `http://localhost:8000`  
**API Docs:** `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run at:** `http://localhost:5173`

## 🎯 How to Use

1. **Open the application**: Navigate to `http://localhost:5173`
2. **Register/Login** to access your dashboard
3. **Configure Company Settings**:
   - Go to "Settings" page
   - Enter your company details (name, email, industry, etc.)
   - Click "Save Changes"
4. **Upload Financial Data**:
   - Go to "Upload Data" page
   - Drag & drop or browse for your CSV/Excel file
   - Sample file provided: `sample_financial_data.csv`
5. **View AI Analysis**:
   - After upload, click "View Dashboard Insights"
   - See your financial health score, risks, and recommendations
6. **Access Reports**:
   - Go to "Reports" page
   - View all historical analyses
   - Click on any report to see detailed breakdown

## 📊 Data Format

Your CSV/Excel file should have columns like:

```
Date, Description, Category, Amount, Type
2024-01-15, Client Payment, Sales, 5000, Income
2024-01-16, Office Rent, Rent, -2000, Expense
```

**The system auto-detects columns**, so variations like:
- `transaction_date`, `datetime`, `date`
- `transaction_type`, `type`, `category`
- `value`, `total`, `debit`, `credit`

...are all supported!

## 🤖 AI Analysis

### With OpenAI API Key
- Add your key to `.env` file: `OPENAI_API_KEY=sk-your-key-here`
- Get advanced GPT-4 powered analysis
- Contextual, industry-specific insights

### Without API Key (Default)
- Intelligent rule-based analysis
- Calculates health scores, profit margins, expense ratios
- Identifies risks and generates recommendations
- **No API key required to get started!**

## 🏗 Project Structure

```
finsight-ai/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    # API routes
│   │   │   ├── financial.py     # Financial data & reports
│   │   │   └── company.py       # Company settings
│   │   ├── models/              # Database models
│   │   │   └── database.py      # SQLAlchemy models
│   │   ├── services/            # Business logic
│   │   │   ├── ai_engine.py     # AI analysis
│   │   │   └── data_processor.py # Data parsing
│   │   ├── schemas/             # Pydantic models
│   │   ├── core/                # Config & database
│   │   └── main.py              # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Upload.jsx       # File upload
│   │   │   ├── Reports.jsx      # Reports list & detail
│   │   │   └── Settings.jsx     # Company settings
│   │   ├── components/          # Reusable UI components
│   │   └── App.jsx
│   └── package.json
└── sample_financial_data.csv    # Test data
```

## 🗄️ Database Schema

### Tables:
- **companies**: Company information and settings
- **financial_uploads**: Uploaded files and extracted metrics
- **reports**: Generated financial reports

All data is automatically created on first run!

## 🔐 Security

- Financial data stored securely in database
- PostgreSQL recommended for production
- HTTPS enabled in production
- JWT authentication ready
- Passwords hashed with bcrypt
- Environment variables for all secrets
- CORS protection configured

## 🚀 Production Deployment

### Quick Deploy

Deploy to **FREE tier** services (Render + Vercel + PostgreSQL):

1. **Push to GitHub**
2. **Deploy Backend** → Render.com (auto-detects `backend/render.yaml`)
3. **Deploy Frontend** → Vercel (auto-detects `frontend/vercel.json`)
4. **Update Environment Variables**

**📚 Deployment Guides:**
- **Quick Start**: See `QUICK_DEPLOY.md` (5-minute guide)
- **Comprehensive Guide**: See `DEPLOYMENT.md` (step-by-step)

**🎯 Deployment Stack:**
- **Frontend**: Vercel (Free - Unlimited deploys)
- **Backend**: Render (Free - 750 hours/month)
- **Database**: Render PostgreSQL (Free - 1GB)

**✅ Features:**
- ✅ HTTPS enabled automatically
- ✅ Database persistence included
- ✅ CORS configured
- ✅ Secure logic

## 📄 License

MIT License - Built for SME Financial Intelligence
