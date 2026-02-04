
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

from app.core.database import get_db
from app.models.database import FinancialUpload, Report, Company
from app.services.data_processor import DataProcessor
from app.services.ai_engine import ai_engine
from app.core.security import encryption_service
from app.services.report_generator import report_generator

router = APIRouter()
DEMO_COMPANY_ID = 1

@router.post("/upload")
async def upload_financial_data(
    file: UploadFile = File(...),
    lang: str = "en",
    industry: str = "General",
    id: int = DEMO_COMPANY_ID,
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please use CSV or Excel.")
    
    contents = await file.read()
    
    try:
        financial_data = DataProcessor.process_file(contents, file.filename)
        if "error" in financial_data:
            raise HTTPException(status_code=400, detail=financial_data["error"])
            


        print(f"File processed: {file.filename}")
        
        ai_analysis = ai_engine.analyze_financials(
            financial_data=financial_data,
            industry=industry,
            language=lang
        )
        print("AI Analysis complete")
        
        # Verify company exists
        company = db.query(Company).filter(Company.id == id).first()
        if not company:
            raise HTTPException(status_code=404, detail=f"Company with ID {id} not found. Please log in again.")
        
        # Extract AI data with robust defaults
        health_score = int(ai_analysis.get('health_score', 0))
        status_val = ai_analysis.get('status', 'N/A')
        summary_val = ai_analysis.get('summary', 'No summary available.')
        risks_val = ai_analysis.get('risks', [])
        recs_val = ai_analysis.get('recommendations', [])
        forecast_val = ai_analysis.get('forecast', '')
        
        working_cap_val = ai_analysis.get('working_capital_analysis', {})
        cost_opt_val = ai_analysis.get('cost_optimization', [])
        fin_prod_val = ai_analysis.get('financial_products', [])
        tax_val = ai_analysis.get('bookkeeping_tax_compliance', {})
        
        credit_data = ai_analysis.get('creditworthiness', {})
        credit_score = int(credit_data.get('score', 0)) if isinstance(credit_data, dict) else 0
        credit_rat = str(credit_data.get('rationale', '')) if isinstance(credit_data, dict) else ''

        # Mandatory Encryption for sensitive fields
        upload = FinancialUpload(
            company_id=id,
            filename=file.filename,
            total_revenue=float(financial_data.get('total_revenue') or 0),
            total_expenses=float(financial_data.get('total_expenses') or 0),
            net_profit=float(financial_data.get('net_profit') or 0),
            profit_margin=float(financial_data.get('profit_margin') or 0),
            expense_ratio=float(financial_data.get('expense_ratio') or 0),
            
            encrypted_categories=encryption_service.encrypt(json.dumps(financial_data.get('categories', {}))),
            encrypted_top_expenses=encryption_service.encrypt(json.dumps(financial_data.get('top_expenses', []))),
            encrypted_monthly_breakdown=encryption_service.encrypt(json.dumps(financial_data.get('monthly_breakdown', []))),
            
            health_score=health_score,
            status=status_val,
            encrypted_summary=encryption_service.encrypt(summary_val),
            encrypted_risks=encryption_service.encrypt(json.dumps(risks_val)),
            encrypted_recommendations=encryption_service.encrypt(json.dumps(recs_val)),
            forecast_narrative=forecast_val,
            
            accounts_receivable=float(financial_data.get('accounts_receivable') or 0.0),
            accounts_payable=float(financial_data.get('accounts_payable') or 0.0),
            inventory_value=float(financial_data.get('inventory_value') or 0.0),
            total_debt=float(financial_data.get('total_debt') or 0.0),
            
            creditworthiness_score=credit_score,
            encrypted_working_capital_analysis=encryption_service.encrypt(json.dumps(working_cap_val)),
            encrypted_cost_optimization=encryption_service.encrypt(json.dumps(cost_opt_val)),
            encrypted_financial_products=encryption_service.encrypt(json.dumps(fin_prod_val)),
            encrypted_bookkeeping_tax=encryption_service.encrypt(json.dumps(tax_val)),
            encrypted_credit_rationale=encryption_service.encrypt(credit_rat)
        )
        
        db.add(upload)
        db.commit()
        db.refresh(upload)
        
        report = Report(
            company_id=id,
            upload_id=upload.id,
            title=f"Analysis: {file.filename} ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')})",
            report_type="Ad-hoc",
            encrypted_content=encryption_service.encrypt(json.dumps({
                "financial_data": financial_data,
                "ai_analysis": ai_analysis
            }))
        )
        db.add(report)
        db.commit()
        print(f"COMMITTED to database: {upload.id}")
        
        return {"status": "success", "upload_id": upload.id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"UPLOAD ERROR: {str(e)}")
        # Provide a cleaner error message instead of the raw technical string
        if "IntegrityError" in str(e):
            raise HTTPException(status_code=400, detail="Database integrity error. This might happen if the company ID is invalid.")
        raise HTTPException(status_code=500, detail="An internal error occurred while saving your data. Please check if your account is active.")

@router.get("/dashboard")
async def get_dashboard(
    lang: str = "en", 
    id: int = DEMO_COMPANY_ID,
    db: Session = Depends(get_db)
):
    latest = db.query(FinancialUpload).filter(FinancialUpload.company_id == id).order_by(FinancialUpload.upload_date.desc()).first()
    if not latest: return {"has_data": False}
    
    # Decrypt basic info
    summary = encryption_service.decrypt(latest.encrypted_summary)
    risks = json.loads(encryption_service.decrypt(latest.encrypted_risks)) if latest.encrypted_risks else []
    recommendations = json.loads(encryption_service.decrypt(latest.encrypted_recommendations)) if latest.encrypted_recommendations else []
    forecast_narrative = latest.forecast_narrative
    status = latest.status
    
    # Decrypt new items
    cost_optimization = json.loads(encryption_service.decrypt(latest.encrypted_cost_optimization)) if latest.encrypted_cost_optimization else []
    financial_products = json.loads(encryption_service.decrypt(latest.encrypted_financial_products)) if latest.encrypted_financial_products else []
    bookkeeping_tax = json.loads(encryption_service.decrypt(latest.encrypted_bookkeeping_tax)) if latest.encrypted_bookkeeping_tax else {}
    credit_rationale = encryption_service.decrypt(latest.encrypted_credit_rationale) if latest.encrypted_credit_rationale else ""
    working_capital = json.loads(encryption_service.decrypt(latest.encrypted_working_capital_analysis)) if latest.encrypted_working_capital_analysis else {}

    # Re-translate/Re-analyze AI content if language parameter is provided
    if lang and lang != 'original':
        company = db.query(Company).filter(Company.id == id).first()
        industry = company.industry if company else "General"
        
        financial_data = {
            "total_revenue": latest.total_revenue,
            "total_expenses": latest.total_expenses,
            "net_profit": latest.net_profit,
            "profit_margin": latest.profit_margin,
            "expense_ratio": latest.expense_ratio,
            "accounts_receivable": latest.accounts_receivable,
            "accounts_payable": latest.accounts_payable,
            "inventory_value": latest.inventory_value,
            "total_debt": latest.total_debt,
            "categories": json.loads(encryption_service.decrypt(latest.encrypted_categories)) if latest.encrypted_categories else {}
        }
        
        # Fresh analysis in the requested language
        ai_analysis = ai_engine.analyze_financials(financial_data, industry, lang)
        
        summary = ai_analysis.get('summary', summary)
        risks = ai_analysis.get('risks', risks)
        recommendations = ai_analysis.get('recommendations', recommendations)
        forecast_narrative = ai_analysis.get('forecast', forecast_narrative)
        status = ai_analysis.get('status', status)
        cost_optimization = ai_analysis.get('cost_optimization', cost_optimization)
        financial_products = ai_analysis.get('financial_products', financial_products)
        bookkeeping_tax = ai_analysis.get('bookkeeping_tax_compliance', bookkeeping_tax)
        credit_rationale = ai_analysis.get('creditworthiness', {}).get('rationale', credit_rationale)
        working_capital = ai_analysis.get('working_capital_analysis', working_capital)
    
    # Get latest report id for export
    latest_report = db.query(Report).filter(Report.company_id == id, Report.upload_id == latest.id).first()
    report_id = latest_report.id if latest_report else None

    # Re-extract generic metadata if not present or specifically requested
    # For simplicity, we just return what's in the latest report or re-process
    latest_report = db.query(Report).filter(Report.company_id == id, Report.upload_id == latest.id).first()
    report_content = json.loads(encryption_service.decrypt(latest_report.encrypted_content)) if latest_report else {}
    generic_metadata = report_content.get('financial_data', {}).get('generic_metadata', {})

    return {
        "has_data": True,
        "report_id": latest_report.id if latest_report else None,
        "financial_data": {
            "total_revenue": latest.total_revenue,
            "total_expenses": latest.total_expenses,
            "net_profit": latest.net_profit,
            "profit_margin": latest.profit_margin,
            "expense_ratio": latest.expense_ratio,
            "accounts_receivable": latest.accounts_receivable,
            "accounts_payable": latest.accounts_payable,
            "inventory_value": latest.inventory_value,
            "total_debt": latest.total_debt,
            "categories": json.loads(encryption_service.decrypt(latest.encrypted_categories)) if latest.encrypted_categories else {},
            "top_expenses": json.loads(encryption_service.decrypt(latest.encrypted_top_expenses)) if latest.encrypted_top_expenses else [],
            "monthly_breakdown": json.loads(encryption_service.decrypt(latest.encrypted_monthly_breakdown)) if latest.encrypted_monthly_breakdown else [],
            "generic_metadata": generic_metadata
        },
        "ai_analysis": {
            "health_score": latest.health_score,
            "status": status,
            "summary": summary,
            "risks": risks,
            "recommendations": recommendations,
            "forecast_narrative": forecast_narrative,
            "creditworthiness_score": latest.creditworthiness_score,
            "creditworthiness_rationale": credit_rationale,
            "working_capital_analysis": working_capital,
            "cost_optimization": cost_optimization,
            "financial_products": financial_products,
            "bookkeeping_tax_compliance": bookkeeping_tax
        }
    }

@router.get("/reports")
async def get_reports(id: int = DEMO_COMPANY_ID, db: Session = Depends(get_db)):
    reports = db.query(Report).filter(Report.company_id == id, Report.is_deleted == 0).order_by(Report.generated_at.desc()).all()
    return {"reports": [{"id": r.id, "title": r.title, "report_type": r.report_type, "generated_at": r.generated_at.isoformat()} for r in reports]}

@router.get("/reports/{report_id}")
async def get_report_detail(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id, Report.is_deleted == 0).first()
    if not report: raise HTTPException(status_code=404, detail="Report not found or has been removed from UI")
    return {
        "id": report.id,
        "title": report.title,
        "generated_at": report.generated_at.isoformat(),
        "content": json.loads(encryption_service.decrypt(report.encrypted_content))
    }

@router.get("/reports/{report_id}/download")
async def download_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id, Report.is_deleted == 0).first()
    if not report: raise HTTPException(status_code=404, detail="Report not found")
    
    # Decrypt content
    content = json.loads(encryption_service.decrypt(report.encrypted_content))
    financial_data = content.get('financial_data', {})
    ai_analysis = content.get('ai_analysis', {})
    
    # Get company info
    company = db.query(Company).filter(Company.id == report.company_id).first()
    company_details = {
        "name": company.name,
        "industry": company.industry,
        "tax_id": company.tax_id,
        "phone": company.phone,
        "address": company.address
    }
    
    # Generate PDF
    pdf_buffer = report_generator.generate_financial_report(financial_data, ai_analysis, company_details)
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=FinSight_Report_{report_id}.pdf"}
    )

@router.delete("/reports/{report_id}")
async def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report:
        # SOFT DELETE: Mark as deleted but keep in database
        report.is_deleted = 1
        db.commit()
    return {"status": "hidden", "message": "Report removed from UI view"}



@router.post("/dashboard/clear")
@router.delete("/dashboard")
async def clear_dashboard_data(id: int = DEMO_COMPANY_ID, db: Session = Depends(get_db)):
    """
    Clear active dashboard data for the specific company.
    PRESESRVES history in the Reports tab.
    """
    print(f"Clearing dashboard for company_id: {id}")
    
    # Check if company exists first
    company = db.query(Company).filter(Company.id == id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Only delete FinancialUploads — Dashboard is a view of the latest upload.
    # Reports are kept as historical archive.
    db.query(FinancialUpload).filter(FinancialUpload.company_id == id).delete()
    db.commit()
    
    print(f"Dashboard cleared successfully for company {id}. History preserved.")
    return {"status": "success", "message": "Dashboard data cleared (History preserved)"}


