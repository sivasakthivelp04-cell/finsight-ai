# FinSight AI - Financial Health Platform for SMEs

FinSight AI is a production-grade SaaS web application that helps Small & Medium Enterprises (SMEs) analyze their financial health using AI-powered insights with **PostgreSQL database storage**.

## 🚀 Features

- **Database-Backed Storage**: All financial data and analyses stored in PostgreSQL
- **Intelligent Data Processing**: Upload CSV/Excel/PDF financial documents
- **AI-Powered Analysis**: Real financial analysis using OpenAI GPT (with intelligent fallback)
- **Automatic Column Detection**: Smart parsing of various financial data formats
- **Financial Health Scoring**: 0-100 score based on profitability, liquidity, and efficiency
- **Risk Detection**: Identifies cost control, margin pressure, and revenue risks
- **Actionable Recommendations**: Specific steps with estimated impact
- **Reports Management**: View and download historical financial reports
- **Company Settings**: Manage company details and preferences
- **Visual Dashboards**: Charts, KPIs, and trend analysis

## 📋 Prerequisites

- Python 3.10+
- Node.js 16+ & npm
- PostgreSQL 12+ (or use SQLite for development)
- (Optional) OpenAI API key for enhanced AI analysis

## �️ Database Setup

### Option 1: SQLite (Development - Default)
No setup required! The app will create `finsight.db` automatically.

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

## �🔧 Installation

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
2. **Login** (demo mode - any credentials work)
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

## �️ Database Schema

### Tables:
- **companies**: Company information and settings
- **financial_uploads**: Uploaded files and extracted metrics
- **reports**: Generated financial reports

All data is automatically created on first run!

## 🔐 Security

- Financial data stored securely in database
- PostgreSQL recommended for production
- HTTPS recommended for production
- JWT authentication ready (extend as needed)

## 🧪 Testing

Use the provided `sample_financial_data.csv` to test:
- Revenue: $213,200
- Expenses: $73,700
- Net Profit: $139,500
- Expected Health Score: ~85-90

## 📝 API Endpoints

### Financial
- `POST /api/v1/financial/upload` - Upload and process file
- `GET /api/v1/financial/dashboard` - Get latest metrics
- `GET /api/v1/financial/reports` - List all reports
- `GET /api/v1/financial/reports/{id}` - Get report detail
- `GET /api/v1/financial/history` - Upload history

### Company
- `GET /api/v1/company/` - Get company settings
- `PUT /api/v1/company/` - Update company settings

## 🌐 Environment Variables

Create `backend/.env`:

```env
# Database (choose one)
DATABASE_URL=sqlite:///./finsight.db  # Development
# DATABASE_URL=postgresql://user:pass@localhost:5432/finsight_db  # Production

# OpenAI (Optional)
OPENAI_API_KEY=sk-your-key-here

# Security
SECRET_KEY=your-secret-key-here

# CORS
BACKEND_CORS_ORIGINS=http://localhost:5173
```

## 🚀 Production Deployment

### Quick Deploy (5 Minutes)

Deploy to **FREE tier** services (Render + Vercel + PostgreSQL):

1. **Push to GitHub**
2. **Deploy Backend** → Render.com (auto-detects `backend/render.yaml`)
3. **Deploy Frontend** → Vercel (auto-detects `frontend/vercel.json`)
4. **Update Environment Variables**

**📚 Deployment Guides:**
- **Quick Start**: See `QUICK_DEPLOY.md` (5-minute guide)
- **Comprehensive Guide**: See `DEPLOYMENT.md` (step-by-step)
- **Summary**: See `DEPLOYMENT_SUMMARY.md` (what's included)
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md` (track progress)

**🎯 Deployment Stack:**
- **Frontend**: Vercel (Free - Unlimited deploys, 100GB bandwidth)
- **Backend**: Render (Free - 750 hours/month)
- **Database**: Render PostgreSQL (Free - 1GB, 90 days retention)
- **Email**: Gmail SMTP or SendGrid (Free)

**✅ Features:**
- ✅ HTTPS enabled automatically
- ✅ Auto-deployment from Git
- ✅ Environment variable management
- ✅ Database persistence across redeployments
- ✅ CORS configured
- ✅ Email service ready

**🔐 Security:**
- ✅ Passwords hashed with bcrypt
- ✅ No hardcoded credentials
- ✅ Environment variables for all secrets
- ✅ CORS protection
- ✅ SQL injection prevention (SQLAlchemy ORM)


## 📄 License

MIT License - Built for SME Financial Intelligence

## 🆕 What's New

### Database Integration
- ✅ PostgreSQL/SQLite support
- ✅ All financial data persisted
- ✅ Historical reports storage
- ✅ Company settings management

### Removed Features
- ❌ Industry Setup page (replaced with Settings)
- ❌ Hardcoded mock data
- ❌ SessionStorage dependencies

### New Features
- ✅ Settings page for company details
- ✅ Reports page with detailed view
- ✅ Database-backed dashboard
- ✅ Persistent data storage

## 🤝 Support

For issues or questions, check the API documentation at `/docs` when the backend is running.

# For running backend

python -m uvicorn app.main:app --reload   

# For running frontend

npm run dev

