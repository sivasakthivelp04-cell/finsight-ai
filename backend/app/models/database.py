
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    industry = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    financial_uploads = relationship("FinancialUpload", back_populates="company")
    reports = relationship("Report", back_populates="company")

class FinancialUpload(Base):
    __tablename__ = "financial_data_uploads"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    filename = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    total_revenue = Column(Float, default=0.0)
    total_expenses = Column(Float, default=0.0)
    net_profit = Column(Float, default=0.0)
    profit_margin = Column(Float, default=0.0)
    expense_ratio = Column(Float, default=0.0)
    
    # Encrypted fields stored as Text
    encrypted_categories = Column(Text, nullable=True)
    encrypted_top_expenses = Column(Text, nullable=True)
    encrypted_monthly_breakdown = Column(Text, nullable=True)
    encrypted_risks = Column(Text, nullable=True)
    encrypted_recommendations = Column(Text, nullable=True)
    encrypted_summary = Column(Text, nullable=True)
    
    health_score = Column(Integer, default=0)
    status = Column(String, nullable=True)
    forecast_narrative = Column(Text, nullable=True)
 
    accounts_receivable = Column(Float, default=0.0)
    accounts_payable = Column(Float, default=0.0)
    inventory_value = Column(Float, default=0.0)
    total_debt = Column(Float, default=0.0)
    
    creditworthiness_score = Column(Integer, default=0)
    encrypted_working_capital_analysis = Column(Text, nullable=True)
    
    # Extra Intelligence Fields
    encrypted_cost_optimization = Column(Text, nullable=True)
    encrypted_financial_products = Column(Text, nullable=True)
    encrypted_bookkeeping_tax = Column(Text, nullable=True)
    encrypted_credit_rationale = Column(Text, nullable=True)
 
    company = relationship("Company", back_populates="financial_uploads")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    upload_id = Column(Integer, ForeignKey("financial_data_uploads.id"))
    
    title = Column(String, nullable=False)
    report_type = Column(String, default="monthly")
    generated_at = Column(DateTime, default=datetime.utcnow)
    
    # Fully encrypted report content
    encrypted_content = Column(Text, nullable=True)
    
    # Soft delete flag
    is_deleted = Column(Integer, default=0) # 0 = active, 1 = deleted (hidden from UI)
    
    company = relationship("Company", back_populates="reports")
